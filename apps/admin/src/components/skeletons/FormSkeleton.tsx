import { Skeleton } from "@/components/ui/Skeleton";

export function FormSkeleton() {
  return (
    <div className="cms-card animate-in fade-in duration-300">
      <div className="p-6 md:p-8 space-y-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-11 w-full max-w-2xl" />
            <Skeleton className="h-4 w-64" />
          </div>
        ))}
        
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        </div>
      </div>
      <div className="px-6 py-4 border-t border-surface-variant bg-surface-container-low flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
