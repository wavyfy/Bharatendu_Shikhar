import { notFound } from "next/navigation";
import { getSessionUser } from "@/utils/session";
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

  const session = await getSessionUser();
  const user = session?.user;
  const role = session?.role || "publisher";
  if (!user) notFound();

  const authorId = role === "admin" ? null : user.id;

  const [epaper, regionsData] = await Promise.all([
    getEpaperById(epaperId, authorId),
    getRegions()
  ]);

  if (!epaper) {
    notFound();
  }

  return (
    <AnimatedPage className="space-y-6 max-w-5xl mx-auto">
      <EpaperForm initialData={epaper} regions={regionsData.regions} />
    </AnimatedPage>
  );
}
