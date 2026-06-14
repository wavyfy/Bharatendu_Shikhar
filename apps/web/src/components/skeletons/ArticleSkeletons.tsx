import { Skeleton } from "@/components/ui/Skeleton";

export function ArticleSkeleton() {
  return (
    <article className="flex-1 min-w-0 flex flex-col w-full animate-in fade-in duration-300">
      <div className="flex flex-col lg:grid lg:grid-cols-13 gap-8">
        {/* Main Article Skeleton */}
        <div className="lg:col-span-9 flex flex-col min-w-0">
          <Skeleton className="h-[40px] md:h-[60px] w-full mb-2 rounded-none" />
          <Skeleton className="h-[40px] md:h-[60px] w-3/4 mb-6 rounded-none" />
          
          <div className="w-full mb-3 flex flex-col">
             <Skeleton className="w-full aspect-16/10 md:aspect-2/1 rounded-none" />
          </div>
          
          <Skeleton className="h-6 w-full mb-1 mt-4" />
          <Skeleton className="h-6 w-5/6 mb-1" />
          <Skeleton className="h-6 w-4/5 mb-1" />
          
          <div className="w-full block mb-10 mt-6 border-b-2 border-gray-100 dark:border-gray-800 pb-6">
             <Skeleton className="h-10 w-[350px] rounded-full" />
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
            <Skeleton className="h-[25px] w-[150px] mx-auto mb-6 rounded-none" />
            <div className="flex flex-col gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full mb-2 rounded-none" />
                    <Skeleton className="h-5 w-4/5 rounded-none" />
                    <Skeleton className="h-3 w-24 rounded-none mt-4" />
                  </div>
                  <Skeleton className="w-[120px] sm:w-[140px] shrink-0 aspect-4/3 rounded-none" />
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
    <div className="max-w-[1400px] mx-auto px-4 pb-20 w-full space-y-8 animate-in fade-in duration-300">
      {[1, 2].map((slider) => (
        <div key={slider} className="py-8 border-b-2 border-gray-300 dark:border-news-border">
          <Skeleton className="h-6 w-48 rounded-none mb-4" />
          <div className="flex gap-6 overflow-hidden pb-4">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div key={card} className="w-[220px] shrink-0">
                <Skeleton className="h-4 w-24 rounded-none mb-2" />
                <Skeleton className="w-full aspect-4/3 rounded-none mb-3" />
                <Skeleton className="h-4 w-full rounded-none mb-1" />
                <Skeleton className="h-4 w-3/4 rounded-none" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
