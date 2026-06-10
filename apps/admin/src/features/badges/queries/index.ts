import { supabaseAdmin } from "@repo/api";
import type { BadgeRow } from "../types";

interface GetBadgesParams {
  page?: number;
  limit?: number;
}

export async function getBadges({ page = 1, limit = 50 }: GetBadgesParams = {}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("badges")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("Error fetching badges:", error.message);
    throw new Error("Failed to fetch badges");
  }

  return {
    badges: data as BadgeRow[],
    count: count ?? 0,
    totalPages: count ? Math.ceil(count / limit) : 0,
  };
}

export async function getBadgeById(id: number) {
  const { data, error } = await supabaseAdmin
    .from("badges")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as BadgeRow;
}
