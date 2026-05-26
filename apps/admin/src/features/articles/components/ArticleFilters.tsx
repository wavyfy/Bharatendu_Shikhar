"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import type { CategoryRow } from "@/features/categories/types";
import type { RegionRow } from "@/features/regions/types";

interface ArticleFiltersProps {
  categories: CategoryRow[];
  regions: RegionRow[];
}

export function ArticleFilters({ categories, regions }: ArticleFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentSearch = searchParams.get("search") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentCategoryId = searchParams.get("category_id") || "";
  const currentRegionId = searchParams.get("region_id") || "";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset to page 1 on new filter
      return params.toString();
    },
    [searchParams]
  );

  const setFilter = (name: string, value: string) => {
    startTransition(() => {
      router.push("?" + createQueryString(name, value));
    });
  };

  return (
    <div className="flex flex-col border-b border-gray-200 bg-white rounded-t-lg">
      <div className="flex items-center gap-6 px-4 pt-4">
        <button
          onClick={() => setFilter("status", "")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("status", "published")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "published" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter("status", "draft")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "draft" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Drafts
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50/50">
        <div className="flex-1">
          <input
            type="search"
            placeholder="Search articles..."
            defaultValue={currentSearch}
            className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 text-sm bg-white"
            onChange={() => {
              // A simple debounce could be used here, but we will just rely on native input for MVP
              // we will push to router on blur or press enter to avoid too many requests
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilter("search", e.currentTarget.value);
              }
            }}
            onBlur={(e) => {
              setFilter("search", e.target.value);
            }}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={currentCategoryId}
            onChange={(e) => setFilter("category_id", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 text-sm bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <select
            value={currentRegionId}
            onChange={(e) => setFilter("region_id", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 text-sm bg-white"
          >
            <option value="">All Regions</option>
            {regions.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          
          {(currentSearch || currentStatus || currentCategoryId || currentRegionId) && (
            <Button 
              variant="ghost" 
              onClick={() => {
                startTransition(() => {
                  router.push("/articles");
                });
              }}
              disabled={isPending}
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
