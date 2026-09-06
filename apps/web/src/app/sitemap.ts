import { MetadataRoute } from "next";
import { supabase } from "@repo/api";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrlString } from "@/utils/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrlString(settings?.site_url);

  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  const addEntry = (url: string, lastModified?: Date) => {
    if (!seenUrls.has(url)) {
      seenUrls.add(url);
      entries.push({
        url,
        ...(lastModified ? { lastModified } : {}),
      });
    }
  };

  // 1. Homepage
  addEntry(siteUrl, new Date());

  // 2. Static Public Hub Pages
  addEntry(`${siteUrl}/epaper`);
  addEntry(`${siteUrl}/sports`);
  addEntry(`${siteUrl}/elections`);

  // 3. Static Settings & Policy Pages
  if (settings?.about_us) {
    addEntry(`${siteUrl}/about`, new Date(settings.updated_at || new Date()));
  }

  if (settings?.contact_email || settings?.contact_phone || settings?.contact_address) {
    addEntry(`${siteUrl}/contact`, new Date(settings.updated_at || new Date()));
  }

  if (settings?.privacy_policy) {
    addEntry(`${siteUrl}/privacy`, new Date(settings.updated_at || new Date()));
  }

  if (settings?.terms_conditions) {
    addEntry(`${siteUrl}/terms`, new Date(settings.updated_at || new Date()));
  }

  if (settings?.editorial_policy) {
    addEntry(`${siteUrl}/editorial-policy`, new Date(settings.updated_at || new Date()));
  }

  if (settings?.correction_policy) {
    addEntry(`${siteUrl}/correction-policy`, new Date(settings.updated_at || new Date()));
  }

  // 4. Published Articles (strictly published & published_at <= NOW)
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, published_at, created_at")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false });

  if (articles) {
    for (const article of articles) {
      const lastMod = article.updated_at || article.published_at || article.created_at;
      addEntry(`${siteUrl}/article/${article.slug}`, lastMod ? new Date(lastMod) : undefined);
    }
  }

  // 5. Elections Sub-pages
  const { data: elections } = await supabase
    .from("elections")
    .select("slug, updated_at, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (elections) {
    for (const election of elections) {
      const lastMod = election.updated_at || election.created_at;
      addEntry(`${siteUrl}/elections/${election.slug}`, lastMod ? new Date(lastMod) : undefined);
    }
  }

  // 6. Active Categories (live canonical path: /${slug})
  const { data: categories } = await supabase
    .from("categories")
    .select("slug, created_at")
    .eq("is_active", true);

  if (categories) {
    for (const category of categories) {
      addEntry(`${siteUrl}/${category.slug}`, category.created_at ? new Date(category.created_at) : undefined);
    }
  }

  // 7. Active Regions (live canonical path: /${slug})
  const { data: regions } = await supabase
    .from("regions")
    .select("slug, created_at")
    .eq("is_active", true);

  if (regions) {
    for (const region of regions) {
      addEntry(`${siteUrl}/${region.slug}`, region.created_at ? new Date(region.created_at) : undefined);
    }
  }

  return entries;
}
