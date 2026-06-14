import { Skeleton } from "@/components/ui/Skeleton";

export function EpaperSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-in fade-in duration-300">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="flex flex-col border border-gray-200 dark:border-news-border rounded">
          <Skeleton className="w-full aspect-video rounded-none" />
          <div className="p-4 flex flex-col space-y-2">
            <Skeleton className="h-6 w-full rounded-none" />
            <Skeleton className="h-4 w-1/2 rounded-none mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
}
