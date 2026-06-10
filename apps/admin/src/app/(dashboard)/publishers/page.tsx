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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Publishers", value: count, icon: "business", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
          { label: "Active", value: activeCount, icon: "check_circle", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
          { label: "Showing", value: publishers.length, icon: "list", cardBg: "btn-primary-gradient text-white", iconBg: "bg-surface/20 text-white" },
        ].map(({ label, value, icon, cardBg, iconBg }) => (
          <div
            key={label}
            className={`rounded-2xl p-5 flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 shadow-md ${cardBg}`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-semibold opacity-90">{label}</span>
              <span
                className={`material-symbols-outlined text-base p-2 rounded-xl backdrop-blur-sm ${iconBg}`}
              >
                {icon}
              </span>
            </div>
            <div className="font-bold tracking-tight" style={{ fontSize: "32px", lineHeight: "36px" }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="cms-card">
        <div className="cms-card-header">
          <PublisherFilters currentStatus={status} />
        </div>

        <div className="px-5 pt-3">
          <span className="cms-card-label">All Publishers ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <PublishersTable publishers={publishers} />
        </div>

        <div className="px-5 pb-3 bg-surface">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </AnimatedPage>
  );
}
