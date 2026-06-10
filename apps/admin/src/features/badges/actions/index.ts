"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import {
  createBadgeSchema,
  updateBadgeSchema,
  type CreateBadgeInput,
  type UpdateBadgeInput,
} from "../schemas";
import { generateSlug } from "@/features/articles/utils/slug";
import { getBadgeById } from "../queries";

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

  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  if (profile?.role !== "admin") {
    throw new Error("Access denied. Admins only.");
  }

  return { supabase, user };
}

export async function createBadgeAction(input: CreateBadgeInput) {
  try {
    const { supabase } = await getAdminAuth();
    const result = createBadgeSchema.safeParse(input);
    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message ?? "Invalid form data",
      };
    }
    const { name, color } = result.data;
    const slug = generateSlug(name);

    const { data, error } = await supabase
      .from("badges")
      .insert({ name, slug, color } as never)
      .select("id")
      .single();

    if (error) throw error;

    revalidatePath("/badges");
    return { success: true, badgeId: (data as { id: number })?.id };
  } catch (err: unknown) {
    console.error("Create badge error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create badge",
    };
  }
}

export async function updateBadgeAction(id: number, input: UpdateBadgeInput) {
  try {
    const { supabase } = await getAdminAuth();
    const result = updateBadgeSchema.safeParse(input);
    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message ?? "Invalid form data",
      };
    }
    const validated = result.data;
    const existing = await getBadgeById(id);
    if (!existing) throw new Error("Badge not found");

    let slug = existing.slug;
    if (validated.name && validated.name !== existing.name) {
      slug = generateSlug(validated.name);
    }

    const updates: Record<string, unknown> = { ...validated, slug };

    const { error } = await supabase
      .from("badges")
      .update(updates as never)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/badges");
    return { success: true };
  } catch (err: unknown) {
    console.error("Update badge error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update badge",
    };
  }
}

export async function deleteBadgeAction(id: number) {
  try {
    const { supabase } = await getAdminAuth();
    const existing = await getBadgeById(id);
    if (!existing) throw new Error("Badge not found");

    const { error } = await supabase.from("badges").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/badges");
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete badge error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete badge",
    };
  }
}
