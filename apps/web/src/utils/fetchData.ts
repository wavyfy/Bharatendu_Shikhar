import { unstable_cache } from "next/cache";
import { supabase } from "@repo/api";
import { mapToTopicCategory, ArticleWithAuthor } from "./mapArticleData";
import { TopicCategoryData } from "@/components/home/TopicSection";

function getTodayDateRange() {
  const now = new Date();
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCHours(23, 59, 59, 999);
  return { startOfDayISO: startOfDay.toISOString(), endOfDayISO: endOfDay.toISOString() };
}

function getRecentDateRange(days = 3) {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - days + 1));
  const endOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  endOfDay.setUTCHours(23, 59, 59, 999);
  return { startISO: start.toISOString(), endISO: endOfDay.toISOString() };
}

async function _fetchTickerArticles() {
  const { startISO, endISO } = getRecentDateRange();
  const { data } = await supabase
    .from("articles")
    .select(`*`)
    .eq("status", "published")
    .gte("published_at", startISO)
    .lte("published_at", endISO)
    .order("published_at", { ascending: false })
    .limit(200);

  return (data as ArticleWithAuthor[]) || [];
}

async function _fetchHomepageData() {
  const { startISO, endISO } = getRecentDateRange();

  // 1 & 2. Fetch Top/Mixed Articles and Active Categories in parallel
  const [topArticlesResponse, categoriesResponse] = await Promise.all([
    supabase
      .from("articles")
      .select(`*`)
      .eq("status", "published")
      .gte("published_at", startISO)
      .lte("published_at", endISO)
      .order("published_at", { ascending: false })
      .limit(200),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true),
  ]);

  const topArticlesData = topArticlesResponse.data;
  const categoriesData = categoriesResponse.data;

  // 3. Fetch articles for each category in parallel
  const categorySections: TopicCategoryData[] = [];

  if (categoriesData) {
    const categoryPromises = categoriesData.map(async (category) => {
      const { data: catArticles } = await supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("category_id", category.id)
        .gte("published_at", startISO)
        .lte("published_at", endISO)
        .order("published_at", { ascending: false })
        .limit(10);
      return { category, catArticles };
    });

    const results = await Promise.all(categoryPromises);

    for (const { category, catArticles } of results) {
      if (catArticles && catArticles.length > 0) {
        const mapped = mapToTopicCategory(
          category.id.toString(),
          category.name,
          category.slug,
          [],
          catArticles as ArticleWithAuthor[]
        );
        if (mapped) {
          categorySections.push(mapped);
        }
      }
    }
  }

  return {
    topArticles: (topArticlesData as ArticleWithAuthor[]) || [],
    categorySections,
  };
}

async function _fetchNavbarData() {
  const [regionsResponse, categoriesResponse] = await Promise.all([
    supabase
      .from("regions")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true }),
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("id", { ascending: true }),
  ]);

  return {
    regions: regionsResponse.data || [],
    categories: categoriesResponse.data || [],
  };
}

async function _fetchSettings() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("Supabase fetchSettings error:", error);
  }

  return data;
}

async function _fetchDynamicPageData(slug: string) {
  const { startOfDayISO, endOfDayISO } = getTodayDateRange();

  const [regionMatchesResponse, categoryMatchesResponse] = await Promise.all([
    supabase.from("regions").select("*").eq("slug", slug.toLowerCase()),
    supabase.from("categories").select("*").eq("slug", slug.toLowerCase()),
  ]);

  const region = regionMatchesResponse.data?.[0];
  const category = categoryMatchesResponse.data?.[0];

  if (!region && !category) {
    return null;
  }

  const categorySections: TopicCategoryData[] = [];
  let topArticlesData: ArticleWithAuthor[] = [];

  if (region) {
    const [topArticlesResponse, categoriesResponse] = await Promise.all([
      supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("region_id", region.id)
        .order("published_at", { ascending: false })
        .limit(200),
      supabase.from("categories").select("*").eq("is_active", true),
    ]);

    topArticlesData = (topArticlesResponse.data as ArticleWithAuthor[]) || [];
    const categoriesData = categoriesResponse.data;

    if (categoriesData) {
      const categoryPromises = categoriesData.map(async (cat) => {
        const { data: catArticles } = await supabase
          .from("articles")
          .select(`*`)
          .eq("status", "published")
          .eq("region_id", region.id)
          .eq("category_id", cat.id)
          .gte("published_at", startOfDayISO)
          .lte("published_at", endOfDayISO)
          .order("published_at", { ascending: false })
          .limit(10);
        return { cat, catArticles };
      });

      const results = await Promise.all(categoryPromises);

      for (const { cat, catArticles } of results) {
        if (catArticles && catArticles.length > 0) {
          const mapped = mapToTopicCategory(
            cat.id.toString(),
            cat.name,
            cat.slug,
            [],
            catArticles as ArticleWithAuthor[]
          );
          if (mapped) categorySections.push(mapped);
        }
      }
    }
  } else if (category) {
    const [topArticlesResponse, regionsResponse] = await Promise.all([
      supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("category_id", category.id)
        .order("published_at", { ascending: false })
        .limit(200),
      supabase.from("regions").select("*").eq("is_active", true),
    ]);

    topArticlesData = (topArticlesResponse.data as ArticleWithAuthor[]) || [];
    const regionsData = regionsResponse.data;

    if (regionsData) {
      const regionPromises = regionsData.map(async (reg) => {
        const { data: regArticles } = await supabase
          .from("articles")
          .select(`*`)
          .eq("status", "published")
          .eq("category_id", category.id)
          .eq("region_id", reg.id)
          .gte("published_at", startOfDayISO)
          .lte("published_at", endOfDayISO)
          .order("published_at", { ascending: false })
          .limit(10);
        return { reg, regArticles };
      });

      const results = await Promise.all(regionPromises);

      for (const { reg, regArticles } of results) {
        if (regArticles && regArticles.length > 0) {
          const mapped = mapToTopicCategory(
            reg.id.toString(),
            reg.name,
            reg.slug,
            [],
            regArticles as ArticleWithAuthor[]
          );
          if (mapped) categorySections.push(mapped);
        }
      }
    }
  }

  return {
    topArticles: topArticlesData,
    categorySections,
    pageTitle: region ? region.name : category!.name,
  };
}

