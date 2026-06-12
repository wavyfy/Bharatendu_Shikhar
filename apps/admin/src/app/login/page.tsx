import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In | Bharatendu Shikhar Admin",
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  const { supabaseAdmin } = await import("@repo/api");
  const { data: settings } = await supabaseAdmin.from("settings").select("site_logo_url").eq("id", 1).single();

  return <LoginForm logoUrl={settings?.site_logo_url} />;
}
