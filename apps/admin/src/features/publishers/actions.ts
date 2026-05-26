"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin, createSupabaseServerClient } from "@repo/api";
import { publisherSchema } from "./types";
import { cookies } from "next/headers";

async function verifyAdmin() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
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

export async function createPublisherAction(formData: FormData) {
  try {
    await verifyAdmin();

    const rawData = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      is_active: formData.get("is_active") === "true",
    };

    const validationResult = publisherSchema.safeParse(rawData);
    
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }
    
    const validated = validationResult.data;

    if (!validated.password) {
      return { success: false, error: "Password is required for new publishers" };
    }

    // 1. Create the user in Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validated.email,
      password: validated.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      return { success: false, error: authError?.message || "Failed to create user" };
    }

    // 2. Insert the profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: authData.user.id,
        full_name: validated.full_name,
        role: "publisher",
        is_active: validated.is_active,
      } as never);

    if (profileError) {
      // Rollback Auth user if profile fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return { success: false, error: profileError.message };
    }

    revalidatePath("/publishers");
    return { success: true };
  } catch (error: unknown) {
    console.error("Create publisher error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}

export async function updatePublisherAction(id: string, formData: FormData) {
  try {
    await verifyAdmin();

    const rawData = {
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      is_active: formData.get("is_active") === "true",
    };

    const validationResult = publisherSchema.safeParse(rawData);

    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0]?.message || "Invalid form data" };
    }

    const validated = validationResult.data;

    // 1. Update Auth Email / Password
    const authUpdates: { email: string; password?: string } = { email: validated.email };
    if (validated.password) {
      authUpdates.password = validated.password;
    }

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdates);
    if (authError) {
      return { success: false, error: authError.message };
    }

    // 2. Update Profile
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: validated.full_name,
        is_active: validated.is_active,
      } as never)
      .eq("id", id);

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    revalidatePath("/publishers");
    return { success: true };
  } catch (error: unknown) {
    console.error("Update publisher error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}

export async function togglePublisherActiveAction(id: string, isActive: boolean) {
  try {
    await verifyAdmin();

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_active: isActive } as never)
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/publishers");
    return { success: true };
  } catch (error: unknown) {
    console.error("Toggle publisher active error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Something went wrong" };
  }
}

