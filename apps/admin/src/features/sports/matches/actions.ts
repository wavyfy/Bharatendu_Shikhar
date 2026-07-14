"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { revalidatePath } from "next/cache";

const matchSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3),
  sport: z.enum(["cricket", "football"]),
  match_type: z
    .enum(["test", "odi", "t20", "league", "cup", "friendly"])
    .nullable()
    .optional(),
  competition_id: z.string().uuid().nullable().optional(),
  home_team_id: z.string().uuid().nullable().optional(),
  away_team_id: z.string().uuid().nullable().optional(),
  home_team_name: z.string().nullable().optional(),
  away_team_name: z.string().nullable().optional(),
  venue: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  is_international: z.boolean().default(false),
  match_date: z.string().nullable().optional(),
  status: z.enum(["upcoming", "live", "completed"]),
  stage: z.string().nullable().optional(),
  is_featured: z.boolean().default(false),
  match_number: z.string().nullable().optional(),
  is_published: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
  region_id: z.coerce.number().nullable().optional(),
});

const scoreSchema = z.object({
  home_score: z.string().nullable().optional(),
  away_score: z.string().nullable().optional(),
  result_text: z.string().nullable().optional(),
  live_status_text: z.string().nullable().optional(),
  winning_team: z.string().nullable().optional(),
  toss_info: z.string().nullable().optional(),
  match_note: z.string().nullable().optional(),
});

const updateSchema = z.object({
  update_type: z.enum(["commentary", "wicket", "goal", "milestone", "status"]),
  title: z.string().nullable().optional(),
  content: z.string().min(1),
  over_ball: z.string().nullable().optional(),
  minute: z.coerce.number().nullable().optional(),
  is_key_moment: z.boolean().default(false),
});

async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  return { supabase, user };
}

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function parseMatchFormData(formData: FormData) {
  const bool = (k: string) =>
    formData.get(k) === "on" || formData.get(k) === "true";
  const str = (k: string) => formData.get(k)?.toString() || null;
  const title = str("title") || "";
  return {
    title,
    slug: slugify(title),
    sport: str("sport") || "cricket",
    match_type: str("match_type"),
    competition_id: str("competition_id"),
    home_team_id: str("home_team_id"),
    away_team_id: str("away_team_id"),
    home_team_name: str("home_team_name"),
    away_team_name: str("away_team_name"),
    venue: str("venue"),
    country: str("country"),
    is_international: bool("is_international"),
    match_date: str("match_date"),
    status: str("status") || "upcoming",
    stage: str("stage"),
    is_featured: bool("is_featured"),
    match_number: str("match_number"),
    is_published: bool("is_published"),
    display_order: formData.get("display_order") || 0,
    region_id: formData.get("region_id") || null,
  };
}

export async function createMatchAction(formData: FormData) {
  try {
    const { user } = await getAuth();
    const validated = matchSchema.parse(parseMatchFormData(formData));
    const { data, error } = await supabaseAdmin
      .from("sports_matches")
      .insert({ ...validated, created_by: user.id })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/sports/matches");
    return { success: true, data };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    } else if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "23505"
    ) {
      msg = "A match with this slug already exists.";
    }
    return { success: false, error: msg };
  }
}

export async function updateMatchAction(id: string, formData: FormData) {
  try {
    await getAuth();
    const validated = matchSchema.parse(parseMatchFormData(formData));
    const { error } = await supabaseAdmin
      .from("sports_matches")
      .update(validated)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/matches");
    revalidatePath(`/sports/matches/${id}`);
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    } else if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "23505"
    ) {
      msg = "A match with this slug already exists.";
    }
    return { success: false, error: msg };
  }
}

export async function toggleMatchPublishAction(
  id: string,
  is_published: boolean
) {
  try {
    await getAuth();
    const { error } = await supabaseAdmin
      .from("sports_matches")
      .update({ is_published })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/matches");
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    }
    return {
      success: false,
      error: msg,
    };
  }
}

export async function deleteMatchAction(id: string) {
  try {
    await getAuth();
    const { error } = await supabaseAdmin
      .from("sports_matches")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/matches");
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    }
    return {
      success: false,
      error: msg,
    };
  }
}

export async function updateMatchScoreAction(
  id: string,
  formData: FormData
) {
  try {
    await getAuth();
    const str = (k: string) => formData.get(k)?.toString() || null;
    const payload = {
      home_score: str("home_score"),
      away_score: str("away_score"),
      result_text: str("result_text"),
      live_status_text: str("live_status_text"),
      winning_team: str("winning_team"),
      toss_info: str("toss_info"),
      match_note: str("match_note"),
    };
    scoreSchema.parse(payload);
    const { error } = await supabaseAdmin
      .from("sports_matches")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
    revalidatePath(`/sports/matches/${id}`);
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    }
    return {
      success: false,
      error: msg,
    };
  }
}

export async function createMatchUpdateAction(
  matchId: string,
  formData: FormData
) {
  try {
    const { user } = await getAuth();
    const bool = (k: string) =>
      formData.get(k) === "on" || formData.get(k) === "true";
    const str = (k: string) => formData.get(k)?.toString() || null;
    const payload = {
      update_type: str("update_type") || "commentary",
      title: str("title"),
      content: str("content") || "",
      over_ball: str("over_ball"),
      minute: formData.get("minute") ? Number(formData.get("minute")) : null,
      is_key_moment: bool("is_key_moment"),
    };
    const validated = updateSchema.parse(payload);
    const { error } = await supabaseAdmin
      .from("sports_match_updates")
      .insert({ ...validated, match_id: matchId, created_by: user.id });
    if (error) throw error;
    revalidatePath(`/sports/matches/${matchId}`);
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    }
    return {
      success: false,
      error: msg,
    };
  }
}

export async function deleteMatchUpdateAction(id: string, matchId: string) {
  try {
    await getAuth();
    const { error } = await supabaseAdmin
      .from("sports_match_updates")
      .delete()
      .eq("id", id);
    if (error) throw error;
    revalidatePath(`/sports/matches/${matchId}`);
    return { success: true };
  } catch (error: unknown) {
    let msg = error instanceof Error ? error.message : "An error occurred";
    if (error instanceof z.ZodError) {
      msg = error.issues?.[0]?.message || "Validation failed";
    }
    return {
      success: false,
      error: msg,
    };
  }
}
