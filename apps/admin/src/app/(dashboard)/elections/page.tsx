import { Suspense } from "react";

import Link from "next/link";
import { getElections } from "@/features/elections/queries";
import { ElectionsTable } from "@/features/elections/components/ElectionsTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableBodySkeleton } from "@/components/skeletons/TableBodySkeleton";

export const metadata = { title: "Elections | Bharatendu Shikhar Admin" };

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

async function ElectionsContent({ searchParamsPromise }: { searchParamsPromise: PageProps["searchParams"] }) {
  const params = await searchParamsPromise;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";



  const { elections, count } = await getElections({ page, limit: 10, search });
  const totalPages = Math.ceil(count / 10);

  return (
    <div key="table-content" className="animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-outline-variant">
        <span className="cms-card-label">All Elections ({count})</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <ElectionsTable elections={elections} />
      </div>

      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default async function ElectionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Elections</h1>
          <p className="page-subtitle">Manage election data, live updates, and results.</p>
        </div>
        <Link href="/elections/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Election
        </Link>
      </div>

      <div className="cms-card">
        <div className="cms-card-header flex justify-end p-4">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search elections..." />
          </div>
        </div>

        <Suspense key={JSON.stringify(params)} fallback={<TableBodySkeleton />}>
          <ElectionsContent searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
