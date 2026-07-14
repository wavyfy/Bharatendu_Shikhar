"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { revalidatePath } from "next/cache";
import { deleteFileAction } from "@/features/storage/actions";

const teamSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  short_name: z.string().max(10).nullable().optional(),
  sport: z.enum(["cricket", "football"]).nullable().optional(),
  country: z.string().max(100).nullable().optional(),
  logo_url: z.string().url().nullable().optional().or(z.literal("")),
});

async function getAdminAuth() {
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

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (data as unknown as { role?: string })?.role;
  if (role !== "admin") throw new Error("Admin only");
  return { user };
}

export async function createTeamAction(formData: FormData) {
  try {
    await getAdminAuth();
    const payload = {
      name: formData.get("name")?.toString() || "",
      short_name: formData.get("short_name")?.toString() || null,
      sport: (formData.get("sport")?.toString() || null) as
        | "cricket"
        | "football"
        | null,
      country: formData.get("country")?.toString() || null,
      logo_url: formData.get("logo_url")?.toString() || null,
    };
    const validated = teamSchema.parse(payload);
    const { data, error } = await supabaseAdmin
      .from("sports_teams")
      .insert(validated)
      .select("id")
      .single();
    if (error) throw error;
    revalidatePath("/sports/teams");
    return { success: true, data };
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

export async function updateTeamAction(id: string, formData: FormData) {
  try {
    await getAdminAuth();
    const payload = {
      name: formData.get("name")?.toString() || "",
      short_name: formData.get("short_name")?.toString() || null,
      sport: (formData.get("sport")?.toString() || null) as
        | "cricket"
        | "football"
        | null,
      country: formData.get("country")?.toString() || null,
      logo_url: formData.get("logo_url")?.toString() || null,
    };
    const validated = teamSchema.parse(payload);
    const { error } = await supabaseAdmin
      .from("sports_teams")
      .update(validated)
      .eq("id", id);
    if (error) throw error;
    revalidatePath("/sports/teams");
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

export async function deleteTeamAction(id: string) {
  try {
    await getAdminAuth();
    
    // Fetch existing for cleanup
    const { data: existing } = await supabaseAdmin
      .from("sports_teams")
      .select("logo_url")
      .eq("id", id)
      .single();
      
    const { error } = await supabaseAdmin
      .from("sports_teams")
      .delete()
      .eq("id", id);
    if (error) throw error;
    
    // Cleanup file
    if (existing?.logo_url) {
      await deleteFileAction(existing.logo_url as string, "articles").catch(console.error);
    }
    
    revalidatePath("/sports/teams");
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
