import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { getSettings } from "@/features/settings/queries";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Settings | Bharatendu Shikhar Admin" };

async function verifyAdminOrRedirect() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || (profile as { role: string }).role !== "admin") {
    redirect("/");
  }
}

export default async function SettingsPage() {
  await verifyAdminOrRedirect();
  const settings = await getSettings();

  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage global site configuration. Each section saves independently.</p>
      </div>

      <SettingsForm settings={settings} />
    </AnimatedPage>
  );
}

