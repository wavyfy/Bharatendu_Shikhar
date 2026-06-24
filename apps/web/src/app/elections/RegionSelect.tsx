"use client";

import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export function RegionSelect({ 
  regions, 
  defaultRegionId 
}: { 
  regions: { id: string | number; name: string }[], 
  defaultRegionId: string 
}) {
  const router = useRouter();

  return (
    <div className="relative w-full md:w-48">
      <select 
        className="w-full px-4 py-2.5 text-sm font-medium border-2 border-gray-200 dark:border-news-border rounded-sm bg-white dark:bg-news-card text-black dark:text-news-text appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 capitalize"
        defaultValue={defaultRegionId}
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            router.push(`/elections?region=${val}`);
          } else {
            router.push(`/elections`);
          }
        }}
      >
        <option className="dark:bg-news-card dark:text-news-text" value="">सभी राज्य</option>
        {regions.map((r: { id: string | number; name: string }) => (
          <option className="dark:bg-news-card dark:text-news-text" key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
    </div>
  );
}
