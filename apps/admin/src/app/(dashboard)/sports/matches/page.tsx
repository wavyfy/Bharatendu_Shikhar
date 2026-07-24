import { Suspense } from "react";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableBodySkeleton } from "@/components/skeletons/TableBodySkeleton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { getMatches } from "@/features/sports/matches/queries";
import { MatchesTable } from "@/features/sports/matches/components/MatchesTable";

export const metadata = { title: "Matches | Bharatendu Shikhar Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sport?: string;
    status?: string;
  }>;
}

async function MatchesContent({ sp }: { sp: PageProps["searchParams"] }) {
  const params = await sp;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const sport = params?.sport || "";
  const status = params?.status || "";
  const { matches, count } = await getMatches({ page, limit: 20, search, sport, status });
  const totalPages = Math.ceil(count / 20);

  return (
    <div key="table-content" className="animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-outline-variant">
        <span className="cms-card-label">All Matches ({count})</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <MatchesTable matches={matches} />
      </div>
      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default async function MatchesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Matches</h1>
          <p className="page-subtitle">Manage sports matches.</p>
        </div>
        <Link href="/sports/matches/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Match
        </Link>
      </div>
      
      <div className="cms-card">
        <div className="cms-card-header flex justify-end p-4">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search matches..." />
          </div>
        </div>
        <Suspense key={JSON.stringify(params)} fallback={<TableBodySkeleton />}>
          <MatchesContent sp={searchParams} />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
