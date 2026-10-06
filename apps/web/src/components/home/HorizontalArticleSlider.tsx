"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect } from "react";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export type SliderItem = {
  id: string;
  label: string; // The region or category name
  slug: string;  // The region or category slug
  article: ArticleWithAuthor; // The latest article for this region/category
};

export function HorizontalArticleSlider({ 
  title, 
  items, 
  hideBottomBorder = false 
}: { 
  title: string; 
  items: SliderItem[]; 
  hideBottomBorder?: boolean; 
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const displayItems = items && items.length > 0 ? [...items, ...items, ...items] : [];

  useEffect(() => {
    if (scrollRef.current && items && items.length > 0) {
      const container = scrollRef.current;
      const singleSetWidth = container.scrollWidth / 3;
      if (container.scrollLeft === 0) {
        container.scrollLeft = singleSetWidth;
      }
    }
  }, [items]);

  const handleScroll = () => {
    if (!scrollRef.current || !items || items.length === 0) return;
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

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Scroll-fast
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 350;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`pt-3 pb-3 mx-0 px-0 ${hideBottomBorder ? '' : 'border-b-2 border-gray-300 dark:border-news-border'}`}>
      <h2 className="font-medium text-lg mb-4 capitalize tracking-wide">
        {title}
      </h2>
      
      <div className="relative group px-1">
        {displayItems.length > 0 && (
          <>
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
          </>
        )}

        <div 
          ref={scrollRef} 
          onScroll={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none cursor-grab active:cursor-grabbing select-none py-2"
        >
          <div className="flex gap-8 w-max">
            {displayItems.map((item, idx) => (
              <div key={`${item.id}-dup-${idx}`} className="w-55 shrink-0">
                <Link href={`/${item.slug}`} className="block mb-2 font-medium text-[14px] leading-relaxed py-0.5 hover:text-red-600 dark:hover:text-news-accent transition-colors">
                  {item.label}
                </Link>
                <Link href={`/article/${item.article.slug}`} className="group/article block transition-all duration-300" draggable={false}>
                  <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card mb-3 overflow-hidden">
                    {item.article.featured_image && (
                      <Image
                        src={getImageUrl(item.article.featured_image)!}
                        alt={item.article.title}
                        fill
                        sizes="220px"
                        draggable={false}
                        className="object-cover transition-transform duration-500 ease-out pointer-events-none"
                      />
                    )}
                  </div>
                  <h3 className="text-[14px] font-normal leading-relaxed line-clamp-3 max-h-[3.85em] overflow-hidden text-gray-900 dark:text-news-text group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors duration-300 pointer-events-none">
                    {item.article.title}
                  </h3>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
