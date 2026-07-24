import { Suspense } from "react";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableBodySkeleton } from "@/components/skeletons/TableBodySkeleton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { getCompetitions } from "@/features/sports/competitions/queries";
import { CompetitionsTable } from "@/features/sports/competitions/components/CompetitionsTable";

export const metadata = { title: "Competitions | Bharatendu Shikhar Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; sport?: string }>;
}

async function CompetitionsContent({ sp }: { sp: PageProps["searchParams"] }) {
  const params = await sp;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const sport = params?.sport || "";
  const { competitions, count } = await getCompetitions({ page, limit: 20, search, sport });
  const totalPages = Math.ceil(count / 20);

  return (
    <div key="table-content" className="animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-outline-variant">
        <span className="cms-card-label">All Competitions ({count})</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <CompetitionsTable competitions={competitions} />
      </div>
      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default async function CompetitionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Competitions</h1>
          <p className="page-subtitle">Manage sports competitions.</p>
        </div>
        <Link href="/sports/competitions/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Competition
        </Link>
      </div>
      
      <div className="cms-card">
        <div className="cms-card-header flex justify-end p-4">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search competitions..." />
          </div>
        </div>
        <Suspense key={JSON.stringify(params)} fallback={<TableBodySkeleton />}>
          <CompetitionsContent sp={searchParams} />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
