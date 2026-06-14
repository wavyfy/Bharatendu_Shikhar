import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { BadgeFormPlaceholder } from "@/features/badges/components/BadgeFormPlaceholder";
import { getBadgeById } from "@/features/badges/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "Edit Badge | Bharatendu Shikhar",
};

interface EditBadgePageProps {
  params: Promise<{ id: string }>;
}

async function EditBadgeContent({ paramsPromise }: { paramsPromise: EditBadgePageProps["params"] }) {
  const resolvedParams = await paramsPromise;
  const badgeId = parseInt(resolvedParams.id, 10);

  if (isNaN(badgeId)) redirect("/badges");

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");

  const badge = await getBadgeById(badgeId);
  if (!badge) redirect("/badges");

  return (
    <div className="animate-in fade-in duration-300">
      <BadgeFormPlaceholder initialData={badge} />
    </div>
  );
}

export default function EditBadgePage({ params }: EditBadgePageProps) {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">Edit Badge</h1>
        <p className="page-subtitle">Update badge style and details.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditBadgeContent paramsPromise={params} />
      </Suspense>
    </AnimatedPage>
  );
}
