import { supabase } from "@repo/api";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const IS_DEV = process.env.NODE_ENV === "development";

async function _getElections(options: { limit?: number, regionId?: string, status?: string } = {}) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}

async function _getElectionBySlug(slug: string) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      candidates: g.candidates.sort((a: any, b: any) => {
        const orderA = a.sort_order || 0;
        const orderB = b.sort_order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return (b.votes || 0) - (a.votes || 0); // fallback sorting by votes descending
      })
    })) || [],
    updates: updates || []
  };
}

export const getElections = IS_DEV ? cache(_getElections) : unstable_cache(cache(_getElections), ["getElections"], { tags: ["elections"] });
export const getElectionBySlug = IS_DEV ? cache(_getElectionBySlug) : unstable_cache(cache(_getElectionBySlug), ["getElectionBySlug"], { tags: ["elections"] });
