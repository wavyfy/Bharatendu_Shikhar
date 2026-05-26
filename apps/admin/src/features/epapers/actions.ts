"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { createSupabaseServerClient } from "@repo/api";
import { revalidatePath } from "next/cache";

const epaperSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  pdf_url: z.string().url("Valid PDF URL is required"),
  thumbnail_url: z.string().url().nullable().optional(),
  region_id: z.coerce.number().nullable().optional(),
  published_at: z.string().nullable().optional(),
  expiry_date: z.string().nullable().optional(),
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

  // Determine role
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

export async function createEpaperAction(formData: FormData) {
  try {
    const { supabase, user } = await getAuth();

    const payload = {
      title: formData.get("title")?.toString() || "",
      pdf_url: formData.get("pdf_url")?.toString() || "",
      thumbnail_url: formData.get("thumbnail_url")?.toString() || null,
      region_id: formData.get("region_id") || null,
      published_at: formData.get("published_at") || null,
      expiry_date: formData.get("expiry_date") || null,
    };

    const validationResult = epaperSchema.safeParse(payload);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validated = validationResult.data;

    const { error } = await supabase
      .from("epapers")
      .insert({
        ...validated,
        author_id: user.id,
      } as never);

    if (error) {
      console.error("Insert error:", error);
      throw new Error(error.message);
    }

    revalidatePath("/epapers");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Action error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to create epaper" };
  }
}

export async function updateEpaperAction(id: number, formData: FormData) {
  try {
    const { supabase, user, role } = await getAuth();

    // Verify ownership if not admin
    if (role !== "admin") {
      const { data } = await supabase
        .from("epapers")
        .select("author_id")
        .eq("id", id)
        .single();
        
      if (!data || (data as { author_id: string }).author_id !== user.id) {
        throw new Error("You don't have permission to edit this epaper");
      }
    }

    const payload = {
      title: formData.get("title")?.toString() || "",
      pdf_url: formData.get("pdf_url")?.toString() || "",
      thumbnail_url: formData.get("thumbnail_url")?.toString() || null,
      region_id: formData.get("region_id") || null,
      published_at: formData.get("published_at") || null,
      expiry_date: formData.get("expiry_date") || null,
    };

    const validationResult = epaperSchema.safeParse(payload);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validated = validationResult.data;

    const { error } = await supabase
      .from("epapers")
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/epapers");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    console.error("Action error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to update epaper" };
  }
}

export async function deleteEpaperAction(id: number) {
  try {
    const { supabase, user, role } = await getAuth();

    // Verify ownership if not admin
    if (role !== "admin") {
      const { data } = await supabase
        .from("epapers")
        .select("author_id")
        .eq("id", id)
        .single();
        
      if (!data || (data as { author_id: string }).author_id !== user.id) {
        throw new Error("You don't have permission to delete this epaper");
      }
    }

    const { error } = await supabase
      .from("epapers")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/epapers");
    return { success: true };
  } catch (error: unknown) {
    console.error("Action error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to delete epaper" };
  }
}
