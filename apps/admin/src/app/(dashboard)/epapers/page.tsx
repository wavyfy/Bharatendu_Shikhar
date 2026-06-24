import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import Link from "next/link";
import { getEpapers } from "@/features/epapers/queries";
import { EpapersTable } from "@/features/epapers/components/EpapersTable";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { EpaperFilters } from "@/features/epapers/components/EpaperFilters";

export const metadata = { title: "E-Papers | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

async function EpapersContent({ searchParamsPromise }: { searchParamsPromise: PageProps["searchParams"] }) {
  const params = await searchParamsPromise;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";

  const session = await getSessionUser();
  const user = session?.user;
  const role = session?.role || "publisher";

  const userId = role === "admin" ? undefined : user?.id;

  const { epapers, count, totalPages } = await getEpapers({ page, limit: 10, role, userId, search, status });

  return (
    <div className="cms-card animate-in fade-in duration-300">
      <div className="cms-card-header p-0">
        <EpaperFilters currentStatus={status} />
      </div>

      <div className="px-5 py-3 border-t border-outline-variant">
        <span className="cms-card-label">All E-Papers ({count})</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <EpapersTable epapers={epapers} />
      </div>

      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default function EPapersPage({ searchParams }: PageProps) {
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">E-Papers</h1>
          <p className="page-subtitle">Upload and manage digital editions for your publication.</p>
        </div>
        <Link href="/epapers/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Upload E-Paper
        </Link>
      </div>

      <Suspense fallback={<TableSkeleton />}>
        <EpapersContent searchParamsPromise={searchParams} />
      </Suspense>
    </AnimatedPage>
  );
}
