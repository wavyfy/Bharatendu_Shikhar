"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import type { SliderItem } from "@/components/home/HorizontalArticleSlider";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function DoubleRowRelatedSlider({ 
  topTitle, 
  topItems, 
  bottomTitle, 
  bottomItems 
}: { 
  topTitle: string; 
  topItems: SliderItem[];
  bottomTitle: string;
  bottomItems: SliderItem[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const displayTopItems = topItems && topItems.length > 0 ? [...topItems, ...topItems, ...topItems] : [];
  const displayBottomItems = bottomItems && bottomItems.length > 0 ? [...bottomItems, ...bottomItems, ...bottomItems] : [];

  useEffect(() => {
    if (scrollRef.current && (topItems.length > 0 || bottomItems.length > 0)) {
      const container = scrollRef.current;
      const singleSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth;
      }
    }
  }, [topItems, bottomItems]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const singleSetWidth = container.scrollWidth / 3;
    if (singleSetWidth <= 0) return;

    if (container.scrollLeft >= singleSetWidth * 2) {
      container.scrollLeft -= singleSetWidth;
    } else if (container.scrollLeft <= 5) {
      container.scrollLeft += singleSetWidth;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => { isDown.current = false; };
  const handleMouseUp = () => { isDown.current = false; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -350 : 350, behavior: "smooth" });
    }
  };

  const renderItem = (item: SliderItem, idx: number) => (
    <div key={`${item.id}-dup-${idx}`} className="w-65 shrink-0">
      <Link href={`/article/${item.article.slug}`} className="group/article block transition-all duration-300" draggable={false}>
        <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card mb-2 overflow-hidden rounded-sm border border-gray-200 dark:border-news-border">
          {item.article.featured_image && (
            <Image
              src={getImageUrl(item.article.featured_image)!}
              alt={item.article.title}
              fill
              sizes="260px"
              draggable={false}
              className="object-cover transition-transform duration-500 ease-out pointer-events-none"
            />
          )}
        </div>
        <h3 className="text-[15px] font-light leading-relaxed line-clamp-3 max-h-[4.65em] overflow-hidden group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors duration-300 pointer-events-none">
          {item.article.title}
        </h3>
      </Link>
    </div>
  );

  return (
    <div className="py-6 relative border-t-2 border-gray-300 dark:border-news-border mt-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-medium text-xl tracking-wide">
          संबंधित समाचार
        </h2>
      </div>

      <div className="relative group px-1">
        <button 
          onClick={() => scroll('left')} 
          className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/95 dark:bg-news-card/95 border border-gray-200 dark:border-news-border shadow-md hover:bg-gray-100 dark:hover:bg-news-border rounded-full transition-all hover:scale-110 flex items-center justify-center text-gray-800 dark:text-white"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} strokeWidth={2.25} />
        </button>
        <button 
          onClick={() => scroll('right')} 
          className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-white/95 dark:bg-news-card/95 border border-gray-200 dark:border-news-border shadow-md hover:bg-gray-100 dark:hover:bg-news-border rounded-full transition-all hover:scale-110 flex items-center justify-center text-gray-800 dark:text-white"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} strokeWidth={2.25} />
        </button>

        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none cursor-grab active:cursor-grabbing select-none py-2"
        >
          <div className="flex flex-col gap-8 w-max">
            {displayTopItems.length > 0 && (
              <div className="flex gap-8 items-start">
                <div className="w-30 shrink-0 border-l-4 border-red-600 pl-3">
                  <span className="font-medium text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                    विषय
                  </span>
                  <span className="font-medium text-sm mt-1 leading-relaxed text-gray-900 dark:text-gray-100 block">
                    {topTitle}
                  </span>
                </div>
                {displayTopItems.map((item, idx) => renderItem(item, idx))}
              </div>
            )}
            
            {displayBottomItems.length > 0 && (
              <div className="flex gap-8 items-start">
                <div className="w-30 shrink-0 border-l-4 border-red-600 pl-3">
                  <span className="font-medium text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400 block">
                    क्षेत्र
                  </span>
                  <span className="font-medium text-sm mt-1 leading-relaxed text-gray-900 dark:text-gray-100 block">
                    {bottomTitle}
                  </span>
                </div>
                {displayBottomItems.map((item, idx) => renderItem(item, idx))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
