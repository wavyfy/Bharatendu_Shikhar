"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { revalidatePath } from "next/cache";
import { deleteFileAction } from "@/features/storage/actions";

const competitionSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3),
  sport: z.enum(["cricket", "football"]),
  competition_type: z.enum(["tournament", "series", "league", "cup"]),
  season: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  status: z.enum(["upcoming", "live", "completed"]),
  is_published: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
  banner_url: z.string().url().nullable().optional().or(z.literal("")),
  logo_url: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().nullable().optional(),
  region_id: z.coerce.number().nullable().optional(),
});

const pointsRowSchema = z.object({
  id: z.string().uuid().optional(),
  group_name: z.string().nullable().optional(),
  team_id: z.string().uuid().nullable().optional().or(z.literal("")),
  team_name: z.string().min(1, "Team name is required"),
  team_logo_url: z.string().url().nullable().optional().or(z.literal("")),
  played: z.coerce.number().default(0),
  won: z.coerce.number().default(0),
  drawn: z.coerce.number().default(0),
  lost: z.coerce.number().default(0),
  goals_for: z.coerce.number().default(0),
  goals_against: z.coerce.number().default(0),
  runs_for: z.coerce.number().default(0),
  runs_against: z.coerce.number().default(0),
  net_run_rate: z.coerce.number().nullable().optional().or(z.literal("")),
  points: z.coerce.number().default(0),
  sort_order: z.coerce.number().default(0),
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
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function parseCompetitionFormData(formData: FormData) {
  const title = formData.get("title")?.toString() || "";
  return {
    title,
    slug: slugify(title),
    sport: formData.get("sport")?.toString() || "cricket",
    competition_type: formData.get("competition_type")?.toString() || "tournament",
    season: formData.get("season")?.toString() || null,
    start_date: formData.get("start_date")?.toString() || null,
    end_date: formData.get("end_date")?.toString() || null,
    status: formData.get("status")?.toString() || "upcoming",
    is_published:
      formData.get("is_published") === "on" ||
      formData.get("is_published") === "true",
    display_order: formData.get("display_order") || 0,
    banner_url: formData.get("banner_url")?.toString() || null,
    logo_url: formData.get("logo_url")?.toString() || null,
    description: formData.get("description")?.toString() || null,
    region_id: formData.get("region_id") || null,
  };
}

export async function createCompetitionAction(formData: FormData) {
  try {
    const { user } = await getAuth();
    const validated = competitionSchema.parse(parseCompetitionFormData(formData));
    const { data, error } = await supabaseAdmin
      .from("sports_competitions")
      .insert({ ...validated, created_by: user.id })
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/sports/competitions");
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
      msg = "A competition with this slug already exists.";
    }
    return { success: false, error: msg };
  }
}

export async function updateCompetitionAction(id: string, formData: FormData) {
  try {
    await getAuth();
    const validated = competitionSchema.parse(parseCompetitionFormData(formData));
    const { error } = await supabaseAdmin
      .from("sports_competitions")
      .update(validated)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/competitions");
    revalidatePath(`/sports/competitions/${id}`);
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
      msg = "A competition with this slug already exists.";
    }
    return { success: false, error: msg };
  }
}

export async function toggleCompetitionPublishAction(
  id: string,
  is_published: boolean
) {
  try {
    await getAuth();
    const { error } = await supabaseAdmin
      .from("sports_competitions")
      .update({ is_published })
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/competitions");
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

export async function deleteCompetitionAction(id: string) {
  try {
    await getAuth();
    
    // Fetch existing for cleanup
    const { data: existing } = await supabaseAdmin
      .from("sports_competitions")
      .select("logo_url, banner_url")
      .eq("id", id)
      .single();
      
    const { error } = await supabaseAdmin
      .from("sports_competitions")
      .delete()
      .eq("id", id);
    if (error) throw error;
    
    // Cleanup files
    if (existing?.logo_url) {
      await deleteFileAction(existing.logo_url as string, "articles").catch(console.error);
    }
    if (existing?.banner_url) {
      await deleteFileAction(existing.banner_url as string, "articles").catch(console.error);
    }
    
    revalidatePath("/sports/competitions");
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

// --- Points Table ---

export async function upsertPointsRowAction(
  competitionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowData: any
) {
  try {
    await getAuth();
    const validated = pointsRowSchema.parse(rowData);
    const payload = {
      ...validated,
      net_run_rate: validated.net_run_rate === "" ? null : validated.net_run_rate,
      competition_id: competitionId,
      group_name: validated.group_name || null,
      team_id: validated.team_id || null,
    };
    
    if (payload.id) {
      const { error } = await supabaseAdmin
        .from("sports_points_table_entries")
        .update(payload)
        .eq("id", payload.id);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin
        .from("sports_points_table_entries")
        .insert(payload);
      if (error) throw error;
    }
    revalidatePath(`/sports/competitions/${competitionId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("upsertPointsRowAction error:", error);
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

export async function deletePointsRowAction(
  rowId: string,
  competitionId: string
) {
  try {
    await getAuth();
    const { error } = await supabaseAdmin
      .from("sports_points_table_entries")
      .delete()
      .eq("id", rowId);
    if (error) throw error;
    revalidatePath(`/sports/competitions/${competitionId}`);
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
