"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
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
      scrollRef.current.scrollBy({ left: direction === "left" ? -300 : 300, behavior: "smooth" });
    }
  };

  const renderItem = (item: SliderItem) => (
    <div key={item.id} className="w-[260px] shrink-0">
      <Link href={`/article/${item.article.slug}`} className="group/article block hover:translate-y-[-2px] transition-all duration-300" draggable={false}>
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
        <h4 className="font-playfair text-[15px] leading-snug line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors pointer-events-none">
          {item.article.title}
        </h4>
      </Link>
    </div>
  );

  return (
    <div className="py-6 relative border-t-2 border-gray-300 dark:border-news-border mt-6">
      
      {/* Header & Controls */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-playfair font-bold text-xl uppercase tracking-wide">
          Related Articles
        </h2>
        <div className="flex gap-4">
          <button onClick={() => scroll('left')} className="p-2 bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:bg-gray-50 rounded-full transition-colors" aria-label="Scroll left">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => scroll('right')} className="p-2 bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:bg-gray-50 rounded-full transition-colors" aria-label="Scroll right">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef} 
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4"
      >
        <div className="flex flex-col gap-8 w-max">
          {topItems.length > 0 && (
            <div className="flex gap-8 items-start">
              <div className="w-[120px] shrink-0 border-l-4 border-red-600 pl-3">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Topic
                </h3>
                <h4 className="font-playfair font-bold text-sm mt-1 leading-tight text-gray-900 dark:text-gray-100">
                  {topTitle}
                </h4>
              </div>
              {topItems.map(renderItem)}
            </div>
          )}
          
          {bottomItems.length > 0 && (
            <div className="flex gap-8 items-start">
              <div className="w-[120px] shrink-0 border-l-4 border-red-600 pl-3">
                <h3 className="font-bold text-[11px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Region
                </h3>
                <h4 className="font-playfair font-bold text-sm mt-1 leading-tight text-gray-900 dark:text-gray-100">
                  {bottomTitle}
                </h4>
              </div>
              {bottomItems.map(renderItem)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
