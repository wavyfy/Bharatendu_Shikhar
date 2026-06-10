import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/api";
import { BadgeFormPlaceholder } from "@/features/badges/components/BadgeFormPlaceholder";
import { getBadgeById } from "@/features/badges/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Badge | Bharatendu Shikhar",
};

interface EditBadgePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBadgePage({ params }: EditBadgePageProps) {
  const resolvedParams = await params;
  const badgeId = parseInt(resolvedParams.id, 10);

  if (isNaN(badgeId)) redirect("/badges");

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

  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  if (profile?.role !== "admin") redirect("/");

  const badge = await getBadgeById(badgeId);
  if (!badge) redirect("/badges");

  return (
    <AnimatedPage className="space-y-6">
      <BadgeFormPlaceholder initialData={badge} />
    </AnimatedPage>
  );
}
