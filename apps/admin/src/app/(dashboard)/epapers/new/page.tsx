import { Suspense } from "react";
import { EpaperForm } from "@/features/epapers/components/EpaperForm";
import { getRegions } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = { title: "Upload E-Paper | Bharatendu Shikhar Admin" };

async function NewEpaperContent() {
  const { regions } = await getRegions();

  return (
    <div className="animate-in fade-in duration-300">
      <EpaperForm regions={regions} />
    </div>
  );
}

export default function NewEpaperPage() {
  return (
    <AnimatedPage className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">Upload E-Paper</h1>
        <p className="page-subtitle">Upload a new PDF edition and set its details.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <NewEpaperContent />
      </Suspense>
    </AnimatedPage>
  );
}
