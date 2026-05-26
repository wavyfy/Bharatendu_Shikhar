"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  await supabase.auth.signOut();
  redirect("/login");
}
