import { MetadataRoute } from "next";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrlString } from "@/utils/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrlString(settings?.site_url);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api"],
    },
    sitemap: [
      `${siteUrl}/sitemap.xml`,
      `${siteUrl}/image-sitemap.xml`,
      `${siteUrl}/news-sitemap.xml`,
    ],
  };
}
