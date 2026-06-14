import { Skeleton } from "@/components/ui/Skeleton";

export function ArticleEditorSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start animate-in fade-in duration-300 w-full">
      {/* Main Editor Column */}
      <div className="flex-1 w-full space-y-6">
        <div className="cms-card p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-[400px] md:h-[600px] w-full" />
          </div>
        </div>
      </div>

      {/* Sidebar Settings Column */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        <div className="cms-card p-5 space-y-5">
          <Skeleton className="h-6 w-32 mb-2" />
          
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          
          <div className="pt-4 flex gap-3 border-t border-surface-variant">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>

        <div className="cms-card p-5 space-y-4">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    </div>
  );
}
