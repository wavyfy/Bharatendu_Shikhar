import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111] dark:text-slate-100">Regions</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Manage article regions</p>
        </div>
        <Link href="/regions/new">
          <Button>+ New Region</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>All Regions ({count})</CardHeader>
        <div className="p-0">
          <RegionsTable regions={regions} />
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <Link href={`/regions?page=${Math.max(1, page - 1)}`}>
                <Button variant="secondary" size="sm" disabled={page <= 1}>
                  Previous
                </Button>
              </Link>
              <Link href={`/regions?page=${Math.min(totalPages, page + 1)}`}>
                <Button variant="secondary" size="sm" disabled={page >= totalPages}>
                  Next
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </AnimatedPage>
  );
}
