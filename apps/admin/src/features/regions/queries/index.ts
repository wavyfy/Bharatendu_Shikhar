import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";
import type { RegionRow } from "../types";

interface GetRegionsParams {
  page?: number;
  limit?: number;
}

export async function getRegions({ page = 1, limit = 20 }: GetRegionsParams = {}) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabase
    .from("regions")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching regions:", error.message);
    throw new Error("Failed to fetch regions");
  }

  return {
    regions: data as RegionRow[],
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getRegionById(id: number) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as RegionRow;
}
