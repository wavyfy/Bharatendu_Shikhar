import { supabase } from "@repo/api";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";
import { NextResponse } from "next/server";

/** Infer MIME type from image URL extension. Returns null if unknown. */
function getImageMimeType(url: string): string | null {
  try {
    const pathname = new URL(url).pathname.toLowerCase();
    if (pathname.endsWith(".jpg") || pathname.endsWith(".jpeg")) return "image/jpeg";
    if (pathname.endsWith(".png")) return "image/png";
    if (pathname.endsWith(".webp")) return "image/webp";
    if (pathname.endsWith(".gif")) return "image/gif";
    if (pathname.endsWith(".avif")) return "image/avif";
  } catch {
    // Relative or malformed URL — try plain string matching
    const lower = url.toLowerCase();
    if (lower.includes(".jpg") || lower.includes(".jpeg")) return "image/jpeg";
    if (lower.includes(".png")) return "image/png";
    if (lower.includes(".webp")) return "image/webp";
  }
  return null;
}

/** Escape XML special characters. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Format a date string as RFC-822 (required by RSS 2.0). */
function toRfc822(dateStr: string | null | undefined): string {
  const d = dateStr ? new Date(dateStr) : new Date();
  return d.toUTCString();
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  const siteName = escapeXml(settings?.site_name || "Bharatendu Shikhar");
  const siteDescription = escapeXml(
    settings?.meta_description || "Latest News and Updates"
  );
  const logoUrl = settings?.site_logo_url || "";

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, excerpt, featured_image, published_at, updated_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (articles || [])
    .map((article) => {
      const articleUrl = `${siteUrl}/article/${article.slug}`;
      const pubDate = toRfc822(article.published_at || article.created_at);
      const title = escapeXml(article.title || "");
      const excerpt = article.excerpt
        ? `<![CDATA[${article.excerpt}]]>`
        : "";

      let enclosureTag = "";
      if (article.featured_image) {
        const mimeType = getImageMimeType(article.featured_image);
        if (mimeType) {
          enclosureTag = `\n      <enclosure url="${escapeXml(article.featured_image)}" length="0" type="${mimeType}" />`;
        }
      }

      return `
    <item>
      <title>${title}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${excerpt}</description>${enclosureTag}
    </item>`;
    })
    .join("");

  const logoTag = logoUrl
    ? `
  <image>
    <url>${escapeXml(logoUrl)}</url>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
  </image>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>${siteDescription}</description>
    <language>hi</language>
    <lastBuildDate>${toRfc822(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />${logoTag}${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
