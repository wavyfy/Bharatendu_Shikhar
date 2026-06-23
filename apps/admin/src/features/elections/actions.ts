"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { revalidatePath } from "next/cache";
import { generateSlug } from "@/features/articles/utils/slug";

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

/**
 * Creates a new election record.
 *
 * @param formData - Contains election fields: `title`, optional `slug` (auto-generated if omitted), `description`, `featured_image_url`, `region_id`, `status`, `is_published`, `display_order`, `voting_date`, and `result_date`.
 * @returns An object with `success: true` and the new election's `id` in `data` on success, or `success: false` with an error message. Returns a specific message if an election with a similar title or slug already exists.
 */

export async function createElectionAction(formData: FormData) {
  try {
    const { user } = await getAuth();
    
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

    const { data, error } = await supabaseAdmin
      .from("elections")
      .insert({ ...validated, created_by: user.id })
      .select("id")
      .single();

    if (error) throw error;
    revalidatePath("/elections");
    return { success: true, data };
  } catch (error: unknown) {
    let message = error instanceof Error ? error.message : "An error occurred";
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505') message = "An election with a similar title/slug already exists.";
    return { success: false, error: message };
  }
}

/**
 * Updates an existing election with the provided details.
 *
 * @param id - The election ID
 * @param formData - Form data containing election fields to update
 * @returns An object with `success: true` on successful update, or `success: false` with an error message on failure
 */
export async function updateElectionAction(id: string, formData: FormData) {
  try {
    await getAuth();
    
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from("elections")
      .select("created_by")
      .eq("id", id)
      .single();
      
    if (fetchError || !existing) throw new Error("Election not found");
    

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

    const { error } = await supabaseAdmin
      .from("elections")
      .update({ ...validated })
      .eq("id", id);

    if (error) throw error;
    revalidatePath("/elections");
    revalidatePath(`/elections/${id}`);
    return { success: true };
  } catch (error: unknown) {
    let message = error instanceof Error ? error.message : "An error occurred";
    if (typeof error === 'object' && error !== null && 'code' in error && (error as { code: string }).code === '23505') message = "An election with a similar title/slug already exists.";
    return { success: false, error: message };
  }
}

/**
 * Sets the publish status of an election.
 *
 * @param id - The ID of the election to update
 * @param is_published - The new publish status
 * @returns An object with `success: true` on success, or `success: false` with an error message if the election was not found or the update failed
 */
export async function toggleElectionPublishAction(id: string, is_published: boolean) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("elections").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const { error } = await supabaseAdmin.from("elections").update({ is_published }).eq("id", id);
    if (error) throw error;
    revalidatePath("/elections");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Deletes an election record.
 *
 * @param id - The ID of the election to delete
 * @returns `{ success: true }` on successful deletion, or `{ success: false, error }` if the election is not found or deletion fails
 */
export async function deleteElectionAction(id: string) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("elections").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const { error } = await supabaseAdmin.from("elections").delete().eq("id", id);
    if (error) throw error;
    revalidatePath("/elections");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Creates a new election group.
 *
 * @param electionId - The election to add the group to
 * @param formData - Form data containing the group title and sort order
 * @returns An object with `success: true` on success, or `success: false` with an `error` message on failure
 */

export async function createGroupAction(electionId: string, formData: FormData) {
  try {
    const { user } = await getAuth();
    const payload = {
      title: formData.get("title")?.toString() || "",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = groupSchema.parse(payload);

    const { error } = await supabaseAdmin
      .from("election_groups")
      .insert({ ...validated, election_id: electionId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Updates the title and sort order of an election group.
 *
 * @param id - The ID of the group to update
 * @param electionId - The ID of the parent election
 * @param formData - Form data containing `title` and `sort_order`
 * @returns `{ success: true }` if the group was updated, or `{ success: false, error }` with an error message if it failed
 */
export async function updateGroupAction(id: string, electionId: string, formData: FormData) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("election_groups").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const payload = {
      title: formData.get("title")?.toString() || "",
      sort_order: formData.get("sort_order") || 0,
    };
    const validated = groupSchema.parse(payload);

    const { error } = await supabaseAdmin.from("election_groups").update({ ...validated }).eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Deletes an election group.
 *
 * @param id - The ID of the group to delete
 * @param electionId - The ID of the parent election for cache revalidation
 * @returns An object with `success: true` on successful deletion, or `{ success: false, error: string }` if the operation fails or the group is not found
 */
export async function deleteGroupAction(id: string, electionId: string) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("election_groups").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const { error } = await supabaseAdmin.from("election_groups").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Creates a new candidate record for an election group.
 *
 * @returns An object with `success: true` on successful creation, or `success: false` with an `error` message on failure.
 */

export async function createCandidateAction(groupId: string, electionId: string, formData: FormData) {
  try {
    const { user } = await getAuth();
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

    const { error } = await supabaseAdmin
      .from("election_candidates")
      .insert({ ...validated, group_id: groupId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Updates a candidate record.
 *
 * @returns `{ success: true }` on successful update; `{ success: false, error }` on failure
 */
export async function updateCandidateAction(id: string, electionId: string, formData: FormData) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("election_candidates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

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

    const { error } = await supabaseAdmin.from("election_candidates").update({ ...validated }).eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Deletes a candidate from an election.
 *
 * @returns An object with `success: true` on successful deletion, or `success: false` with an error message if the operation fails.
 */
export async function deleteCandidateAction(id: string, electionId: string) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("election_candidates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const { error } = await supabaseAdmin.from("election_candidates").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Creates a new election update with the provided title and content.
 *
 * @param electionId - The ID of the election to associate the update with
 * @param formData - Form data containing `title` and `content` fields for the update
 * @returns An object with `success: true` on successful creation, or `success: false` with an error message on failure
 */

export async function createUpdateAction(electionId: string, formData: FormData) {
  try {
    const { user } = await getAuth();
    const payload = {
      title: formData.get("title")?.toString() || "",
      content: formData.get("content")?.toString() || "",
    };
    const validated = updateSchema.parse(payload);

    const { error } = await supabaseAdmin
      .from("election_updates")
      .insert({ ...validated, election_id: electionId, created_by: user.id });

    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}

/**
 * Deletes an election update.
 *
 * @returns An object with `success: true` if the update is deleted successfully, or `success: false` with an error message if the deletion fails.
 */
export async function deleteUpdateAction(id: string, electionId: string) {
  try {
    await getAuth();
    const { data: existing, error: fetchError } = await supabaseAdmin.from("election_updates").select("created_by").eq("id", id).single();
    if (fetchError || !existing) throw new Error("Not found");
    

    const { error } = await supabaseAdmin.from("election_updates").delete().eq("id", id);
    if (error) throw error;
    revalidatePath(`/elections/${electionId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "An error occurred" };
  }
}
