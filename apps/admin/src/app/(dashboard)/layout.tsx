import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { isValidRole, type UserRole } from "@/features/auth/utils/roles";
import { DashboardShell } from "@/components/layout/DashboardShell";

async function getSessionUser() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
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
  const role: UserRole = isValidRole(roleValue)
    ? roleValue
    : "publisher";
  const displayName = profile?.full_name ?? user.email ?? "User";

  return { user, role, displayName };
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) redirect("/login");

  return (
    <DashboardShell role={session.role} displayName={session.displayName}>
      {children}
    </DashboardShell>
  );
}
