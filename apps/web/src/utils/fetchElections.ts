import { createSupabaseServerClient } from "@repo/api";
import { unstable_cache } from "next/cache";
import { cookies } from "next/headers";

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
  return data as any[];
}

export async function getElectionBySlug(slug: string) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });
  const { data, error } = await supabase
    .from("elections")
    .select(`
      *,
      region:regions(id, name)
    `)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
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
      candidates: g.candidates.sort((a: any, b: any) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
        return b.votes - a.votes; // fallback sorting by votes descending
      })
    })) || [],
    updates: updates || []
  };
}
