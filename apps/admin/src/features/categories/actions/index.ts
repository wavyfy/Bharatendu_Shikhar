"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { createCategorySchema, updateCategorySchema, type CreateCategoryInput, type UpdateCategoryInput } from "../schemas";
import { generateSlug } from "@/features/articles/utils/slug";
import { getCategoryById } from "../queries";

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

export async function createCategoryAction(input: CreateCategoryInput) {
  try {
    const { supabase } = await getAdminAuth();
    const validationResult = createCategorySchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;
    const slug = generateSlug(validatedData.name);

    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: validatedData.name,
        slug,
      } as never)
      .select("id")
      .single();

    if (error) throw error;

    revalidatePath("/categories");
    return { success: true, categoryId: (data as { id: number })?.id };
  } catch (error: unknown) {
    console.error("Create category error:", error);
    const message = error instanceof Error ? error.message : "Failed to create category";
    return { success: false, error: message };
  }
}

export async function updateCategoryAction(id: number, input: UpdateCategoryInput) {
  try {
    const { supabase } = await getAdminAuth();
    const validationResult = updateCategorySchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;
    const existing = await getCategoryById(id);
    if (!existing) throw new Error("Category not found");

    let slug = existing.slug;
    if (validatedData.name && validatedData.name !== existing.name) {
      slug = generateSlug(validatedData.name);
    }

    const updates: Record<string, unknown> = {
      ...validatedData,
      slug,
    };

    const { error } = await supabase
      .from("categories")
      .update(updates as never)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/categories");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update category error:", error);
    const message = error instanceof Error ? error.message : "Failed to update category";
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(id: number) {
  try {
    const { supabase } = await getAdminAuth();
    const existing = await getCategoryById(id);
    if (!existing) throw new Error("Category not found");

    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/categories");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete category error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, error: message };
  }
}

export async function toggleCategoryActiveAction(id: number, is_active: boolean) {
  try {
    const { supabase } = await getAdminAuth();
    
    const { error } = await supabase
      .from("categories")
      .update({ is_active } as never)
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/categories");
    return { success: true };
  } catch (error: unknown) {
    console.error("Toggle category status error:", error);
    const message = error instanceof Error ? error.message : "Failed to update category status";
    return { success: false, error: message };
  }
}
