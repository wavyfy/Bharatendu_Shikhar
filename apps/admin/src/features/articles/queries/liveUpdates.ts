import { supabaseAdmin } from "@repo/api";
import type { LiveUpdateRow } from "../types";

export async function getLiveUpdatesByArticleId(articleId: number): Promise<LiveUpdateRow[]> {
  const { data, error } = await supabaseAdmin
    .from("article_live_updates")
    .select("*")
    .eq("article_id", articleId)
    .order("created_at", { ascending: false });

  if (error) {
    // Graceful degradation: table may not exist yet (migration pending)
    console.warn("Could not fetch live updates:", error.message);
    return [];
  }

  return (data ?? []) as LiveUpdateRow[];
}
