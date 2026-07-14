import { Suspense } from "react";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
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
    <div className="cms-card animate-in fade-in duration-300">
      <div className="cms-card-header flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto text-left">
          <span className="cms-card-label">All Matches ({count})</span>
        </div>
        <div className="w-full sm:max-w-md">
          <SearchInput placeholder="Search matches..." />
        </div>
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

export default function MatchesPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end">
        <Link href="/sports/matches/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Match
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <MatchesContent sp={searchParams} />
      </Suspense>
    </div>
  );
}
