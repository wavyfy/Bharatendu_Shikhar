import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { EpaperForm } from "@/features/epapers/components/EpaperForm";
import { getEpaperById } from "@/features/epapers/queries";
import { getRegions } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "Edit E-Paper | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEpaperPage({ params }: PageProps) {
  const { id } = await params;
  const epaperId = parseInt(id, 10);

  if (isNaN(epaperId)) {
    notFound();
  }

  // Check roles for permission
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  let role = "publisher";
  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((data as unknown as { role?: string })?.role === "admin") {
    role = "admin";
  }

  const authorId = role === "admin" ? null : user.id;

  const [epaper, regionsData] = await Promise.all([
    getEpaperById(epaperId, authorId),
    getRegions()
  ]);

  if (!epaper) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      <EpaperForm initialData={epaper} regions={regionsData.regions} />
    </div>
  );
}
