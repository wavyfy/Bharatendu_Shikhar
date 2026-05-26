import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient, supabaseAdmin } from "@repo/api";
import { getSettings } from "@/features/settings/queries";
import { SettingsForm } from "@/features/settings/components/SettingsForm";

export const metadata = { title: "Settings | Bharatendu Shikhar Admin" };

async function verifyAdminOrRedirect() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#111]">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage global site settings. Each section saves independently.
        </p>
      </div>
      <SettingsForm settings={settings} />
    </div>
  );
}
