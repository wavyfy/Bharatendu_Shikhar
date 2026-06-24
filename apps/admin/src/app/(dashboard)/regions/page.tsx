import { Suspense } from "react";
import Link from "next/link";
import { getRegions } from "@/features/regions/queries";
import { RegionsTable } from "@/features/regions/components/RegionsTable";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

import { RegionFilters } from "@/features/regions/components/RegionFilters";
import { Pagination } from "@/components/ui/Pagination";

export const metadata = { title: "Regions | Bharatendu Shikhar Admin" };

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

async function RegionsContent({ searchParamsPromise }: { searchParamsPromise: PageProps["searchParams"] }) {
  const params = await searchParamsPromise;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";

  const { regions, count, totalPages } = await getRegions({
    page,
    limit: 10,
    search,
    status
  });

  return (
    <div className="cms-card animate-in fade-in duration-300">
      <div className="cms-card-header p-0">
        <RegionFilters currentStatus={status} />
      </div>

      <div className="px-5 py-3 border-t border-outline-variant">
        <span className="cms-card-label">All Regions ({count})</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <RegionsTable regions={regions} />
      </div>

      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}


export default function RegionsPage({ searchParams }: PageProps) {
  return (
    <AnimatedPage className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Regions</h1>
          <p className="page-subtitle">Manage geographic regions for article distribution.</p>
        </div>
        <Link href="/regions/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Region
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <RegionsContent searchParamsPromise={searchParams} />
      </Suspense>
    </AnimatedPage>
  );
}
