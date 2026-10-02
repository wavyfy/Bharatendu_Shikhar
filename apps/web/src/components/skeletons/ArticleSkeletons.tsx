import { Skeleton } from "@/components/ui/Skeleton";

export function ArticleSkeleton() {
  return (
    <article className="flex-1 min-w-0 flex flex-col w-full animate-in fade-in duration-300">
      <div className="flex flex-col lg:grid lg:grid-cols-13 gap-8">
        {/* Main Article Skeleton */}
        <div className="lg:col-span-9 flex flex-col min-w-0">
          <Skeleton className="h-10 md:h-15 w-full mb-2 rounded-none" />
          <Skeleton className="h-10 md:h-15 w-3/4 mb-6 rounded-none" />
          
          <div className="w-full mb-3 flex flex-col">
             <Skeleton className="w-full aspect-16/10 md:aspect-2/1 rounded-none" />
          </div>
          
          <Skeleton className="h-6 w-full mb-1 mt-4" />
          <Skeleton className="h-6 w-5/6 mb-1" />
          <Skeleton className="h-6 w-4/5 mb-1" />
          
          <div className="w-full block mb-10 mt-6 border-b-2 border-gray-300 dark:border-news-border pb-6">
             <Skeleton className="h-10 w-87.5 rounded-full" />
          </div>
          
          <div className="space-y-4">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <Skeleton key={i} className="h-5 w-full rounded-none" />
             ))}
          </div>
        </div>

        {/* Related News Skeleton */}
        <div className="lg:col-span-4 lg:pl-5 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-8 pt-8 lg:mt-0 lg:pt-0">
          <div className="sticky top-4">
            <Skeleton className="h-6.25 w-37.5 mx-auto mb-6 rounded-none" />
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full mb-2 rounded-none" />
                    <Skeleton className="h-5 w-4/5 rounded-none" />
                    <Skeleton className="h-3 w-24 rounded-none mt-4" />
                  </div>
                  <Skeleton className="w-30 sm:w-35 shrink-0 aspect-4/3 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export function RelatedArticlesSkeleton() {
  return (
    <div className="w-full pb-4 animate-in fade-in duration-300">
      <div className="py-6 relative border-t-2 border-gray-300 dark:border-news-border mt-6">
        {/* Header & Controls */}
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-7 w-48 rounded-none" />
          <div className="flex gap-4">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="w-9 h-9 rounded-full" />
          </div>
        </div>

        {/* Double Row Content */}
        <div className="flex flex-col gap-8 overflow-hidden pb-4">
          {/* Row 1: Topic */}
          <div className="flex gap-8 items-start">
            <div className="w-30 shrink-0 border-l-4 border-red-600/30 pl-3 space-y-2">
              <Skeleton className="h-3 w-12 rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
            </div>
            <div className="flex gap-8 overflow-hidden">
              {[1, 2, 3, 4].map((card) => (
                <div key={card} className="w-65 shrink-0">
                  <Skeleton className="w-full aspect-video rounded-sm mb-2" />
                  <Skeleton className="h-4 w-full rounded-none mb-1" />
                  <Skeleton className="h-4 w-4/5 rounded-none" />
                </div>
              ))}
            </div>
          </div>

          {/* Row 2: Region */}
          <div className="flex gap-8 items-start">
            <div className="w-30 shrink-0 border-l-4 border-red-600/30 pl-3 space-y-2">
              <Skeleton className="h-3 w-12 rounded-none" />
              <Skeleton className="h-4 w-20 rounded-none" />
            </div>
            <div className="flex gap-8 overflow-hidden">
              {[1, 2, 3, 4].map((card) => (
                <div key={card} className="w-65 shrink-0">
                  <Skeleton className="w-full aspect-video rounded-sm mb-2" />
                  <Skeleton className="h-4 w-full rounded-none mb-1" />
                  <Skeleton className="h-4 w-4/5 rounded-none" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
