"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useState, useEffect } from "react";

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
    <div className={`relative ${className}`}>
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-300 focus:border-gray-400 text-sm bg-white shadow-sm text-gray-700 outline-none transition-shadow ${
          isPending ? "opacity-70" : ""
        }`}
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
