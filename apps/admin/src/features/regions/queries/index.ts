import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";
import type { RegionRow } from "../types";

interface GetRegionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  level?: string;
}

export async function getRegions({ page = 1, limit = 20, search, status, level }: GetRegionsParams = {}) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("regions")
    .select("*", { count: 'exact' });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status === "active") {
    query = query.eq("is_active", true);
  } else if (status === "inactive") {
    query = query.eq("is_active", false);
  }

  if (level === "countries") {
    query = query.is("parent_id", null);
  } else if (level === "states") {
    const { data: countries } = await supabase.from("regions").select("id").is("parent_id", null);
    const countryIds = countries?.map(c => c.id) || [];
    query = countryIds.length > 0 ? query.in("parent_id", countryIds) : query.eq("id", -1);
  } else if (level === "cities") {
    const { data: countries } = await supabase.from("regions").select("id").is("parent_id", null);
    const countryIds = countries?.map(c => c.id) || [];
    if (countryIds.length > 0) {
      const { data: states } = await supabase.from("regions").select("id").in("parent_id", countryIds);
      const stateIds = states?.map(s => s.id) || [];
      query = stateIds.length > 0 ? query.in("parent_id", stateIds) : query.eq("id", -1);
    } else {
      query = query.eq("id", -1);
    }
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching regions:", error.message);
    throw new Error("Failed to fetch regions");
  }

  const regions = data as RegionRow[];
  const parentIds = [...new Set(regions.map(r => r.parent_id).filter(Boolean))] as number[];
  
  if (parentIds.length > 0) {
    const { data: parents } = await supabase
      .from("regions")
      .select("id, name")
      .in("id", parentIds);
      
    if (parents) {
      const parentMap = new Map(parents.map(p => [p.id, { name: p.name }]));
      regions.forEach(r => {
        if (r.parent_id) {
          r.parent = parentMap.get(r.parent_id) || null;
        }
      });
    }
  }

  return {
    regions,
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
