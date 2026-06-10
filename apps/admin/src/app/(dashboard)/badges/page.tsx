import Link from "next/link";
import { getBadges } from "@/features/badges/queries";
import { BadgesTable } from "@/features/badges/components/BadgesTable";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Badges | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BadgesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;

  const { badges, count, totalPages } = await getBadges({ page, limit: 20 });

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Badges</h1>
          <p className="page-subtitle">
            Create labels like Breaking News, Live, or Exclusive to highlight articles.
          </p>
        </div>
        <Link href="/badges/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Badge
        </Link>
      </div>

      <div className="cms-card">
        <div className="cms-card-header">
          <span className="cms-card-label">All Badges ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <BadgesTable badges={badges} />
        </div>

        {totalPages > 1 && (
          <div className="px-5 pb-3 bg-surface flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Link
                href={`/badges?page=${Math.max(1, page - 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page <= 1
                    ? "opacity-40 pointer-events-none text-outline"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                }`}
              >
                Previous
              </Link>
              <Link
                href={`/badges?page=${Math.min(totalPages, page + 1)}`}
                className={`px-3 py-1 rounded border border-outline-variant text-sm font-medium transition-colors ${
                  page >= totalPages
                    ? "opacity-40 pointer-events-none text-outline"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
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
