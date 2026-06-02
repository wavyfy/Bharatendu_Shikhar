import Link from "next/link";
import { getCategories } from "@/features/categories/queries";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Categories | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;

  const { categories, count, totalPages } = await getCategories({ page, limit: 10 });

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">Manage article categories and organize your content taxonomy.</p>
        </div>
        <Link href="/categories/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Category
        </Link>
      </div>

      <div className="cms-card">
        <div className="cms-card-header">
          <span className="cms-card-label">All Categories ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <CategoriesTable categories={categories} />
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-surface-variant bg-surface flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Link
                href={`/categories?page=${Math.max(1, page - 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page <= 1 ? "opacity-40 pointer-events-none text-outline" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/categories?page=${Math.min(totalPages, page + 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page >= totalPages ? "opacity-40 pointer-events-none text-outline" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
