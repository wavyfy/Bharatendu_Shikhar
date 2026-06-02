import Link from "next/link";
import { getPublishers } from "@/features/publishers/queries";
import { PublishersTable } from "@/features/publishers/components/PublishersTable";
import { Pagination } from "@/components/ui/Pagination";
import { PublisherFilters } from "@/features/publishers/components/PublisherFilters";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Publishers | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; status?: string }>;
}

export default async function PublishersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";
  const status = params?.status || "";

  const { publishers, count, totalPages } = await getPublishers({ page, limit: 10, search, status });
  const activeCount = publishers.filter((p: { is_active?: boolean }) => p.is_active).length;

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Publishers</h1>
          <p className="page-subtitle">
            Manage publication networks, onboard regional partners, and monitor syndication statuses.
          </p>
        </div>
        <Link href="/publishers/new" className="btn-cms-primary self-start sm:self-auto">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Publisher
        </Link>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Publishers", value: count, icon: "business", color: "#0058c3" },
          { label: "Active", value: activeCount, icon: "check_circle", color: "#059669" },
          { label: "Showing", value: publishers.length, icon: "list", color: "#0058c3" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="cms-card p-5 flex flex-col gap-1 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full blur-2xl" style={{ background: `${color}18` }} />
            <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]" style={{ color }}>{icon}</span>
              {label}
            </span>
            <span className="page-title mt-1" style={{ fontSize: "28px", lineHeight: "36px" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="cms-card">
        <div className="cms-card-header">
          <PublisherFilters currentStatus={status} />
        </div>

        <div className="px-5 py-3 border-b border-surface-variant">
          <span className="cms-card-label">All Publishers ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <PublishersTable publishers={publishers} />
        </div>

        <div className="px-5 py-3 border-t border-surface-variant bg-surface">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </AnimatedPage>
  );
}
