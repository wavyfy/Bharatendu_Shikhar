import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata = {
  title: "Sign In | Bharatendu Shikhar Admin",
};

/**
 * Renders the login page with site branding, or redirects authenticated users to the home page.
 */
export default async function LoginPage() {
  const [cookieStore, settings] = await Promise.all([
    cookies(),
    import("@repo/api").then(({ supabaseAdmin }) =>
      supabaseAdmin.from("settings").select("site_logo_url").eq("id", 1).single().then(res => res.data)
    )
  ]);

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

  return <LoginForm logoUrl={settings?.site_logo_url} />;
}
