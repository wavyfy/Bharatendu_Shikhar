import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/api";
import { RegionFormPlaceholder } from "@/features/regions/components/RegionFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "New Region | Bharatendu Shikhar",
};

export default async function NewRegionPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return <RegionFormPlaceholder />;
}
