import Link from "next/link";
import { getRegions } from "@/features/regions/queries";
import { RegionsTable } from "@/features/regions/components/RegionsTable";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Regions | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function RegionsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;

  const { regions, count, totalPages } = await getRegions({
    page,
    limit: 10,
  });

  return (
    <AnimatedPage className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Regions</h1>
          <p className="page-subtitle">Manage geographic regions for article distribution.</p>
        </div>
        <Link href="/regions/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Region
        </Link>
      </div>

      {/* Table card */}
      <div className="cms-card">
        <div className="cms-card-header">
          <span className="cms-card-label">All Regions ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <RegionsTable regions={regions} />
        </div>

        {totalPages > 1 && (
          <div className="px-5 pb-3 bg-surface flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Page {page} of {totalPages}</span>
            <div className="flex gap-1">
              <Link
                href={`/regions?page=${Math.max(1, page - 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page <= 1 ? "opacity-40 pointer-events-none text-outline" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/regions?page=${Math.min(totalPages, page + 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page >= totalPages ? "opacity-40 pointer-events-none text-outline" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </AnimatedPage>
  );
}
