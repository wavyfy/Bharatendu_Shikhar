import { Skeleton } from "@/components/ui/Skeleton";
import { FeaturedSkeleton, CategorySectionsSkeleton } from "@/components/skeletons/HomeSkeletons";

export function CategoryPageSkeleton() {
  return (
    <div className="flex-1 min-w-0 flex flex-col animate-in fade-in duration-300 mt-8">
      <div className="py-6 mb-2 border-b-2 border-gray-200 dark:border-gray-800">
        <Skeleton className="h-10 w-64 rounded-none" />
      </div>
      <main className="mt-6">
        <FeaturedSkeleton />
      </main>
      <div className="mb-12 mt-12">
        <Skeleton className="w-full h-24 rounded-none" />
      </div>
      <CategorySectionsSkeleton />
    </div>
  );
}
