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

export async function GET() {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  const siteName = escapeXml(settings?.site_name || "Bharatendu Shikhar");

  const twoDaysAgo = new Date();
  twoDaysAgo.setHours(twoDaysAgo.getHours() - 48);
  const twoDaysAgoISO = twoDaysAgo.toISOString();

  // Fetch published articles from the last 48 hours
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, title, published_at, created_at")
    .eq("status", "published")
    .gte("published_at", twoDaysAgoISO)
    .order("published_at", { ascending: false })
    .limit(1000);

  const articleEntries = (articles || [])
    .map((article) => {
      const pageUrl = `${siteUrl}/article/${article.slug}`;
      const pubDate = article.published_at || article.created_at || new Date().toISOString();
      const title = escapeXml(article.title || "");

      return `
  <url>
    <loc>${pageUrl}</loc>
    <news:news>
      <news:publication>
        <news:name>${siteName}</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${articleEntries}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=600",
    },
  });
}
