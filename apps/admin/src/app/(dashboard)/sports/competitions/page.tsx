import { Suspense } from "react";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
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
    <div className="cms-card animate-in fade-in duration-300">
      <div className="cms-card-header flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="w-full sm:w-auto text-left">
          <span className="cms-card-label">All Competitions ({count})</span>
        </div>
        <div className="w-full sm:max-w-md">
          <SearchInput placeholder="Search competitions..." />
        </div>
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

export default function CompetitionsPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-end">
        <Link href="/sports/competitions/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Competition
        </Link>
      </div>
      <Suspense fallback={<TableSkeleton />}>
        <CompetitionsContent sp={searchParams} />
      </Suspense>
    </div>
  );
}
