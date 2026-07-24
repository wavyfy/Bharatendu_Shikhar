import { Suspense } from "react";
import Link from "next/link";
import { getAdvertisements } from "@/features/advertisements/queries";
import { getSettings } from "@/features/settings/queries";
import { AdvertisementsTable } from "@/features/advertisements/components/AdvertisementsTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { TableBodySkeleton } from "@/components/skeletons/TableBodySkeleton";

export const metadata = { title: "Advertisements | Bharatendu Shikhar Admin" };

// Note: For full consistency with other pages, we can pass searchParams down to handle pagination/search.
interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

async function AdvertisementsContent({ searchParamsPromise }: { searchParamsPromise: PageProps["searchParams"] }) {
  // In a future step, these params can be passed to getAdvertisements for server-side pagination
  const params = await searchParamsPromise;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const { advertisements } = await getAdvertisements();
  const settings = await getSettings();
  const hideAllAds = settings?.hide_all_ads ?? false;
  // Using simple length since pagination isn't fully implemented in the query yet
  const count = advertisements.length;
  const totalPages = 1;

  return (
    <div key="table-content" className="animate-in fade-in duration-300">
      <div className="px-5 py-3 border-b border-outline-variant">
        <span className="cms-card-label">All Advertisements ({count})</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <AdvertisementsTable advertisements={advertisements} hideAllAds={hideAllAds} />
      </div>

      <div className="px-5 pb-3 bg-surface">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </div>
  );
}

export default async function AdvertisementsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">Advertisements</h1>
          <p className="page-subtitle">Manage banner advertisements and sponsorships.</p>
        </div>
        <Link href="/advertisements/create" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Create Advertisement
        </Link>
      </div>

      <div className="cms-card">
        <div className="cms-card-header flex justify-end p-4">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search advertisements..." />
          </div>
        </div>

        <Suspense key={JSON.stringify(params)} fallback={<TableBodySkeleton />}>
          <AdvertisementsContent searchParamsPromise={searchParams} />
        </Suspense>
      </div>
    </AnimatedPage>
  );
}
