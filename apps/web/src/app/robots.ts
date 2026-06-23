import { MetadataRoute } from "next";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login", "/api"],
    },
    sitemap: [
      `${siteUrl.toString()}/sitemap.xml`,
      `${siteUrl.toString()}/image-sitemap.xml`,
      `${siteUrl.toString()}/news-sitemap.xml`,
    ],
  };
}
