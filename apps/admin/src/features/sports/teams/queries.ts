import { supabaseAdmin } from "@repo/api";

export async function getTeams(
  options: { sport?: string; search?: string; page?: number; limit?: number } = {}
) {
  const { sport, search, page = 1, limit = 50 } = options;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("sports_teams")
    .select("*", { count: "exact" });

  if (sport) query = query.eq("sport", sport);
  if (search) query = query.ilike("name", `%${search}%`);

  query = query
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error("Failed to fetch teams");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { teams: data as any[], count: count || 0 };
}

export async function getTeamById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_teams")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}

export async function getAllTeams(sport?: string) {
  let query = supabaseAdmin
    .from("sports_teams")
    .select("id, name, short_name, sport, logo_url")
    .order("name", { ascending: true });
  if (sport) query = query.or(`sport.eq.${sport},sport.is.null`);
  const { data, error } = await query;
  if (error) throw new Error("Failed to fetch teams");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}
