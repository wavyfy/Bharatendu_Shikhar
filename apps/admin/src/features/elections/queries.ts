import { supabaseAdmin } from "@repo/api";


export async function getElections(options: { search?: string, status?: string, region_id?: string, page?: number, limit?: number } = {}) {
  const { search, status, region_id, page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("elections")
    .select(`
      *,
      region:regions(id, name),
      author:profiles!elections_created_by_fkey(id, full_name)
    `, { count: "exact" });

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (region_id) {
    query = query.eq("region_id", parseInt(region_id));
  }

  query = query.order("display_order", { ascending: false }).order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("Error fetching elections:", error.message);
    throw new Error("Failed to fetch elections");
  }

  return { elections: data as Record<string, unknown>[], count: count || 0 };
}

export async function getElectionById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("elections")
    .select(`
      *,
      region:regions(id, name)
    `)
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Record<string, unknown>;
}

export async function getElectionGroups(electionId: string) {
  const { data, error } = await supabaseAdmin
    .from("election_groups")
    .select("*")
    .eq("election_id", electionId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Record<string, unknown>[];
}

export async function getElectionCandidates(groupId: string) {
  const { data, error } = await supabaseAdmin
    .from("election_candidates")
    .select("*")
    .eq("group_id", groupId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data as Record<string, unknown>[];
}

export async function getElectionUpdates(electionId: string) {
  const { data, error } = await supabaseAdmin
    .from("election_updates")
    .select("*")
    .eq("election_id", electionId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Record<string, unknown>[];
}
