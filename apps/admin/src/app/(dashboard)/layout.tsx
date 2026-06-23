import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { getSessionUser } from "@/utils/session";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, settings] = await Promise.all([
    getSessionUser(),
    import("@repo/api").then(({ supabaseAdmin }) =>
      supabaseAdmin.from("settings").select("site_logo_url, site_logo_dark_url").eq("id", 1).single().then(res => res.data)
    )
  ]);

  if (!session) redirect("/login");

  return (
    <DashboardShell role={session.role} displayName={session.displayName} logoUrl={settings?.site_logo_url} darkLogoUrl={settings?.site_logo_dark_url}>
      {children}
    </DashboardShell>
  );
}
