import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";

export interface DashboardStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalEpapers: number;
  totalCategories: number;
  totalRegions: number;
  totalPublishers: number;
  activePublishers: number;
  recentArticles: {
    id: number;
    title: string;
    status: "draft" | "published";
    created_at: string;
    author?: { full_name: string } | null;
  }[];
  recentEpapers: {
    id: number;
    title: string;
    published_at: string | null;
    created_at: string;
    pdf_url: string;
  }[];
  isAdmin: boolean;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => {
      try {
        cookieStore.set(name, value, options);
      } catch (error) {
        // Ignored in Server Components
      }
    },
    remove: (name, options) => {
      try {
        cookieStore.delete({ name, ...options });
      } catch (error) {
        // Ignored in Server Components
      }
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { supabaseAdmin } = await import("@repo/api");
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile as { role?: string } | null)?.role || "publisher";
  const isAdmin = role === "admin" || role === "superadmin";

  let articlesQuery = supabase.from("articles").select("*", { count: "exact", head: true });
  let publishedQuery = supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published");
  let draftQuery = supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft");
  let epapersQuery = supabase.from("epapers").select("*", { count: "exact", head: true });

  let recentArticlesQuery = supabaseAdmin.from("articles").select("id, title, status, created_at, author_id, author:profiles!articles_author_id_fkey(full_name)").order("created_at", { ascending: false }).limit(5);
  let recentEpapersQuery = supabase.from("epapers").select("id, title, published_at, created_at, pdf_url").order("created_at", { ascending: false }).limit(4);

  if (!isAdmin) {
    articlesQuery = articlesQuery.eq("author_id", user.id);
    publishedQuery = publishedQuery.eq("author_id", user.id);
    draftQuery = draftQuery.eq("author_id", user.id);
    epapersQuery = epapersQuery.eq("author_id", user.id);
    recentArticlesQuery = recentArticlesQuery.eq("author_id", user.id);
    recentEpapersQuery = recentEpapersQuery.eq("author_id", user.id);
  }

  const [
    { count: totalArticles },
    { count: publishedArticles },
    { count: draftArticles },
    { count: totalEpapers },
    { data: recentArticles },
    { data: recentEpapers },
  ] = await Promise.all([
    articlesQuery,
    publishedQuery,
    draftQuery,
    epapersQuery,
    recentArticlesQuery,
    recentEpapersQuery,
  ]);

  let totalCategories = 0;
  let totalRegions = 0;
  let totalPublishers = 0;
  let activePublishers = 0;

  if (isAdmin) {
    const [
      { count: categories },
      { count: regions },
      { count: publishers },
      { count: activePubs },
    ] = await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("regions").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "publisher"),
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }).eq("role", "publisher").eq("is_active", true),
    ]);

    totalCategories = categories || 0;
    totalRegions = regions || 0;
    totalPublishers = publishers || 0;
    activePublishers = activePubs || 0;
  }

  return {
    totalArticles: totalArticles || 0,
    publishedArticles: publishedArticles || 0,
    draftArticles: draftArticles || 0,
    totalEpapers: totalEpapers || 0,
    totalCategories,
    totalRegions,
    totalPublishers,
    activePublishers,
    recentArticles: (recentArticles as DashboardStats["recentArticles"]) || [],
    recentEpapers: (recentEpapers as DashboardStats["recentEpapers"]) || [],
    isAdmin,
  };
}
