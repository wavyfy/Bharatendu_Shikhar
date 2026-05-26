"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { isValidRole } from "../utils/roles";

export type LoginState = {
  error?: string;
} | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Use admin client to bypass RLS - safe in server action
  // User-scoped client may not have JWT propagated yet in same request
  const { supabaseAdmin } = await import("@repo/api");
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("role, is_active")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Account not found. Contact your administrator." };
  }

  if ((profile as { is_active: boolean }).is_active === false) {
    await supabase.auth.signOut();
    return { error: "Your account has been deactivated." };
  }

  if (!isValidRole((profile as { role: unknown }).role)) {
    await supabase.auth.signOut();
    return { error: "Access denied. Insufficient permissions." };
  }

  redirect("/");
}
