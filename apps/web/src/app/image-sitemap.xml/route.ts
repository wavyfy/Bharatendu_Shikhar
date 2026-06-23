import { supabase } from "@repo/api";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";
import { NextResponse } from "next/server";

/** Escape XML special characters. */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Generates an XML image sitemap for published articles and elections.
 *
 * @returns A `NextResponse` with the XML sitemap as content.
 */
export async function GET() {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  // Fetch published articles with featured images
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, featured_image")
    .eq("status", "published")
    .not("featured_image", "is", null)
    .order("published_at", { ascending: false });

  // Fetch published elections with featured images
  const { data: elections } = await supabase
    .from("elections")
    .select("slug, title, featured_image_url")
    .eq("is_published", true)
    .not("featured_image_url", "is", null)
    .order("created_at", { ascending: false });

  const articleEntries = (articles || [])
    .filter((a) => a.featured_image)
    .map((article) => {
      const pageUrl = `${siteUrl}/article/${article.slug}`;
      return `
  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${escapeXml(article.featured_image!)}</image:loc>
      <image:title>${escapeXml(article.title || "")}</image:title>
    </image:image>
  </url>`;
    })
    .join("");

  const electionEntries = (elections || [])
    .filter((e) => e.featured_image_url)
    .map((election) => {
      const pageUrl = `${siteUrl}/elections/${election.slug}`;
      return `
  <url>
    <loc>${pageUrl}</loc>
    <image:image>
      <image:loc>${escapeXml(election.featured_image_url!)}</image:loc>
      <image:title>${escapeXml(election.title || "")}</image:title>
    </image:image>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>${articleEntries}${electionEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
