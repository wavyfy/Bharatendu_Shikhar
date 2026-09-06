"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Loader2, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@repo/api";
import { ArticleWithAuthor } from "@/utils/mapArticleData";

type ArticleWithCategories = ArticleWithAuthor & {
  categories?: {
    id: number;
    name: string;
    slug: string;
  } | null;
};

export function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [results, setResults] = useState<ArticleWithCategories[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const LIMIT = 12;

  // Sync debounced query when user types
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== initialQuery) {
        if (query.trim()) {
          router.replace(`/search?q=${encodeURIComponent(query)}`, { scroll: false });
        } else {
          router.replace("/search", { scroll: false });
        }
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query, initialQuery, router]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults([]);
      setHasMore(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const now = new Date().toISOString();
      const { data, error: sbError } = await supabase
        .from("articles")
        .select("*, categories(id, name, slug)")
        .eq("status", "published")
        .lte("published_at", now)
        .or(
          `title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`
        )
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
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  const loadMore = async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    const nextPage = page + 1;
    const start = (nextPage - 1) * LIMIT;
    const end = start + LIMIT - 1;

    try {
      const now = new Date().toISOString();
      const { data, error: sbError } = await supabase
        .from("articles")
        .select("*, categories(id, name, slug)")
        .eq("status", "published")
        .lte("published_at", now)
        .or(
          `title.ilike.%${debouncedQuery}%,excerpt.ilike.%${debouncedQuery}%,content.ilike.%${debouncedQuery}%`
        )
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

  return (
    <div className="space-y-6">
      {/* Search Input Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-news-card p-3 rounded-xl border border-gray-200 dark:border-news-border shadow-sm">
        <Search className="text-gray-400 shrink-0 ml-2" size={20} />
        <input
          type="text"
          placeholder="लेख खोजें..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-base outline-none text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="text-gray-400 hover:text-black dark:hover:text-white p-1 shrink-0"
            aria-label="Clear query"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Results Area */}
      {debouncedQuery.length > 0 && debouncedQuery.length < 2 && (
        <div className="text-center text-gray-500 py-10">
          कृपया खोजने के लिए कम से कम 2 अक्षर दर्ज करें।
        </div>
      )}

      {isLoading && results.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="animate-spin text-red-600" size={32} />
        </div>
      )}

      {error && <div className="text-center text-red-600 py-10">{error}</div>}

      {!isLoading &&
        debouncedQuery.length >= 2 &&
        results.length === 0 &&
        !error && (
          <div className="text-center text-gray-500 py-10 bg-white dark:bg-news-card rounded-xl border border-gray-200 dark:border-news-border">
            &quot;{debouncedQuery}&quot; के लिए कोई लेख नहीं मिला।
          </div>
        )}

      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((article, index) => (
            <Link
              key={`${article.id}-${index}`}
              href={`/article/${article.slug}`}
              className="block bg-white dark:bg-news-card p-5 rounded-xl border border-gray-200 dark:border-news-border hover:border-red-300 dark:hover:border-red-900 transition-colors group shadow-sm"
            >
              <h2 className="font-semibold text-xl mb-2 group-hover:text-red-600 dark:group-hover:text-news-accent transition-colors text-black dark:text-news-text leading-snug">
                {article.title}
              </h2>
              {article.excerpt && (
                <p className="text-gray-600 dark:text-news-text-secondary text-sm line-clamp-2 mb-3 leading-relaxed">
                  {article.excerpt}
                </p>
              )}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-news-text-muted pt-2 border-t border-gray-100 dark:border-news-border">
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString("hi-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
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

      {results.length > 0 && hasMore && (
        <div className="mt-8 text-center pb-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="bg-gray-200 dark:bg-news-border text-black dark:text-news-text px-6 py-2.5 rounded-full font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={16} />}
            {isLoading ? "लोड हो रहा है..." : "और लोड करें"}
          </button>
        </div>
      )}
    </div>
  );
}
