"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@repo/api";
import { revalidatePath } from "next/cache";

function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

const electionSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3, "Slug is required"),
  description: z.string().nullable().optional(),
  featured_image_url: z.string().url().nullable().optional().or(z.literal("")),
  region_id: z.coerce.number().nullable().optional(),
  status: z.enum(["upcoming", "live", "completed"]),
  is_published: z.boolean().default(false),
  display_order: z.coerce.number().default(0),
  voting_date: z.string().nullable().optional(),
  result_date: z.string().nullable().optional(),
});

const groupSchema = z.object({
  title: z.string().min(1, "Group title is required"),
  sort_order: z.coerce.number().default(0),
});

const candidateSchema = z.object({
  candidate_name: z.string().min(1, "Candidate name is required"),
  party_name: z.string().nullable().optional(),
  party_symbol_url: z.string().url().nullable().optional().or(z.literal("")),
  photo_url: z.string().url().nullable().optional().or(z.literal("")),
  votes: z.coerce.number().default(0),
  is_winner: z.boolean().default(false),
  sort_order: z.coerce.number().default(0),
});

const updateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  let role = "publisher";
  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((data as unknown as { role?: string })?.role === "admin") {
    role = "admin";
  }

  return { supabase, user, role };
}

// --- Elections ---

export async function createElectionAction(formData: FormData) {
  try {
    const { supabase, user } = await getAuth();
    
    const title = formData.get("title")?.toString() || "";
    let slug = formData.get("slug")?.toString() || "";
    if (!slug) {
      slug = generateSlug(title);
    }

    const payload = {
      title,
      slug,
      description: formData.get("description")?.toString() || null,
      featured_image_url: formData.get("featured_image_url")?.toString() || null,
      region_id: formData.get("region_id") || null,
      status: formData.get("status")?.toString() || "upcoming",
      is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
      display_order: formData.get("display_order") || 0,
      voting_date: formData.get("voting_date")?.toString() || null,
      result_date: formData.get("result_date")?.toString() || null,
    };

    const validated = electionSchema.parse(payload);

    const { data, error } = await supabase
      .from("elections")
      .insert({ ...validated, created_by: user.id })
      .select("id")
      .single();

    if (error) throw error;
    revalidatePath("/elections");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function updateElectionAction(id: string, formData: FormData) {
  try {
    const { supabase, user, role } = await getAuth();
    
    const { data: existing, error: fetchError } = await supabase
      .from("elections")
      .select("created_by")
      .eq("id", id)
      .single();
      
    if (fetchError || !existing) throw new Error("Election not found");
    if (role !== "admin" && existing.created_by !== user.id) {
      throw new Error("No permission");
    }

    const title = formData.get("title")?.toString() || "";
    let slug = formData.get("slug")?.toString() || "";
    if (!slug) {
      slug = generateSlug(title);
    }

    const payload = {
      title,
      slug,
      description: formData.get("description")?.toString() || null,
      featured_image_url: formData.get("featured_image_url")?.toString() || null,
      region_id: formData.get("region_id") || null,
      status: formData.get("status")?.toString() || "upcoming",
      is_published: formData.get("is_published") === "on" || formData.get("is_published") === "true",
      display_order: formData.get("display_order") || 0,
      voting_date: formData.get("voting_date")?.toString() || null,
      result_date: formData.get("result_date")?.toString() || null,
    };

    const validated = electionSchema.parse(payload);

    const { error } = await supabase
      .from("elections")
      .update({ ...validated })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/elections");
    revalidatePath(`/elections/${id}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function deleteElectionAction(id: string) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("elections").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const { error } = await supabase.from("elections").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/elections");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

// --- Groups ---

export async function createGroupAction(electionId: string, formData: FormData) {
  try {
    const { supabase, user } = await getAuth();
    const payload = {
      title: formData.get("title")?.toString() || "",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = groupSchema.parse(payload);

    const { error } = await supabase
      .from("election_groups")
      .insert({ ...validated, election_id: electionId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function updateGroupAction(id: string, electionId: string, formData: FormData) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("election_groups").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const payload = {
      title: formData.get("title")?.toString() || "",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = groupSchema.parse(payload);

    const { error } = await supabase.from("election_groups").update({ ...validated }).eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function deleteGroupAction(id: string, electionId: string) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("election_groups").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const { error } = await supabase.from("election_groups").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

// --- Candidates ---

export async function createCandidateAction(groupId: string, electionId: string, formData: FormData) {
  try {
    const { supabase, user } = await getAuth();
    const payload = {
      candidate_name: formData.get("candidate_name")?.toString() || "",
      party_name: formData.get("party_name")?.toString() || null,
      party_symbol_url: formData.get("party_symbol_url")?.toString() || null,
      photo_url: formData.get("photo_url")?.toString() || null,
      votes: formData.get("votes") || 0,
      is_winner: formData.get("is_winner") === "on" || formData.get("is_winner") === "true",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = candidateSchema.parse(payload);

    const { error } = await supabase
      .from("election_candidates")
      .insert({ ...validated, group_id: groupId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function updateCandidateAction(id: string, electionId: string, formData: FormData) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("election_candidates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const payload = {
      candidate_name: formData.get("candidate_name")?.toString() || "",
      party_name: formData.get("party_name")?.toString() || null,
      party_symbol_url: formData.get("party_symbol_url")?.toString() || null,
      photo_url: formData.get("photo_url")?.toString() || null,
      votes: formData.get("votes") || 0,
      is_winner: formData.get("is_winner") === "on" || formData.get("is_winner") === "true",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = candidateSchema.parse(payload);

    const { error } = await supabase.from("election_candidates").update({ ...validated }).eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function deleteCandidateAction(id: string, electionId: string) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("election_candidates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const { error } = await supabase.from("election_candidates").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

// --- Updates ---

export async function createUpdateAction(electionId: string, formData: FormData) {
  try {
    const { supabase, user } = await getAuth();
    const payload = {
      title: formData.get("title")?.toString() || "",
      content: formData.get("content")?.toString() || "",
    };
    const validated = updateSchema.parse(payload);

    const { error } = await supabase
      .from("election_updates")
      .insert({ ...validated, election_id: electionId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

export async function deleteUpdateAction(id: string, electionId: string) {
  try {
    const { supabase, user, role } = await getAuth();
    const { data: existing, error: fetchError } = await supabase.from("election_updates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    if (role !== "admin" && existing.created_by !== user.id) throw new Error("No permission");

    const { error } = await supabase.from("election_updates").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}
