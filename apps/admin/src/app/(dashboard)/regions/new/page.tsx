import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { RegionFormPlaceholder } from "@/features/regions/components/RegionFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "New Region | Bharatendu Shikhar",
};

async function NewRegionContent() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");

  return (
    <div className="animate-in fade-in duration-300">
      <RegionFormPlaceholder />
    </div>
  );
}

export default function NewRegionPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">New Region</h1>
        <p className="page-subtitle">Create a new geographic region for localized content.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <NewRegionContent />
      </Suspense>
    </AnimatedPage>
  );
}
