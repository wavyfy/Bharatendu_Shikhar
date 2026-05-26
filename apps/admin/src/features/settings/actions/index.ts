"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import {
  siteInfoSchema,
  seoSchema,
  socialSchema,
  contactSchema,
  notificationsSchema,
  homepageSchema,
  maintenanceSchema,
  type SiteInfoInput,
  type SeoInput,
  type SocialInput,
  type ContactInput,
  type NotificationsInput,
  type HomepageInput,
  type MaintenanceInput,
} from "../schemas";

// ─── Auth Guard ─────────────────────────────────────────────────────────────

async function verifyAdmin() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== "admin") {
    throw new Error("Admin access required");
  }
}

// ─── Shared upsert helper ────────────────────────────────────────────────────

async function upsertSettings(patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from("settings")
    .upsert({ id: 1, ...patch, updated_at: new Date().toISOString() } as never);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function updateSiteInfoAction(input: SiteInfoInput) {
  try {
    await verifyAdmin();
    const result = siteInfoSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateSeoAction(input: SeoInput) {
  try {
    await verifyAdmin();
    const result = seoSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateSocialAction(input: SocialInput) {
  try {
    await verifyAdmin();
    const result = socialSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateContactAction(input: ContactInput) {
  try {
    await verifyAdmin();
    const result = contactSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateNotificationsAction(input: NotificationsInput) {
  try {
    await verifyAdmin();
    const result = notificationsSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateHomepageAction(input: HomepageInput) {
  try {
    await verifyAdmin();
    const result = homepageSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}

export async function updateMaintenanceAction(input: MaintenanceInput) {
  try {
    await verifyAdmin();
    const result = maintenanceSchema.safeParse(input);
    if (!result.success) {
      return { success: false, error: result.error.issues[0]?.message || "Invalid data" };
    }
    await upsertSettings(result.data);
    return { success: true };
  } catch (e: unknown) {
    return { success: false, error: e instanceof Error ? e.message : "Failed to save" };
  }
}
