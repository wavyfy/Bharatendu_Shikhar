import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Extract storage path from a full public URL or relative path.
 * e.g., "https://xyz.supabase.co/storage/v1/object/public/articles/abc.jpg" -> "abc.jpg"
 */
function extractStoragePath(url: string | null, bucketName: string): string | null {
  if (!url) return null;
  try {
    if (url.includes(`/storage/v1/object/public/${bucketName}/`)) {
      const parts = url.split(`/storage/v1/object/public/${bucketName}/`);
      return parts[1] || null;
    }
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split("/");
    const bucketIdx = pathSegments.indexOf(bucketName);
    if (bucketIdx !== -1 && bucketIdx < pathSegments.length - 1) {
      return pathSegments.slice(bucketIdx + 1).join("/");
    }
  } catch {
    // If it's already a relative filename/path
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return url;
    }
  }
  return null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const url = new URL(req.url);
  
  // Parse params/body for dry_run
  let isDryRun = url.searchParams.get("dry_run") === "true";
  let batchLimit = parseInt(url.searchParams.get("limit") || "100", 10);

  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (typeof body.dry_run === "boolean") isDryRun = body.dry_run;
      if (typeof body.limit === "number") batchLimit = body.limit;
    } catch {
      // Ignore if body empty or invalid JSON
    }
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Retention boundary: 3 months ago (90 days)
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 90);
    const cutoffIso = cutoffDate.toISOString();

    console.log(`[Cleanup Job] Running cleanup for content older than ${cutoffIso} (dryRun=${isDryRun})`);

    const stats = {
      cutoffDate: cutoffIso,
      dryRun: isDryRun,
      articlesFound: 0,
      articlesDeleted: 0,
      articleLiveUpdatesDeleted: 0,
      articleBadgesDeleted: 0,
      articleImagesDeleted: 0,
      epapersFound: 0,
      epapersDeleted: 0,
      epaperPdfsDeleted: 0,
      epaperThumbnailsDeleted: 0,
      errors: [] as string[],
    };

    // -------------------------------------------------------------
    // 1. ARTICLE CLEANUP
    // Find articles where COALESCE(published_at, created_at) < cutoffIso
    // -------------------------------------------------------------
    const { data: oldArticles, error: articleFetchErr } = await supabaseAdmin
      .from("articles")
      .select("id, title, featured_image, published_at, created_at")
      .or(`published_at.lt.${cutoffIso},and(published_at.is.null,created_at.lt.${cutoffIso})`)
      .limit(batchLimit);

    if (articleFetchErr) {
      console.error("[Cleanup Job] Error fetching old articles:", articleFetchErr);
      stats.errors.push(`Article fetch error: ${articleFetchErr.message}`);
    } else if (oldArticles && oldArticles.length > 0) {
      stats.articlesFound = oldArticles.length;
      console.log(`[Cleanup Job] Found ${oldArticles.length} old articles for cleanup.`);

      const oldArticleIds = oldArticles.map((a) => a.id);

      // Get all remaining articles (not being deleted) to verify featured_image shared references
      const { data: remainingArticles } = await supabaseAdmin
        .from("articles")
        .select("featured_image")
        .not("id", "in", `(${oldArticleIds.join(",")})`)
        .not("featured_image", "is", null);

      const remainingImagePaths = new Set(
        (remainingArticles || [])
          .map((a) => extractStoragePath(a.featured_image, "articles"))
          .filter((p): p is string => Boolean(p))
      );

      // Collect image paths to delete from storage (only if not referenced by remaining articles)
      const articleFilesToDelete: string[] = [];
      for (const art of oldArticles) {
        const imagePath = extractStoragePath(art.featured_image, "articles");
        if (imagePath && !remainingImagePaths.has(imagePath)) {
          articleFilesToDelete.push(imagePath);
        }
      }

      if (!isDryRun) {
        // Delete child live updates
        const { error: liveUpErr, count: liveCount } = await supabaseAdmin
          .from("article_live_updates")
          .delete({ count: "exact" })
          .in("article_id", oldArticleIds);

        if (liveUpErr) {
          console.error("[Cleanup Job] Error deleting article live updates:", liveUpErr);
          stats.errors.push(`Live updates delete error: ${liveUpErr.message}`);
        } else {
          stats.articleLiveUpdatesDeleted = liveCount || 0;
        }

        // Delete child article badges
        const { error: badgeErr, count: badgeCount } = await supabaseAdmin
          .from("article_badges")
          .delete({ count: "exact" })
          .in("article_id", oldArticleIds);

        if (badgeErr) {
          console.error("[Cleanup Job] Error deleting article badges:", badgeErr);
          stats.errors.push(`Article badges delete error: ${badgeErr.message}`);
        } else {
          stats.articleBadgesDeleted = badgeCount || 0;
        }

        // Delete articles rows
        const { error: artDelErr, count: artDelCount } = await supabaseAdmin
          .from("articles")
          .delete({ count: "exact" })
          .in("id", oldArticleIds);

        if (artDelErr) {
          console.error("[Cleanup Job] Error deleting articles:", artDelErr);
          stats.errors.push(`Articles delete error: ${artDelErr.message}`);
        } else {
          stats.articlesDeleted = artDelCount || 0;

          // Remove unused files from "articles" storage bucket
          if (articleFilesToDelete.length > 0) {
            const { data: removedFiles, error: storageErr } = await supabaseAdmin.storage
              .from("articles")
              .remove(articleFilesToDelete);

            if (storageErr) {
              console.error("[Cleanup Job] Error removing article images from storage:", storageErr);
              stats.errors.push(`Article image storage delete error: ${storageErr.message}`);
            } else {
              stats.articleImagesDeleted = (removedFiles || []).length;
            }
          }
        }
      } else {
        // Dry-run reporting
        stats.articlesDeleted = oldArticles.length;
        stats.articleImagesDeleted = articleFilesToDelete.length;
      }
    }

    // -------------------------------------------------------------
    // 2. EPAPER CLEANUP
    // Find epapers where COALESCE(published_at, created_at) < cutoffIso
    // -------------------------------------------------------------
    const { data: oldEpapers, error: epaperFetchErr } = await supabaseAdmin
      .from("epapers")
      .select("id, title, pdf_url, thumbnail_url, published_at, created_at")
      .or(`published_at.lt.${cutoffIso},and(published_at.is.null,created_at.lt.${cutoffIso})`)
      .limit(batchLimit);

    if (epaperFetchErr) {
      console.error("[Cleanup Job] Error fetching old epapers:", epaperFetchErr);
      stats.errors.push(`Epaper fetch error: ${epaperFetchErr.message}`);
    } else if (oldEpapers && oldEpapers.length > 0) {
      stats.epapersFound = oldEpapers.length;
      console.log(`[Cleanup Job] Found ${oldEpapers.length} old epapers for cleanup.`);

      const oldEpaperIds = oldEpapers.map((e) => e.id);

      // Query remaining epapers for shared media checks
      const { data: remainingEpapers } = await supabaseAdmin
        .from("epapers")
        .select("pdf_url, thumbnail_url")
        .not("id", "in", `(${oldEpaperIds.join(",")})`);

      const remainingPdfs = new Set(
        (remainingEpapers || [])
          .map((e) => extractStoragePath(e.pdf_url, "epapers"))
          .filter((p): p is string => Boolean(p))
      );

      const remainingThumbs = new Set(
        (remainingEpapers || [])
          .map((e) => extractStoragePath(e.thumbnail_url, "epaper_thumbnails"))
          .filter((p): p is string => Boolean(p))
      );

      const pdfFilesToDelete: string[] = [];
      const thumbFilesToDelete: string[] = [];

      for (const ep of oldEpapers) {
        const pdfPath = extractStoragePath(ep.pdf_url, "epapers");
        if (pdfPath && !remainingPdfs.has(pdfPath)) {
          pdfFilesToDelete.push(pdfPath);
        }

        const thumbPath = extractStoragePath(ep.thumbnail_url, "epaper_thumbnails");
        if (thumbPath && !remainingThumbs.has(thumbPath)) {
          thumbFilesToDelete.push(thumbPath);
        }
      }

      if (!isDryRun) {
        // Delete epaper DB rows
        const { error: epDelErr, count: epDelCount } = await supabaseAdmin
          .from("epapers")
          .delete({ count: "exact" })
          .in("id", oldEpaperIds);

        if (epDelErr) {
          console.error("[Cleanup Job] Error deleting epapers:", epDelErr);
          stats.errors.push(`Epapers delete error: ${epDelErr.message}`);
        } else {
          stats.epapersDeleted = epDelCount || 0;

          // Delete PDFs from "epapers" storage bucket
          if (pdfFilesToDelete.length > 0) {
            const { data: removedPdfs, error: pdfStorageErr } = await supabaseAdmin.storage
              .from("epapers")
              .remove(pdfFilesToDelete);

            if (pdfStorageErr) {
              console.error("[Cleanup Job] Error removing epaper PDFs from storage:", pdfStorageErr);
              stats.errors.push(`Epaper PDF storage delete error: ${pdfStorageErr.message}`);
            } else {
              stats.epaperPdfsDeleted = (removedPdfs || []).length;
            }
          }

          // Delete thumbnails from "epaper_thumbnails" storage bucket
          if (thumbFilesToDelete.length > 0) {
            const { data: removedThumbs, error: thumbStorageErr } = await supabaseAdmin.storage
              .from("epaper_thumbnails")
              .remove(thumbFilesToDelete);

            if (thumbStorageErr) {
              console.error("[Cleanup Job] Error removing epaper thumbnails from storage:", thumbStorageErr);
              stats.errors.push(`Epaper thumbnail storage delete error: ${thumbStorageErr.message}`);
            } else {
              stats.epaperThumbnailsDeleted = (removedThumbs || []).length;
            }
          }
        }
      } else {
        // Dry run reporting
        stats.epapersDeleted = oldEpapers.length;
        stats.epaperPdfsDeleted = pdfFilesToDelete.length;
        stats.epaperThumbnailsDeleted = thumbFilesToDelete.length;
      }
    }

    console.log("[Cleanup Job] Completed with stats:", JSON.stringify(stats));

    return new Response(JSON.stringify({ success: true, stats }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error in cleanup job";
    console.error("[Cleanup Job] Unhandled exception:", err);
    return new Response(JSON.stringify({ success: false, error: errorMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
