import { supabaseAdmin } from "@repo/api";
import { mapToTopicCategory, ArticleWithAuthor } from "./mapArticleData";
import { TopicCategoryData } from "@/components/home/TopicSection";

export async function fetchHomepageData() {
  // 1. Fetch Top/Mixed Articles
  const { data: topArticlesData } = await supabaseAdmin
    .from("articles")
    .select(`*, profiles(id, full_name)`)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  // 2. Fetch Active Categories
  const { data: categoriesData } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true);

  // 3. Fetch articles for each category
  const categorySections: TopicCategoryData[] = [];

  if (categoriesData) {
    for (const category of categoriesData) {
      const { data: catArticles } = await supabaseAdmin
        .from("articles")
        .select(`*, profiles(id, full_name)`)
        .eq("status", "published")
        .eq("category_id", category.id)
        .order("published_at", { ascending: false })
        .limit(10);

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

export async function fetchNavbarData() {
  const { data: regions } = await supabaseAdmin
    .from("regions")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("id", { ascending: true });

  return {
    regions: regions || [],
    categories: categories || [],
  };
}

export async function fetchDynamicPageData(slug: string) {
  const { data: regionMatches } = await supabaseAdmin
    .from("regions")
    .select("*")
    .eq("slug", slug.toLowerCase());
  const { data: categoryMatches } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("slug", slug.toLowerCase());

  const region = regionMatches?.[0];
  const category = categoryMatches?.[0];

  if (!region && !category) {
    return null;
  }

  const categorySections: TopicCategoryData[] = [];
  let topArticlesData: ArticleWithAuthor[] = [];

  if (region) {
    const { data } = await supabaseAdmin
      .from("articles")
      .select(`*, profiles(id, full_name)`)
      .eq("status", "published")
      .eq("region_id", region.id)
      .order("published_at", { ascending: false })
      .limit(20);
    topArticlesData = (data as ArticleWithAuthor[]) || [];

    const { data: categoriesData } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("is_active", true);
    if (categoriesData) {
      for (const cat of categoriesData) {
        const { data: catArticles } = await supabaseAdmin
          .from("articles")
          .select(`*, profiles(id, full_name)`)
          .eq("status", "published")
          .eq("region_id", region.id)
          .eq("category_id", cat.id)
          .order("published_at", { ascending: false })
          .limit(10);

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
    const { data } = await supabaseAdmin
      .from("articles")
      .select(`*, profiles(id, full_name)`)
      .eq("status", "published")
      .eq("category_id", category.id)
      .order("published_at", { ascending: false })
      .limit(20);
    topArticlesData = (data as ArticleWithAuthor[]) || [];

    const { data: regionsData } = await supabaseAdmin
      .from("regions")
      .select("*")
      .eq("is_active", true);
    if (regionsData) {
      for (const reg of regionsData) {
        const { data: regArticles } = await supabaseAdmin
          .from("articles")
          .select(`*, profiles(id, full_name)`)
          .eq("status", "published")
          .eq("category_id", category.id)
          .eq("region_id", reg.id)
          .order("published_at", { ascending: false })
          .limit(10);

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

export async function fetchBottomSlidersData() {
  const { data: regions } = await supabaseAdmin
    .from("regions")
    .select("*")
    .eq("is_active", true);
  const { data: categories } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true);

  const regionSliderItems = [];
  if (regions) {
    for (const region of regions) {
      const { data: latestArticle } = await supabaseAdmin
        .from("articles")
        .select(`*, profiles(id, full_name)`)
        .eq("status", "published")
        .eq("region_id", region.id)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

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
    for (const category of categories) {
      const { data: latestArticle } = await supabaseAdmin
        .from("articles")
        .select(`*, profiles(id, full_name)`)
        .eq("status", "published")
        .eq("category_id", category.id)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

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
