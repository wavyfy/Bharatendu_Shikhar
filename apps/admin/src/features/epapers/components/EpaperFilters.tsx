"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { motion } from "framer-motion";

interface EpaperFiltersProps {
  currentStatus: string;
}

export function EpaperFilters({ currentStatus }: EpaperFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

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
          onClick={() => setFilter("status", "")}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          All
          {currentStatus === "" && (
            <motion.div layoutId="epaperStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
        <button
          onClick={() => setFilter("status", "active")}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "active" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          Active
          {currentStatus === "active" && (
            <motion.div layoutId="epaperStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
        <button
          onClick={() => setFilter("status", "expired")}
          className={`relative pb-3 text-sm font-medium transition-colors ${
            currentStatus === "expired" ? "text-red-600" : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200"
          }`}
        >
          Expired
          {currentStatus === "expired" && (
            <motion.div layoutId="epaperStatusIndicator" className="absolute -bottom-px left-0 w-full h-0.5 bg-red-600 rounded-t-sm" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
        </button>
      </div>
      
      <div className="p-4">
        <div className="w-full sm:max-w-md">
          <SearchInput placeholder="Search epapers by title..." />
        </div>
      </div>
    </div>
  );
}
