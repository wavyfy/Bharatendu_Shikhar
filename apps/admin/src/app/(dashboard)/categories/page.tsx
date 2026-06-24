import { Suspense } from "react";
import Link from "next/link";
import { getCategories } from "@/features/categories/queries";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { CategoryFilters } from "@/features/categories/components/CategoryFilters";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = { title: "Categories | Bharatendu Shikhar Admin" };

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

async function CategoriesContent({ searchParamsPromise }: { searchParamsPromise: PageProps["searchParams"] }) {
  const params = await searchParamsPromise;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";

  const { categories, count, totalPages } = await getCategories({
    page,
    limit: 10,
    search,
    status
  });

  return (
    <div className="cms-card animate-in fade-in duration-300">
      <div className="cms-card-header p-0">
        <CategoryFilters currentStatus={status} />
      </div>

      <div className="px-5 py-3 border-t border-outline-variant">
        <span className="cms-card-label">All Categories ({count})</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <CategoriesTable categories={categories} />
      </div>

      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default function CategoriesPage({ searchParams }: PageProps) {
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

      <Suspense fallback={<TableSkeleton />}>
        <CategoriesContent searchParamsPromise={searchParams} />
      </Suspense>
    </AnimatedPage>
  );
}
