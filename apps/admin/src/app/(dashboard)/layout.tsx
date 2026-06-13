import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSessionUser } from "@/utils/session";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();

  if (!session) redirect("/login");

  const { supabaseAdmin } = await import("@repo/api");
  const { data: settings } = await supabaseAdmin.from("settings").select("site_logo_url").eq("id", 1).single();

  return (
    <DashboardShell role={session.role} displayName={session.displayName} logoUrl={settings?.site_logo_url}>
      {children}
    </DashboardShell>
  );
}
