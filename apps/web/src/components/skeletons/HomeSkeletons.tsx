import { Skeleton } from "@/components/ui/Skeleton";

export function TickerSkeleton() {
  return (
    <div className="sticky top-0 z-50 w-full bg-news-bg dark:bg-news-bg py-2 mb-8 shadow-sm animate-in fade-in duration-300">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-stretch text-xs">
          <div className="bg-gray-200 dark:bg-news-card text-transparent font-bold px-4 py-2 uppercase tracking-wide z-10 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
             <Skeleton className="h-4 w-24 rounded-none" />
          </div>
          <div className="bg-gray-200 dark:bg-news-card flex-1 overflow-hidden flex items-center relative px-4">
             <Skeleton className="h-4 w-64 rounded-none mr-10" />
             <Skeleton className="h-4 w-96 rounded-none hidden md:block" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton() {
  return (
    <div className="flex flex-col w-full mb-12 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-13 gap-8 lg:gap-5">
        <div className="lg:col-span-9 lg:pr-0">
           {/* Feature Article */}
           <Skeleton className="w-full aspect-16/10 md:aspect-2/1 rounded-none mb-4" />
           <Skeleton className="h-8 md:h-10 w-full mb-2" />
           <Skeleton className="h-8 md:h-10 w-3/4 mb-4" />
           <Skeleton className="h-4 w-1/2 mb-8" />
           
           <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-4"></div>
           
           {/* Split Articles */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="w-full aspect-video rounded-none mb-3" />
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-4 lg:pl-5 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-8 pt-8 lg:mt-0 lg:pt-0">
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-24 h-24 shrink-0 rounded-none" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CategorySectionsSkeleton() {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {[1, 2].map((section) => (
        <div key={section} className="flex flex-col w-full mb-12">
          {/* Category Header Skeleton */}
          <div className="flex items-center gap-4 mb-6 border-b-2 border-black dark:border-white pb-2">
            <Skeleton className="h-8 w-48 rounded-none" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-13 gap-8 lg:gap-5">
            <div className="lg:col-span-9 lg:pr-0">
               {/* Feature Article */}
               <Skeleton className="w-full aspect-16/10 md:aspect-2/1 rounded-none mb-4" />
               <Skeleton className="h-8 md:h-10 w-full mb-2" />
               <Skeleton className="h-8 md:h-10 w-3/4 mb-4" />
               
               <div className="h-[2px] w-full bg-gray-300 dark:bg-news-border my-4"></div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex flex-col">
                      <Skeleton className="w-full aspect-video rounded-none mb-3" />
                      <Skeleton className="h-6 w-full mb-2" />
                    </div>
                  ))}
               </div>
            </div>

            <div className="lg:col-span-4 lg:pl-5 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-8 pt-8 lg:mt-0 lg:pt-0">
              <div className="space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-24 h-24 shrink-0 rounded-none" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function BottomSlidersSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-0 mb-0 mt-4 flex flex-col gap-0 shadow-sm animate-in fade-in duration-300" style={{ zoom: 1 }}>
      {[1, 2].map((slider) => (
        <div key={slider} className="py-8 border-b-2 border-gray-300 dark:border-news-border">
          <Skeleton className="h-6 w-64 rounded-none mb-4" />
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
