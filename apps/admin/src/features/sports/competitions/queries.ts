import { supabaseAdmin } from "@repo/api";

export async function getCompetitions(
  options: {
    sport?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  } = {}
) {
  const { sport, status, search, page = 1, limit = 20 } = options;
  const offset = (page - 1) * limit;

  let query = supabaseAdmin
    .from("sports_competitions")
    .select("*, region:regions(id, name)", {
      count: "exact",
    });

  if (sport) query = query.eq("sport", sport);
  if (status) query = query.eq("status", status);
  if (search) query = query.ilike("title", `%${search}%`);

  query = query
    .order("display_order", { ascending: false })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error("Failed to fetch competitions");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { competitions: data as any[], count: count || 0 };
}

export async function getCompetitionById(id: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_competitions")
    .select("*, region:regions(id, name)")
    .eq("id", id)
    .single();
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any;
}

export async function getCompetitionMatches(competitionId: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_matches")
    .select(
      "id, title, slug, sport, match_type, stage, match_date, status, home_team_name, away_team_name, home_score, away_score, result_text, is_featured, is_published, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url)"
    )
    .eq("competition_id", competitionId)
    .order("match_date", { ascending: true });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}

export async function getCompetitionPointsTable(competitionId: string) {
  const { data, error } = await supabaseAdmin
    .from("sports_points_table_entries")
    .select("*, team:sports_teams(id, name, short_name, logo_url)")
    .eq("competition_id", competitionId)
    .order("sort_order", { ascending: true })
    .order("points", { ascending: false });
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}
