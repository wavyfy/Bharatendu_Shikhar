"use client";

import { useRouter } from "next/navigation";

export function RegionSelect({ 
  regions, 
  defaultRegionId 
}: { 
  regions: { id: string | number; name: string }[], 
  defaultRegionId: string 
}) {
  const router = useRouter();

  return (
    <select 
      className="w-full md:w-48 p-2 text-sm border rounded-md bg-background text-foreground"
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
      <option value="">All Regions</option>
      {regions.map((r: { id: string | number; name: string }) => (
        <option key={r.id} value={r.id}>{r.name}</option>
      ))}
    </select>
  );
}
