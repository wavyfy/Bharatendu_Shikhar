import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";
import { mapToTopicCategory, ArticleWithAuthor } from "./mapArticleData";
import { TopicCategoryData } from "@/components/home/TopicSection";

export async function fetchHomepageData() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get(name) {
      return cookieStore.get(name)?.value;
    },
    set() {
      // Intentionally empty for Server Components
    },
    remove() {
      // Intentionally empty for Server Components
    },
  });

  // 1. Fetch Top/Mixed Articles
  // Fetch latest published articles regardless of category
  const { data: topArticlesData } = await supabase
    .from("articles")
    .select(`*, profiles(id, full_name)`)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(20);

  // 2. Fetch Active Categories
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true);

  // 3. Fetch articles for each category
  const categorySections: TopicCategoryData[] = [];
  
  if (categoriesData) {
    for (const category of categoriesData) {
      const { data: catArticles } = await supabase
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
          [], // Fallback sub-links since categories table doesn't have them
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
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get(name) {
      return cookieStore.get(name)?.value;
    },
    set() {},
    remove() {},
  });

  const { data: regions } = await supabase.from("regions").select("*").eq("is_active", true).order("id", { ascending: true });
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true).order("id", { ascending: true });

  return {
    regions: regions || [],
    categories: categories || []
  };
}

export async function fetchDynamicPageData(slug: string) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get(name) {
      return cookieStore.get(name)?.value;
    },
    set() {},
    remove() {},
  });

  const { data: regionMatches } = await supabase.from("regions").select("*").eq("slug", slug.toLowerCase());
  const { data: categoryMatches } = await supabase.from("categories").select("*").eq("slug", slug.toLowerCase());

  const region = regionMatches?.[0];
  const category = categoryMatches?.[0];

  if (!region && !category) {
    return null;
  }

  const categorySections: TopicCategoryData[] = [];
  let topArticlesData: any[] = [];

  if (region) {
    const { data } = await supabase
      .from("articles")
      .select(`*, profiles(id, full_name)`)
      .eq("status", "published")
      .eq("region_id", region.id)
      .order("published_at", { ascending: false })
      .limit(20);
    topArticlesData = data || [];

    const { data: categoriesData } = await supabase.from("categories").select("*").eq("is_active", true);
    if (categoriesData) {
      for (const cat of categoriesData) {
        const { data: catArticles } = await supabase
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
    const { data } = await supabase
      .from("articles")
      .select(`*, profiles(id, full_name)`)
      .eq("status", "published")
      .eq("category_id", category.id)
      .order("published_at", { ascending: false })
      .limit(20);
    topArticlesData = data || [];

    const { data: regionsData } = await supabase.from("regions").select("*").eq("is_active", true);
    if (regionsData) {
      for (const reg of regionsData) {
        const { data: regArticles } = await supabase
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
    topArticles: (topArticlesData as ArticleWithAuthor[]) || [],
    categorySections,
    pageTitle: region ? region.name : category!.name
  };
}

export async function fetchBottomSlidersData() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get(name) {
      return cookieStore.get(name)?.value;
    },
    set() {},
    remove() {},
  });

  const { data: regions } = await supabase.from("regions").select("*").eq("is_active", true);
  const { data: categories } = await supabase.from("categories").select("*").eq("is_active", true);

  const regionSliderItems = [];
  if (regions) {
    for (const region of regions) {
      const { data: latestArticle } = await supabase
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
          article: latestArticle as ArticleWithAuthor
        });
      }
    }
  }

  const categorySliderItems = [];
  if (categories) {
    for (const category of categories) {
      const { data: latestArticle } = await supabase
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
          article: latestArticle as ArticleWithAuthor
        });
      }
    }
  }

  return {
    regionSliderItems,
    categorySliderItems
  };
}
