import { supabaseAdmin } from "@repo/api";

export async function getMatches(
  options: {
    sport?: string;
    status?: string;
    competitionId?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const { sport, status, competitionId, search, page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin.from("sports_matches").select(
    `*,
    competition:sports_competitions(id, title, slug),
    home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url),
    away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url)`,
    { count: "exact" }
  );

  if (sport) query = query.eq("sport", sport);
  if (status) query = query.eq("status", status);
  if (competitionId) query = query.eq("competition_id", competitionId);
  if (search) query = query.ilike("title", `%${search}%`);

  query = query
    .order("match_date", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("Supabase Error fetching matches:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    throw new Error("Failed to fetch matches");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { matches: data as any[], count: count || 0 };
}

export async function getMatchById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_matches")
    .select(
      `*,
      competition:sports_competitions(id, title, slug),
      home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url),
      away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url),
      region:regions(id, name)`
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}

export async function getMatchUpdates(matchId: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_match_updates")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}
