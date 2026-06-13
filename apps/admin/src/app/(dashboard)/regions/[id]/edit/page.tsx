import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
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

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");
  const user = session.user;
  const role = session.role;

  const region = await getRegionById(regionId);
  if (!region) redirect("/regions");

  return (
    <AnimatedPage className="space-y-6">

      <RegionFormPlaceholder initialData={region} />
    </AnimatedPage>
  );
}
