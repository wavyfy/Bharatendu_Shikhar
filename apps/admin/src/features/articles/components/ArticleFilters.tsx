"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import type { CategoryRow } from "@/features/categories/types";
import type { RegionRow } from "@/features/regions/types";
import { motion } from "framer-motion";

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
  const currentIsLive = searchParams.get("is_live") || "";

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
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-6 px-4 pt-4">
        <button
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "" && currentIsLive === "" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
          onClick={() => {
            startTransition(() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("status");
              params.delete("is_live");
              params.set("page", "1");
              router.push("?" + params.toString());
            });
          }}
        >
          All
          {currentStatus === "" && currentIsLive === "" && (
            <motion.div layoutId="articleStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
        <button
          onClick={() => setFilter("status", "published")}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "published" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          Published
          {currentStatus === "published" && (
            <motion.div layoutId="articleStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
        <button
          onClick={() => setFilter("status", "draft")}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "draft" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          Drafts
          {currentStatus === "draft" && (
            <motion.div layoutId="articleStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
        {/* Live tab */}
        <button
          className={`relative pb-3 text-sm font-medium transition-colors flex items-center gap-1.5 ${
            currentIsLive === "true" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
          onClick={() => {
            startTransition(() => {
              const params = new URLSearchParams(searchParams.toString());
              if (currentIsLive === "true") {
                params.delete("is_live");
              } else {
                params.set("is_live", "true");
                params.delete("status");
              }
              params.set("page", "1");
              router.push("?" + params.toString());
            });
          }}
        >
          {currentIsLive === "true" && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          )}
          Live
          {currentIsLive === "true" && (
            <motion.div layoutId="articleStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 p-4">
        <div className="flex-1">
          <SearchInput placeholder="Search articles..." />
        </div>
        <div className="flex gap-2 flex-wrap w-full sm:w-auto">
          <div className="flex-1 sm:w-48 sm:flex-none min-w-35 sm:min-w-0">
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
          
          <div className="flex-1 sm:w-48 sm:flex-none min-w-35 sm:min-w-0">
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
          
          {(currentSearch || currentStatus || currentCategoryId || currentRegionId || currentIsLive) && (
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
