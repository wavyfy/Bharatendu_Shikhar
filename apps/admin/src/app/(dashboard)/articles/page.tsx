import Link from "next/link";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { getArticles } from "@/features/articles/queries";
import { getCategories } from "@/features/categories/queries";
import { getRegions } from "@/features/regions/queries";
import { ArticlesTable } from "@/features/articles/components/ArticlesTable";
import { ArticleFilters } from "@/features/articles/components/ArticleFilters";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Articles | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category_id?: string; region_id?: string }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";
  const categoryId = params?.category_id ? parseInt(params.category_id, 10) : undefined;
  const regionId = params?.region_id ? parseInt(params.region_id, 10) : undefined;

  // Get user and role to determine authorId for fetching
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  
  let role = "publisher"; // default
  if (user) {
    const { supabaseAdmin } = await import("@repo/api");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if ((data as unknown as { role?: string })?.role === "admin") {
      role = "admin";
    }
  }

  const userId = role === "admin" ? undefined : user?.id;

  const [{ articles, count, totalPages }, { categories }, { regions }] = await Promise.all([
    getArticles({
      page,
      limit: 10,
      role,
      userId,
      search,
      status,
      categoryId,
      regionId,
    }),
    getCategories({ limit: 100 }),
    getRegions({ limit: 100 }),
  ]);

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111] dark:text-slate-100">Articles</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage all news articles</p>
        </div>
        <Link href="/articles/new">
          <Button>+ New Article</Button>
        </Link>
      </div>
      
      <Card>
        <ArticleFilters categories={categories} regions={regions} />
        <CardHeader>All Articles ({count})</CardHeader>
        <div className="p-0">
          <ArticlesTable articles={articles} />
        </div>
        
        <Pagination currentPage={page} totalPages={totalPages} />
      </Card>
    </AnimatedPage>
  );
}
