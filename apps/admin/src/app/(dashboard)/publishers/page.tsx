import Link from "next/link";
import { getPublishers } from "@/features/publishers/queries";
import { PublishersTable } from "@/features/publishers/components/PublishersTable";
import { Card, CardHeader } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { PublisherFilters } from "@/features/publishers/components/PublisherFilters";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Publishers | Admin",
};

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function PublishersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";

  const { publishers, count, totalPages } = await getPublishers({
    page,
    limit: 10,
    search,
    status,
  });

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111] dark:text-slate-100">Publishers</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage publisher accounts and permissions</p>
        </div>
        <Link 
          href="/publishers/new"
          className="inline-flex items-center gap-2 bg-[#111] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Publisher
        </Link>
      </div>

      <Card>
        <PublisherFilters currentStatus={status} />
        <CardHeader>All Publishers ({count})</CardHeader>
        <div className="p-0">
          <PublishersTable publishers={publishers} />
        </div>
        <Pagination currentPage={page} totalPages={totalPages} />
      </Card>
    </AnimatedPage>
  );
}
