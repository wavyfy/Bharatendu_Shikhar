"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { createArticleSchema, updateArticleSchema, type CreateArticleInput, type UpdateArticleInput } from "../schemas";
import { generateSlug } from "../utils/slug";
import { getArticleById } from "../queries";
import { deleteFileAction } from "../../storage/actions";

// Helper to get authenticated user and client
async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch role bypassing RLS using admin client to be safe (or rely on user query if RLS is fine)
  // For mutations, we should verify the role.
  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  const role = profile?.role === "admin" ? "admin" : "publisher";
  return { supabase, user, role };
}

export async function createArticleAction(input: CreateArticleInput, badgeIds: number[] = []) {
  try {
    const { supabase, user } = await getAuth();
    
    // Validate
    const validationResult = createArticleSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;
    
    // Generate slug
    const slug = generateSlug(validatedData.title);

    const { data, error } = await supabase
      .from("articles")
      .insert({
        ...validatedData,
        slug,
        author_id: user.id,
        published_at: validatedData.status === "published" ? new Date().toISOString() : null,
      } as never)
      .select("id")
      .single();

    if (error) throw error;
    const inserted = data as { id: number } | null;

    // Sync badges
    if (inserted?.id && badgeIds.length > 0) {
      const { error: badgeError } = await supabase
        .from("article_badges")
        .insert(
          badgeIds.map((badge_id) => ({ article_id: inserted.id, badge_id })) as never
        );
      if (badgeError) console.error("Badge sync error:", badgeError.message);
    }

    revalidatePath("/articles");
    return { success: true, articleId: inserted?.id };
  } catch (error: unknown) {
    console.error("Create article error:", error);
    const message = error instanceof Error ? error.message : "Failed to create article";
    return { success: false, error: message };
  }
}

export async function updateArticleAction(id: number, input: UpdateArticleInput, badgeIds?: number[]) {
  try {
    const { supabase, user, role } = await getAuth();
    
    // Validate
    const validationResult = updateArticleSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    const validatedData = validationResult.data;

    // Permission check
    const existing = await getArticleById(id, role === "admin" ? null : user.id);
    if (!existing) throw new Error("Article not found or access denied");

    // Re-generate slug if title changed
    let slug = existing.slug;
    if (validatedData.title && validatedData.title !== existing.title) {
      slug = generateSlug(validatedData.title);
    }

    const updates: Record<string, unknown> = {
      ...validatedData,
      slug,
      updated_at: new Date().toISOString(),
    };

    if (validatedData.status === "published" && existing.status !== "published") {
      updates.published_at = new Date().toISOString();
    } else if (validatedData.status === "draft") {
      updates.published_at = null;
    }

    // Cleanup old image if changed
    if (
      validatedData.featured_image && 
      existing.featured_image && 
      validatedData.featured_image !== existing.featured_image
    ) {
      await deleteFileAction(existing.featured_image, "articles").catch(console.error);
    }

    const { error } = await supabase
      .from("articles")
      .update(updates as never)
      .eq("id", id);

    if (error) throw error;

    // Sync badges if provided
    if (badgeIds !== undefined) {
      await supabase.from("article_badges").delete().eq("article_id", id);
      if (badgeIds.length > 0) {
        const { error: badgeError } = await supabase
          .from("article_badges")
          .insert(
            badgeIds.map((badge_id) => ({ article_id: id, badge_id })) as never
          );
        if (badgeError) console.error("Badge sync error:", badgeError.message);
      }
    }

    revalidatePath("/articles");
    revalidatePath(`/articles/${id}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Update article error:", error);
    const message = error instanceof Error ? error.message : "Failed to update article";
    return { success: false, error: message };
  }
}

export async function deleteArticleAction(id: number) {
  try {
    const { supabase, user, role } = await getAuth();

    // Permission check
    const existing = await getArticleById(id, role === "admin" ? null : user.id);
    if (!existing) throw new Error("Article not found or access denied");

    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Cleanup image
    if (existing.featured_image) {
      await deleteFileAction(existing.featured_image, "articles").catch(console.error);
    }

    revalidatePath("/articles");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete article error:", error);
    const message = error instanceof Error ? error.message : "Failed to delete article";
    return { success: false, error: message };
  }
}

export async function publishArticleAction(id: number, status: "draft" | "published") {
  return updateArticleAction(id, { status });
}
