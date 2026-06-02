import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/api";
import { RegionFormPlaceholder } from "@/features/regions/components/RegionFormPlaceholder";
import { getRegionById } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Region | Bharatendu Shikhar",
};

interface EditRegionPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditRegionPage({ params }: EditRegionPageProps) {
  const resolvedParams = await params;
  const regionId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(regionId)) redirect("/regions");

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

  const region = await getRegionById(regionId);
  if (!region) redirect("/regions");

  return (
    <AnimatedPage className="space-y-6">

      <RegionFormPlaceholder initialData={region} />
    </AnimatedPage>
  );
}
