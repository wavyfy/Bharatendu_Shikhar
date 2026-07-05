import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { RegionFormPlaceholder } from "@/features/regions/components/RegionFormPlaceholder";
import { getRegionById, getRegions } from "@/features/regions/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "Edit Region | Bharatendu Shikhar",
};

interface EditRegionPageProps {
  params: Promise<{ id: string }>;
}

async function EditRegionContent({ paramsPromise }: { paramsPromise: EditRegionPageProps["params"] }) {
  const resolvedParams = await paramsPromise;
  const regionId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(regionId)) redirect("/regions");

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const region = await getRegionById(regionId);
  if (!region) redirect("/regions");

  const { regions } = await getRegions({ limit: 100, status: "active" });
  const parentRegions = regions.filter(r => r.id !== regionId);

  return (
    <div className="animate-in fade-in duration-300">
      <RegionFormPlaceholder initialData={region} parentRegions={parentRegions} />
    </div>
  );
}

export default function EditRegionPage({ params }: EditRegionPageProps) {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">Edit Region</h1>
        <p className="page-subtitle">Update region details and targeting information.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditRegionContent paramsPromise={params} />
      </Suspense>
    </AnimatedPage>
  );
}
