import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";

async function getClient() {
  const cookieStore = await cookies();
  return createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });
}

export async function getPublishedCompetitions(options: {
  sport?: string;
  status?: string;
  limit?: number;
} = {}) {
  const { sport, status, limit = 20 } = options;
  const supabase = await getClient();

  let query = (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_competitions")
    .select("id, title, slug, sport, competition_type, season, start_date, end_date, status, logo_url, banner_url")
    .eq("is_published", true);

  if (sport) query = query.eq("sport", sport);
  if (status) query = query.eq("status", status);

  query = query
    .order("display_order", { ascending: false })
    .order("start_date", { ascending: false })
    .limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}

export async function getCompetitionBySlug(slug: string) {
  const supabase = await getClient();

  const { data: competition, error } = await (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_competitions")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !competition) return null;

  const [{ data: matches }, { data: pointsTable }] = await Promise.all([
    (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
      .from("sports_matches")
      .select(
        "id, title, slug, sport, match_type, stage, match_date, status, home_team_name, away_team_name, home_score, away_score, result_text, live_status_text, is_featured, venue, match_number, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url)"
      )
      .eq("competition_id", competition.id)
      .eq("is_published", true)
      .order("match_date", { ascending: true }),
    (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
      .from("sports_points_table_entries")
      .select("*, team:sports_teams(id, name, short_name, logo_url)")
      .eq("competition_id", competition.id)
      .order("sort_order", { ascending: true })
      .order("points", { ascending: false }),
  ]);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    competition: competition as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    matches: (matches || []) as any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pointsTable: (pointsTable || []) as any[],
  };
}

export async function getPointsTableByCompetitionId(competitionId: string) {
  const supabase = await getClient();
  const { data: pointsTable } = await (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_points_table_entries")
    .select("*, team:sports_teams(id, name, short_name, logo_url)")
    .eq("competition_id", competitionId)
    .order("sort_order", { ascending: true })
    .order("points", { ascending: false });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (pointsTable || []) as any[];
}

export async function getLiveAndFeaturedMatches() {
  const supabase = await getClient();
  const [{ data: live }, { data: featured }] = await Promise.all([
    (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
      .from("sports_matches")
      .select(
        "id, title, slug, sport, match_type, status, match_date, home_team_name, away_team_name, home_score, away_score, live_status_text, result_text, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url), competition:sports_competitions(id, title, slug, logo_url)"
      )
      .eq("is_published", true)
      .eq("status", "live")
      .order("match_date", { ascending: false })
      .limit(10),
    (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
      .from("sports_matches")
      .select(
        "id, title, slug, sport, match_type, status, match_date, home_team_name, away_team_name, home_score, away_score, live_status_text, result_text, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url), competition:sports_competitions(id, title, slug, logo_url)"
      )
      .eq("is_published", true)
      .eq("is_featured", true)
      .order("match_date", { ascending: true })
      .limit(5),
  ]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { live: (live || []) as any[], featured: (featured || []) as any[] };
}

export async function getPublishedMatches(
  options: {
    sport?: string;
    status?: string;
    limit?: number;
  } = {}
) {
  const { sport, status, limit = 20 } = options;
  const supabase = await getClient();

  let query = (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_matches")
    .select(
      "id, title, slug, sport, match_type, stage, status, match_date, home_team_name, away_team_name, home_score, away_score, result_text, live_status_text, venue, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url), competition:sports_competitions(id, title, slug, logo_url)"
    )
    .eq("is_published", true);

  if (sport) query = query.eq("sport", sport);
  if (status) query = query.eq("status", status);

  query = query.order("match_date", { ascending: false }).limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data as any[];
}

export async function getMatchBySlug(slug: string) {
  const supabase = await getClient();

  const { data: match, error } = await (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_matches")
    .select(
      "*, home_team:sports_teams!sports_matches_home_team_id_fkey(id, name, short_name, logo_url), away_team:sports_teams!sports_matches_away_team_id_fkey(id, name, short_name, logo_url), competition:sports_competitions(id, title, slug, logo_url)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !match) return null;

  const { data: updates } = await (supabase as any) /* eslint-disable-line @typescript-eslint/no-explicit-any */
    .from("sports_match_updates")
    .select("*")
    .eq("match_id", match.id)
    .order("created_at", { ascending: false })
    .limit(100);

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    match: match as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updates: (updates || []) as any[],
  };
}
