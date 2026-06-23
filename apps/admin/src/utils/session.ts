import { cache } from "react";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { isValidRole, type UserRole } from "@/features/auth/utils/roles";

/**
 * Centrally cached session fetcher to eliminate duplicate queries across layouts and pages.
 * Wrapped in React.cache() so multiple components calling it within the same Server Component
 * render pass will only hit the database once.
 */
export const getSessionUser = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => {
      try {
        cookieStore.set(name, value, options);
      } catch (error) {
        // Ignored in Server Components
      }
    },
    remove: (name, options) => {
      try {
        cookieStore.delete({ name, ...options });
      } catch (error) {
        // Ignored in Server Components
      }
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Use admin client to bypass RLS for profile fetch
  const { supabaseAdmin } = await import("@repo/api");
  type ProfileRow = { role: unknown; full_name: string | null } | null;
  const { data: rawProfile } = await supabaseAdmin
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
    
  const profile = rawProfile as ProfileRow;

  const roleValue = profile?.role;
  const role: UserRole = isValidRole(roleValue) ? roleValue : "publisher";
  const displayName = profile?.full_name ?? user.email ?? "User";

  return { user, role, displayName };
});
