"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { createRegionSchema, updateRegionSchema, type CreateRegionInput, type UpdateRegionInput } from "../schemas";
import { generateSlug } from "@/features/articles/utils/slug";
import { getRegionById } from "../queries";

async function getAdminAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
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

export async function createRegionAction(input: CreateRegionInput) {
  try {
    const { supabase } = await getAdminAuth();
    const validationResult = createRegionSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;
    const slug = generateSlug(validatedData.name);

    const { data, error } = await supabase
      .from("regions")
      .insert({
        name: validatedData.name,
        slug,
      } as never)
      .select("id")
      .single();

    if (error) throw error;

    revalidatePath("/regions");
    return { success: true, regionId: (data as { id: number })?.id };
  } catch (error: unknown) {
    console.error("Create region error:", error);
    const message = error instanceof Error ? error.message : "Failed to create region";
    return { success: false, error: message };
  }
}

export async function updateRegionAction(id: number, input: UpdateRegionInput) {
  try {
    const { supabase } = await getAdminAuth();
    const validationResult = updateRegionSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;
    const existing = await getRegionById(id);
    if (!existing) throw new Error("Region not found");

    let slug = existing.slug;
    if (validatedData.name && validatedData.name !== existing.name) {
      slug = generateSlug(validatedData.name);
    }

    const updates: Record<string, unknown> = {
      ...validatedData,
      slug,
    };

    const { error } = await supabase
      .from("regions")
      .update(updates as never)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/regions");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update region error:", error);
    const message = error instanceof Error ? error.message : "Failed to update region";
    return { success: false, error: message };
  }
}

export async function deleteRegionAction(id: number) {
  try {
    const { supabase } = await getAdminAuth();
    const existing = await getRegionById(id);
    if (!existing) throw new Error("Region not found");

    const { error } = await supabase
      .from("regions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/regions");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete region error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete region";
    return { success: false, error: message };
  }
}
