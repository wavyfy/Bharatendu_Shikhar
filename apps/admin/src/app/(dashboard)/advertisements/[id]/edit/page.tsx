import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AdvertisementForm } from "@/features/advertisements/components/AdvertisementForm";
import { getAdvertisementById } from "@/features/advertisements/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = { title: "Edit Advertisement | Bharatendu Shikhar Admin" };

interface PageProps {
  params: Promise<{ id: string }>;
}

async function EditAdvertisementContent({ id }: { id: string }) {
  const { advertisement } = await getAdvertisementById(id);

  if (!advertisement) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-300">
      <AdvertisementForm initialData={advertisement} />
    </div>
  );
}

export default async function EditAdvertisementPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <AnimatedPage className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">Edit Advertisement</h1>
        <p className="page-subtitle">Update advertisement details and schedule.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditAdvertisementContent id={id} />
      </Suspense>
    </AnimatedPage>
  );
}
