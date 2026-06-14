import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PublisherForm } from "@/features/publishers/components/PublisherForm";
import { getPublisherById } from "@/features/publishers/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "Edit Publisher | Admin",
};

interface Props {
  params: Promise<{ id: string }>;
}

async function EditPublisherContent({ paramsPromise }: { paramsPromise: Props["params"] }) {
  const { id } = await paramsPromise;
  const publisher = await getPublisherById(id);

  if (!publisher) {
    notFound();
  }

  return (
    <div className="animate-in fade-in duration-300">
      <PublisherForm initialData={publisher} />
    </div>
  );
}

export default function EditPublisherPage({ params }: Props) {
  return (
    <AnimatedPage className="space-y-6 max-w-2xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">Edit Publisher</h1>
        <p className="page-subtitle">Update publisher information and status.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditPublisherContent paramsPromise={params} />
      </Suspense>
    </AnimatedPage>
  );
}
