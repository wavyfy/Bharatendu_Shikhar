"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearch } from "@/context/SearchContext";
import { supabase } from "@repo/api";
import { ArticleWithAuthor } from "@/utils/mapArticleData";

type ArticleWithCategories = ArticleWithAuthor & {
  categories?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export function SearchModal() {
  const { isSearchOpen, closeSearch } = useSearch();
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<ArticleWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const LIMIT = 10;

  // Debounce input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Search
  useEffect(() => {
    const performSearch = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        setHasMore(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error: sbError } = await supabase
          .from("articles")
          .select("*, categories(id, name, slug)")
          .eq("status", "published")
          .or(`title.ilike.%${debouncedQuery}%,excerpt.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`)
          .order("published_at", { ascending: false })
          .range(0, LIMIT - 1);

        if (sbError) throw sbError;

        setResults((data as unknown as ArticleWithCategories[]) || []);
        setHasMore(data?.length === LIMIT);
        setPage(1);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || "Failed to search articles.");
        } else {
          setError("Failed to search articles.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  const loadMore = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const start = (nextPage - 1) * LIMIT;
    const end = start + LIMIT - 1;

    try {
      const { data, error: sbError } = await supabase
        .from("articles")
        .select("*, categories(id, name, slug)")
        .eq("status", "published")
        .or(`title.ilike.%${debouncedQuery}%,excerpt.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`)
        .order("published_at", { ascending: false })
        .range(start, end);

      if (sbError) throw sbError;

      if (data) {
        setResults((prev) => {
          const newItems = (data as unknown as ArticleWithCategories[]).filter(
            (item) => !prev.some((p) => p.id === item.id)
          );
          return [...prev, ...newItems];
        });
        setHasMore(data.length === LIMIT);
        setPage(nextPage);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Failed to load more articles.");
      } else {
        setError("Failed to load more articles.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSearch();
    };
    if (isSearchOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isSearchOpen, closeSearch]);

  const handleClose = () => {
    closeSearch();
    setQuery("");
    setResults([]);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-200 flex items-start justify-center md:items-center pt-0 md:pt-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-3xl bg-white dark:bg-news-bg flex flex-col shadow-2xl md:rounded-2xl overflow-hidden"
          >
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-200 dark:border-news-border focus-within:border-gray-400 dark:focus-within:border-gray-600 bg-white dark:bg-news-bg focus-within:bg-gray-50 dark:focus-within:bg-news-card transition-colors duration-300">
              <Search className="text-gray-400 dark:text-news-text-muted shrink-0" size={24} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-xl outline-none text-black dark:text-news-text placeholder:text-gray-400 dark:placeholder:text-news-text-muted"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-gray-400 hover:text-black dark:hover:text-white p-1"
                >
                  <X size={20} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="md:hidden text-black dark:text-white font-medium pl-2"
              >
                Cancel
              </button>
            </div>

            {/* Results Area */}
            {query.length > 0 && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50 dark:bg-[#111]">
                {query.length > 0 && query.length < 2 && (
                  <div className="text-center text-gray-500 py-10">
                    Please enter at least 2 characters to search.
                  </div>
                )}

                {isLoading && results.length === 0 && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="animate-spin text-red-600" size={32} />
                  </div>
                )}

                {error && (
                  <div className="text-center text-red-600 py-10">
                    {error}
                  </div>
                )}

                {!isLoading && debouncedQuery.length >= 2 && results.length === 0 && !error && (
                  <div className="text-center text-gray-500 py-10">
                    No articles found for &quot;{debouncedQuery}&quot;
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-4">
                    {results.map((article, index) => (
                      <Link
                        key={`${article.id}-${index}`}
                        href={`/article/${article.slug}`}
                        onClick={handleClose}
                        className="block bg-white dark:bg-news-card p-4 rounded-xl border border-gray-100 dark:border-news-border hover:border-red-200 dark:hover:border-red-900 transition-colors group"
                      >
                        <h3 className="font-playfair font-bold text-lg mb-2 group-hover:text-red-600 dark:group-hover:text-news-accent transition-colors text-black dark:text-news-text">
                          {article.title}
                        </h3>
                        {article.excerpt && (
                          <p className="text-gray-600 dark:text-news-text-secondary text-sm line-clamp-2 mb-3">
                            {article.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-news-text-muted">
                          <span>
                            {article.published_at
                              ? new Date(article.published_at).toLocaleDateString()
                              : ""}
                          </span>
                          {article.categories && (
                            <span className="text-red-600 font-medium">
                              {article.categories.name}
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load More */}
                {results.length > 0 && hasMore && (
                  <div className="mt-8 text-center pb-8">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={loadMore}
                      disabled={isLoading}
                      className="bg-gray-200 dark:bg-news-border text-black dark:text-news-text px-6 py-2 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                    >
                      {isLoading && <Loader2 className="animate-spin" size={16} />}
                      {isLoading ? "Loading..." : "Load More"}
                    </motion.button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
