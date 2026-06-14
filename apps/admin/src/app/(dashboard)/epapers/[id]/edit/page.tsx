import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getSessionUser } from "@/utils/session";
import { EpaperForm } from "@/features/epapers/components/EpaperForm";
import { getEpaperById } from "@/features/epapers/queries";
import { getRegions } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = { title: "Edit E-Paper | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditEpaperContent({ paramsPromise }: { paramsPromise: PageProps["params"] }) {
  const { id } = await paramsPromise;
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
    <div className="animate-in fade-in duration-300">
      <EpaperForm initialData={epaper} regions={regionsData.regions} />
    </div>
  );
}

export default function EditEpaperPage({ params }: PageProps) {
  return (
    <AnimatedPage className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">Edit E-Paper</h1>
        <p className="page-subtitle">Update E-Paper details and visibility.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditEpaperContent paramsPromise={params} />
      </Suspense>
    </AnimatedPage>
  );
}
