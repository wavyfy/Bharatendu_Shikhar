import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@repo/api";
import { getSettings } from "@/features/settings/queries";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Settings | Bharatendu Shikhar Admin" };

async function verifyAdminOrRedirect() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");
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

