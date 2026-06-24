import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";
import type { EpaperWithRelations } from "../types";

export interface GetEpapersOptions {
  page?: number;
  limit?: number;
  role?: string;
  userId?: string;
  search?: string;
  status?: string;
  regionId?: number;
}

export async function getEpapers(options: GetEpapersOptions = {}) {
  const { page = 1, limit = 10, role = "publisher", userId, search, regionId, status } = options;
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  let query = supabase
    .from("epapers")
    .select(`
      *,
      region:regions(id, name, slug),
      author:profiles!epapers_uploaded_by_fkey(id, full_name)
    `, { count: 'exact' });

  if (role === "publisher" && userId) {
    query = query.eq("author_id", userId);
  }

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  
  if (regionId) {
    query = query.eq("region_id", regionId);
  }

  if (status === "active") {
    // Active means either no expiry date, or expiry date is in the future
    query = query.or(`expiry_date.is.null,expiry_date.gte.${new Date().toISOString()}`);
  } else if (status === "expired") {
    // Expired means expiry date is in the past
    query = query.lt("expiry_date", new Date().toISOString());
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  query = query.order("created_at", { ascending: false }).range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error("Error fetching epapers:", error.message);
    throw new Error("Failed to fetch epapers");
  }

  return {
    epapers: data as EpaperWithRelations[],
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getEpaperById(id: number, authorId: string | null = null) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const query = supabase
    .from("epapers")
    .select(`
      *,
      region:regions(id, name, slug),
      author:profiles!epapers_uploaded_by_fkey(id, full_name)
    `)
    .eq("id", id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching epaper:", error.message);
    return null;
  }

  // Permission check: if authorId is provided (publisher), they must own it
  if (authorId && (data as { author_id: string }).author_id !== authorId) {
    return null;
  }

  return data as EpaperWithRelations;
}
