"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
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

export function HorizontalArticleSlider({ title, items }: { title: string, items: SliderItem[] }) {
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
    <div className="py-8 border-b-2 border-gray-300 dark:border-news-border">
      <h2 className="font-playfair font-bold text-lg mb-4 uppercase tracking-wide">
        {title}
      </h2>
      
      <div className="relative group">
        <div 
          ref={scrollRef} 
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none cursor-grab active:cursor-grabbing select-none pb-4"
        >
          <div className="flex gap-6 w-max">
            {items.map((item) => (
              <div key={item.id} className="w-[220px] shrink-0">
                <Link href={`/${item.slug}`} className="block mb-2 font-bold text-[14px] hover:text-red-600 dark:hover:text-news-accent transition-colors">
                  {item.label}
                </Link>
                <Link href={`/article/${item.article.slug}`} className="group/article block hover:translate-y-[-2px] transition-all duration-300" draggable={false}>
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
                  <h4 className="font-playfair text-[14px] leading-snug line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors pointer-events-none">
                    {item.article.title}
                  </h4>
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {items.length > 4 && (
        <div className="flex justify-end mt-4 gap-2">
          <button 
            onClick={() => scroll('left')} 
            className="p-2 bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:bg-gray-50 dark:hover:bg-news-border rounded-full transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => scroll('right')} 
            className="p-2 bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:bg-gray-50 dark:hover:bg-news-border rounded-full transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
