import Link from "next/link";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { getArticles } from "@/features/articles/queries";
import { getCategories } from "@/features/categories/queries";
import { getRegions } from "@/features/regions/queries";
import { ArticlesTable } from "@/features/articles/components/ArticlesTable";
import { ArticleFilters } from "@/features/articles/components/ArticleFilters";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Articles | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string; category_id?: string; region_id?: string; is_live?: string }>;
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";
  const categoryId = params?.category_id ? parseInt(params.category_id, 10) : undefined;
  const regionId = params?.region_id ? parseInt(params.region_id, 10) : undefined;
  const isLive = params?.is_live === "true" ? true : undefined;

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();

  let role = "publisher";
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
    getArticles({ page, limit: 10, role, userId, search, status, categoryId, regionId, isLive }),
    getCategories({ limit: 100 }),
    getRegions({ limit: 100 }),
  ]);

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Articles</h1>
          <p className="page-subtitle">
            Manage content, track publication status, and author new stories across all channels.
          </p>
        </div>
        <Link href="/articles/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Article
        </Link>
      </div>

      <div className="cms-card">
        <div className="cms-card-header">
          <ArticleFilters categories={categories} regions={regions} />
        </div>

        <div className="px-5 pt-3">
          <span className="cms-card-label">All Articles ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <ArticlesTable articles={articles} />
        </div>

        <div className="px-5 pb-3 bg-surface">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </AnimatedPage>
  );
}
