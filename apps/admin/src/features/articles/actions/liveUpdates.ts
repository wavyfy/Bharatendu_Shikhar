"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import {
  createLiveUpdateSchema,
  updateLiveUpdateSchema,
  type CreateLiveUpdateInput,
  type UpdateLiveUpdateInput,
} from "../schemas/liveUpdate";
import { getArticleById } from "../queries";

// Helper: get authenticated user + role
async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  const role = profile?.role === "admin" ? "admin" : "publisher";
  return { supabase, user, role };
}

/**
 * Verify the caller has access to the parent article.
 * Returns the article or throws.
 */
async function verifyArticleAccess(articleId: number, userId: string, role: string) {
  const authorId = role === "admin" ? null : userId;
  const article = await getArticleById(articleId, authorId);
  if (!article) throw new Error("Article not found or access denied");
  if (!article.is_live) throw new Error("Article is not a live article");
  return article;
}

export async function createLiveUpdateAction(
  articleId: number,
  input: CreateLiveUpdateInput
) {
  try {
    const { user, role } = await getAuth();

    await verifyArticleAccess(articleId, user.id, role);

    const validation = createLiveUpdateSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Invalid input" };
    }

    const { error } = await supabaseAdmin
      .from("article_live_updates")
      .insert({
        article_id: articleId,
        headline: validation.data.headline,
        content: validation.data.content,
        created_by: user.id,
      } as never);

    if (error) throw error;

    revalidatePath("/articles");
    revalidatePath(`/articles/${articleId}/edit`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Create live update error:", JSON.stringify(err));
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Failed to create live update";
    return { success: false, error: message };
  }
}

export async function updateLiveUpdateAction(
  updateId: number,
  input: UpdateLiveUpdateInput,
  articleId: number
) {
  try {
    const { user, role } = await getAuth();

    await verifyArticleAccess(articleId, user.id, role);

    const validation = updateLiveUpdateSchema.safeParse(input);
    if (!validation.success) {
      return { success: false, error: validation.error.issues[0]?.message || "Invalid input" };
    }

    const { error } = await supabaseAdmin
      .from("article_live_updates")
      .update({
        ...validation.data,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("id", updateId)
      .eq("article_id", articleId); // double-check ownership at DB level

    if (error) throw error;

    revalidatePath("/articles");
    revalidatePath(`/articles/${articleId}/edit`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Update live update error:", JSON.stringify(err));
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Failed to update live update";
    return { success: false, error: message };
  }
}

export async function deleteLiveUpdateAction(updateId: number, articleId: number) {
  try {
    const { user, role } = await getAuth();

    await verifyArticleAccess(articleId, user.id, role);

    const { error } = await supabaseAdmin
      .from("article_live_updates")
      .delete()
      .eq("id", updateId)
      .eq("article_id", articleId);

    if (error) throw error;

    revalidatePath("/articles");
    revalidatePath(`/articles/${articleId}/edit`);
    return { success: true };
  } catch (err: unknown) {
    console.error("Delete live update error:", JSON.stringify(err));
    const message =
      err instanceof Error
        ? err.message
        : (err as { message?: string })?.message ?? "Failed to delete live update";
    return { success: false, error: message };
  }
}
