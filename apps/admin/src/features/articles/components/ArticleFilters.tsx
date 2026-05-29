"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
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
    <div className="flex flex-col border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-t-lg">
      <div className="flex items-center gap-6 px-4 pt-4">
        <button
          onClick={() => setFilter("status", "")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("status", "published")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "published" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          Published
        </button>
        <button
          onClick={() => setFilter("status", "draft")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "draft" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          Drafts
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-gray-50/50 dark:bg-slate-700/30">
        <div className="flex-1">
          <SearchInput placeholder="Search articles..." />
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="w-48">
            <Select
              value={currentCategoryId}
              onChange={(value) => setFilter("category_id", value)}
              options={[
                { label: "All Categories", value: "" },
                ...categories.map((c) => ({ label: c.name, value: c.id.toString() })),
              ]}
              placeholder="All Categories"
            />
          </div>
          
          <div className="w-48">
            <Select
              value={currentRegionId}
              onChange={(value) => setFilter("region_id", value)}
              options={[
                { label: "All Regions", value: "" },
                ...regions.map((r) => ({ label: r.name, value: r.id.toString() })),
              ]}
              placeholder="All Regions"
            />
          </div>
          
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
