import { Skeleton } from "@/components/ui/Skeleton";

export function TableSkeleton() {
  return (
    <div className="cms-card w-full animate-in fade-in duration-300">
      <div className="cms-card-header min-h-[64px] flex flex-wrap items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-[16rem]" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 hidden sm:block" />
          <Skeleton className="h-10 w-28 hidden sm:block" />
        </div>
      </div>
      
      <div className="px-5 py-4 border-b border-surface-variant flex gap-4">
        <Skeleton className="h-5 w-32" />
      </div>

      <div className="divide-y divide-surface-variant">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="px-5 py-4 flex items-center justify-between gap-4">
            <div className="space-y-2.5 flex-1 min-w-0">
              <Skeleton className="h-5 w-[60%] max-w-md" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24 hidden sm:block" />
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>

      <div className="px-5 py-4 bg-surface border-t border-surface-variant flex justify-between items-center">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}
