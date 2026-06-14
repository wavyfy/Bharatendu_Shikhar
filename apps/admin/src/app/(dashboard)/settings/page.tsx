import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { getSettings } from "@/features/settings/queries";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = { title: "Settings | Bharatendu Shikhar Admin" };

async function verifyAdminOrRedirect() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");
}

async function SettingsContent() {
  await verifyAdminOrRedirect();
  const settings = await getSettings();

  return (
    <div className="animate-in fade-in duration-300">
      <SettingsForm settings={settings} />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage global site configuration. Each section saves independently.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <SettingsContent />
      </Suspense>
    </AnimatedPage>
  );
}
