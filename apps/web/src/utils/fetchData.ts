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
    .limit(10);

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
          ["Trending", "Latest"], // Fallback sub-links since categories table doesn't have them
          catArticles as ArticleWithAuthor[],
          Number(category.id) * 1000 // Just to get unique fallback images per category
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
