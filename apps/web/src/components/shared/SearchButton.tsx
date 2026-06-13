"use client";

import { Search } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export function SearchButton({ className }: { className?: string }) {
  const { openSearch } = useSearch();

  return (
    <button 
      onClick={openSearch}
      className={className || "group relative flex items-center bg-gray-200 dark:bg-news-bg hover:bg-gray-300 dark:hover:bg-[#1A1A1A] border border-gray-200 dark:border-news-border rounded-full h-[42px] transition-all duration-500 ease-out w-[42px] hover:w-[220px] text-gray-500 dark:text-news-text-muted hover:text-black dark:hover:text-white overflow-hidden ml-auto"}
    >
      <span className="absolute left-5 text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">Search Articles...</span>
      <div className="absolute right-[2px] top-[2px] bottom-[2px] w-[36px] bg-white dark:bg-news-card rounded-full flex items-center justify-center shadow-sm">
        <Search size={16} strokeWidth={2.5} className="text-gray-600 dark:text-news-text transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3" />
      </div>
    </button>
  );
}
