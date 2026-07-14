import { Skeleton } from "@/components/ui/Skeleton";

export function SportsListingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-background">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-[300px] w-full lg:w-2/3 rounded-3xl" />
        <Skeleton className="h-[300px] w-full lg:w-1/3 rounded-3xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[200px] w-full rounded-2xl" />
          <Skeleton className="h-[200px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function SportsDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12 bg-background">
      <div className="flex flex-col lg:flex-row gap-6">
        <Skeleton className="h-[340px] w-full lg:w-2/3 rounded-3xl" />
        <Skeleton className="h-[340px] w-full lg:w-1/3 rounded-3xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="h-[400px] w-full rounded-3xl" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}
