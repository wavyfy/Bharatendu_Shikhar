import { supabaseAdmin } from "@repo/api";
import type { ArticleWithRelations } from "../types";

export interface GetArticlesOptions {
  page?: number;
  limit?: number;
  role?: string;
  userId?: string;
  search?: string;
  status?: string;
  categoryId?: number;
  regionId?: number;
}

export async function getArticles(options: GetArticlesOptions = {}) {
  const { page = 1, limit = 10, role = "publisher", userId, search, status, categoryId, regionId } = options;

  let query = supabaseAdmin
    .from("articles")
    .select(`
      *,
      category:categories(id, name, slug),
      region:regions(id, name, slug),
      author:profiles!articles_author_id_fkey(id, full_name),
      article_badges(badge_id, badge:badges(id, name, slug, color))
    `, { count: 'exact' });

  if (role === "publisher" && userId) {
    query = query.eq("author_id", userId);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }
  
  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }
  
  if (regionId) {
    query = query.eq("region_id", regionId);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching articles:", error.message);
    throw new Error("Failed to fetch articles");
  }

  return {
    articles: data as ArticleWithRelations[],
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getArticleById(id: number, authorId: string | null = null) {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select(`
      *,
      category:categories(id, name, slug),
      region:regions(id, name, slug),
      author:profiles!articles_author_id_fkey(id, full_name),
      article_badges(badge_id, badge:badges(id, name, slug, color))
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching article:", error.message);
    return null;
  }

  // Permission check: if authorId is provided (publisher), they must own it
  if (authorId && (data as { author_id: string }).author_id !== authorId) {
    return null;
  }

  return data as ArticleWithRelations;
}