async function _fetchBottomSlidersData() {
  const { startOfDayISO, endOfDayISO } = getTodayDateRange();

  const [regionsResponse, categoriesResponse] = await Promise.all([
    supabase.from("regions").select("*").eq("is_active", true),
    supabase.from("categories").select("*").eq("is_active", true),
  ]);

  const regions = regionsResponse.data;
  const categories = categoriesResponse.data;

  const regionSliderItems = [];
  if (regions) {
    const regionPromises = regions.map(async (region) => {
      const { data: latestArticle } = await supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("region_id", region.id)
        .gte("published_at", startOfDayISO)
        .lte("published_at", endOfDayISO)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();
      return { region, latestArticle };
    });

    const results = await Promise.all(regionPromises);

    for (const { region, latestArticle } of results) {
      if (latestArticle) {
        regionSliderItems.push({
          id: `region-${region.id}`,
          label: region.name,
          slug: region.slug,
          article: latestArticle as ArticleWithAuthor,
        });
      }
    }
  }

  const categorySliderItems = [];
  if (categories) {
    const categoryPromises = categories.map(async (category) => {
      const { data: latestArticle } = await supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("category_id", category.id)
        .gte("published_at", startOfDayISO)
        .lte("published_at", endOfDayISO)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();
      return { category, latestArticle };
    });

    const results = await Promise.all(categoryPromises);

    for (const { category, latestArticle } of results) {
      if (latestArticle) {
        categorySliderItems.push({
          id: `cat-${category.id}`,
          label: category.name,
          slug: category.slug,
          article: latestArticle as ArticleWithAuthor,
        });
      }
    }
  }

  return {
    regionSliderItems,
    categorySliderItems,
  };
}

async function _fetchArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from("articles")
    .select(`
      *,
      categories(id, name, slug),
      regions(id, name, slug),
      article_live_updates(*)
    `)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    console.error("Supabase fetchArticleBySlug error:", error);
  }

  return data;
}

async function _fetchRelatedArticles(categoryId?: number | null, regionId?: number | null, excludeArticleId?: number) {
  let categoryArticles: ArticleWithAuthor[] = [];
  let regionArticles: ArticleWithAuthor[] = [];

  const promises = [];

  if (categoryId) {
    promises.push(
      supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("category_id", categoryId)
        .neq("id", excludeArticleId || -1)
        .order("published_at", { ascending: false })
        .limit(10)
        .then(({ data }) => { categoryArticles = (data as ArticleWithAuthor[]) || []; })
    );
  }

  if (regionId) {
    promises.push(
      supabase
        .from("articles")
        .select(`*`)
        .eq("status", "published")
        .eq("region_id", regionId)
        .neq("id", excludeArticleId || -1)
        .order("published_at", { ascending: false })
        .limit(10)
        .then(({ data }) => { regionArticles = (data as ArticleWithAuthor[]) || []; })
    );
  }

  await Promise.all(promises);

  return { categoryArticles, regionArticles };
}


// --- Cached Exports ---
export const fetchTickerArticles = unstable_cache(_fetchTickerArticles, ["fetchTickerArticles"], { revalidate: 60, tags: ["articles"] });
export const fetchHomepageData = unstable_cache(_fetchHomepageData, ["fetchHomepageData"], { revalidate: 60, tags: ["articles", "categories"] });
export const fetchNavbarData = unstable_cache(_fetchNavbarData, ["fetchNavbarData"], { revalidate: 60, tags: ["categories", "regions"] });
export const fetchSettings = unstable_cache(_fetchSettings, ["fetchSettings"], { revalidate: 60, tags: ["settings"] });
export const fetchDynamicPageData = unstable_cache(_fetchDynamicPageData, ["fetchDynamicPageData"], { revalidate: 60, tags: ["articles", "categories", "regions"] });
export const fetchBottomSlidersData = unstable_cache(_fetchBottomSlidersData, ["fetchBottomSlidersData"], { revalidate: 60, tags: ["articles", "categories", "regions"] });
export const fetchArticleBySlug = unstable_cache(_fetchArticleBySlug, ["fetchArticleBySlug"], { revalidate: 60, tags: ["articles", "categories", "regions"] });
export const fetchRelatedArticles = unstable_cache(_fetchRelatedArticles, ["fetchRelatedArticles"], { revalidate: 60, tags: ["articles", "categories", "regions"] });
