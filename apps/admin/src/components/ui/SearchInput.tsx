"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Search...", className = "" }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(searchParams.get("search") || "");
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, val: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (val) {
        params.set(name, val);
      } else {
        params.delete(name);
      }
      params.set("page", "1"); // Reset to page 1 on new search
      return params.toString();
    },
    [searchParams]
  );

  const applySearch = (val: string) => {
    startTransition(() => {
      router.push("?" + createQueryString("search", val));
    });
  };

  return (
    <div className={`relative w-full sm:min-w-[300px] md:min-w-[400px] ${className}`}>
      <button 
        type="button"
        onClick={() => applySearch(value)}
        className="absolute left-3 top-2.5 text-slate-400 hover:text-red-600 transition-colors"
      >
        <Search className="h-4 w-4" />
      </button>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        className={`w-full pl-10 pr-10 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:border-red-600 focus:ring-1 focus:ring-red-600/30 text-sm bg-surface text-on-surface placeholder:text-slate-400 outline-none transition-all shadow-sm ${
          isPending ? "opacity-70" : ""
        } ${className}`}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            applySearch(e.currentTarget.value);
          }
        }}
        onBlur={(e) => {
          if (e.target.value !== (searchParams.get("search") || "")) {
            applySearch(e.target.value);
          }
        }}
      />
      {isPending && (
        <span className="absolute right-3 top-2.5 flex h-4 w-4">
          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></span>
        </span>
      )}
    </div>
  );
}
