import { MetadataRoute } from "next";
import { supabase } from "@repo/api";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";

/**
 * Generates a Next.js sitemap for the site.
 *
 * Compiles sitemap entries for the homepage, static pages (if configured), and dynamic content including published articles, elections, active categories, and regions.
 *
 * @returns The sitemap entries array.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  const entries: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  if (settings?.about_us) {
    entries.push({
      url: `${siteUrl}/about`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  if (settings?.contact_email || settings?.contact_phone || settings?.contact_address) {
    entries.push({
      url: `${siteUrl}/contact`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  if (settings?.privacy_policy) {
    entries.push({
      url: `${siteUrl}/privacy`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  if (settings?.terms_conditions) {
    entries.push({
      url: `${siteUrl}/terms`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  if (settings?.editorial_policy) {
    entries.push({
      url: `${siteUrl}/editorial-policy`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  if (settings?.correction_policy) {
    entries.push({
      url: `${siteUrl}/correction-policy`,
      lastModified: new Date(settings.updated_at || new Date()),
      changeFrequency: "monthly",
      priority: 0.3,
    });
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (articles) {
    for (const article of articles) {
      entries.push({
        url: `${siteUrl}/article/${article.slug}`,
        lastModified: new Date(article.updated_at || article.published_at || article.created_at || new Date()),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  const { data: elections } = await supabase
    .from("elections")
    .select("slug, updated_at, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (elections) {
    for (const election of elections) {
      entries.push({
        url: `${siteUrl}/elections/${election.slug}`,
        lastModified: new Date(election.updated_at || election.created_at || new Date()),
        changeFrequency: "daily",
        priority: 0.8,
      });
    }
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, created_at")
    .eq("is_active", true);

  if (categories) {
    for (const category of categories) {
      entries.push({
        url: `${siteUrl}/category/${category.slug}`,
        lastModified: category.created_at ? new Date(category.created_at) : new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  const { data: regions } = await supabase
    .from("regions")
    .select("slug, created_at")
    .eq("is_active", true);

  if (regions) {
    for (const region of regions) {
      entries.push({
        url: `${siteUrl}/region/${region.slug}`,
        lastModified: region.created_at ? new Date(region.created_at) : new Date(),
        changeFrequency: "daily",
        priority: 0.7,
      });
    }
  }

  return entries;
}
