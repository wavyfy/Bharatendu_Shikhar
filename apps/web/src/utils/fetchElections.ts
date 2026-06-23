import { createSupabaseServerClient } from "@repo/api";

import { cookies } from "next/headers";

/**
 * Fetches published elections, optionally filtered by region, status, or limit.
 *
 * @param options.limit - Maximum number of elections to return.
 * @param options.regionId - Filter elections by region ID.
 * @param options.status - Filter elections by election status.
 * @returns An array of election records with joined region data. Returns an empty array if the query fails.
 */
export async function getElections(options: { limit?: number, regionId?: string, status?: string } = {}) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });
  
  let query = supabase
    .from("elections")
    .select(`
      *,
      region:regions(id, name)
    `)
    .eq("is_published", true);

  if (options.regionId) {
    query = query.eq("region_id", parseInt(options.regionId));
  }
  if (options.status) {
    query = query.eq("status", options.status);
  }

  query = query.order("display_order", { ascending: false }).order("created_at", { ascending: false });

  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching elections:", error.message);
    return [];
  }
  return data as Record<string, unknown>[];
}

/**
 * Fetches a published election by its slug, including its groups, candidates, and updates.
 *
 * @param slug - A URL-encoded election slug
 * @returns The election with its associated groups and updates, or `null` if the election is not found
 */
export async function getElectionBySlug(slug: string) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });
  const decodedSlug = decodeURIComponent(slug);
  const { data, error } = await supabase
    .from("elections")
    .select(`
      *,
      region:regions(id, name)
    `)
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("getElectionBySlug error:", error);
    return null;
  }

  // Fetch groups and candidates
  const { data: groups } = await supabase
    .from("election_groups")
    .select(`
      *,
      candidates:election_candidates(*)
    `)
    .eq("election_id", data.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  // Fetch updates
  const { data: updates } = await supabase
    .from("election_updates")
    .select("*")
    .eq("election_id", data.id)
    .order("created_at", { ascending: false });

  return {
    ...data,
    groups: groups?.map(g => ({
      ...g,
      candidates: g.candidates.sort((a: { sort_order?: number; votes?: number }, b: { sort_order?: number; votes?: number }) => {
        const orderA = a.sort_order || 0;
        const orderB = b.sort_order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return (b.votes || 0) - (a.votes || 0); // fallback sorting by votes descending
      })
    })) || [],
    updates: updates || []
  };
}
