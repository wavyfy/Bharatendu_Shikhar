import { Suspense } from "react";
import Link from "next/link";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableBodySkeleton } from "@/components/skeletons/TableBodySkeleton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { getTeams } from "@/features/sports/teams/queries";
import { TeamsTable } from "@/features/sports/teams/components/TeamsTable";

export const metadata = { title: "Sports Teams | Bharatendu Shikhar Admin" };
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

async function TeamsContent({ sp }: { sp: PageProps["searchParams"] }) {
  const params = await sp;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const { teams, count } = await getTeams({ page, limit: 20, search });
  const totalPages = Math.ceil(count / 20);

  return (
    <div key="table-content" className="animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-outline-variant">
        <span className="cms-card-label">All Teams ({count})</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <TeamsTable teams={teams} />
      </div>
      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default async function TeamsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Manage sports teams.</p>
        </div>
        <Link href="/sports/teams/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Team
        </Link>
      </div>
      
      <div className="cms-card">
        <div className="cms-card-header flex justify-end p-4">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search teams..." />
          </div>
        </div>
        <Suspense key={JSON.stringify(params)} fallback={<TableBodySkeleton />}>
          <TeamsContent sp={searchParams} />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
