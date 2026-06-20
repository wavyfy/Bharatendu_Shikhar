import { Suspense } from "react";
import { AdvertisementForm } from "@/features/advertisements/components/AdvertisementForm";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = { title: "Create Advertisement | Bharatendu Shikhar Admin" };

export default function CreateAdvertisementPage() {
  return (
    <AnimatedPage className="space-y-6 max-w-5xl mx-auto w-full">
      <div className="mb-2">
        <h1 className="page-title">Create Advertisement</h1>
        <p className="page-subtitle">Add a new advertisement campaign.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <div className="animate-in fade-in duration-300">
          <AdvertisementForm />
        </div>
      </Suspense>
    </AnimatedPage>
  );
}
