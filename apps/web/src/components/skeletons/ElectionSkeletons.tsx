import { Skeleton } from "@/components/ui/Skeleton";

export function ElectionCardSkeleton() {
  return (
    <div className="flex flex-col border border-gray-200 dark:border-gray-800 rounded-sm overflow-hidden bg-card">
      <div className="aspect-video w-full bg-muted relative">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-16 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-1 rounded" />
        <Skeleton className="h-4 w-5/6 mb-4 rounded" />
        
        <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-4">
          <Skeleton className="h-4 w-24 rounded" />
          <Skeleton className="h-4 w-24 rounded" />
        </div>
      </div>
    </div>
  );
}

export function ElectionsListingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-10 w-48 mb-2 rounded" />
          <Skeleton className="h-5 w-64 rounded" />
        </div>
        <Skeleton className="h-10 w-48 rounded" />
      </div>

      <div className="space-y-12">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-8 w-32 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ElectionCardSkeleton />
            <ElectionCardSkeleton />
            <ElectionCardSkeleton />
          </div>
        </section>
      </div>
    </div>
  );
}

export function ElectionDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl font-sans">
      {/* 1. Header Box */}
      <div className="bg-card border border-gray-200 dark:border-gray-800 rounded-sm p-8 mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div className="w-full">
          <Skeleton className="h-7 w-48 rounded-full mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2 rounded" />
          <Skeleton className="h-5 w-1/2 rounded" />
        </div>
        <Skeleton className="h-6 w-32 rounded" />
      </div>

      {/* 2. Updates & Party Standings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2">
          <div className="bg-card border border-gray-200 dark:border-gray-800 rounded-sm h-[400px]">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800">
              <Skeleton className="h-6 w-48 rounded" />
            </div>
            <div className="p-6 space-y-6">
              <Skeleton className="h-20 w-full rounded" />
              <Skeleton className="h-20 w-full rounded" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card border border-gray-200 dark:border-gray-800 rounded-sm p-6 h-[400px]">
             <Skeleton className="h-8 w-40 rounded-full mb-6" />
             <div className="space-y-6 mt-4">
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
                <Skeleton className="h-12 w-full rounded" />
             </div>
          </div>
        </div>
      </div>

      {/* 3. Top Leaders Section */}
      <div className="mb-12 mt-8">
        <Skeleton className="h-6 w-32 mb-6 rounded" />
        <div className="flex gap-4">
          <Skeleton className="h-32 w-[260px] rounded-sm shrink-0" />
          <Skeleton className="h-32 w-[260px] rounded-sm shrink-0 hidden sm:block" />
          <Skeleton className="h-32 w-[260px] rounded-sm shrink-0 hidden md:block" />
          <Skeleton className="h-32 w-[260px] rounded-sm shrink-0 hidden lg:block" />
        </div>
      </div>

      {/* 4. Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <Skeleton className="h-[400px] w-full rounded-sm" />
        </div>
        <div className="lg:col-span-2">
           <Skeleton className="h-[400px] w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
