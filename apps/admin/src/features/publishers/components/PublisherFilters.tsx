"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { SearchInput } from "@/components/ui/SearchInput";

interface PublisherFiltersProps {
  currentStatus: string;
}

export function PublisherFilters({ currentStatus }: PublisherFiltersProps) {
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
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("status", "active")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "active" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("status", "inactive")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            currentStatus === "inactive" ? "border-red-600 text-red-600" : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300"
          }`}
        >
          Inactive
        </button>
      </div>
      
      <div className="p-4">
        <div className="w-full sm:max-w-md">
          <SearchInput placeholder="Search publishers by name..." />
        </div>
      </div>
    </div>
  );
}
