import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { BadgeFormPlaceholder } from "@/features/badges/components/BadgeFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "New Badge | Bharatendu Shikhar",
};

async function NewBadgeContent() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/");

  return (
    <div className="animate-in fade-in duration-300">
      <BadgeFormPlaceholder />
    </div>
  );
}

export default function NewBadgePage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">New Badge</h1>
        <p className="page-subtitle">Create a new badge for highlighting articles.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <NewBadgeContent />
      </Suspense>
    </AnimatedPage>
  );
}
