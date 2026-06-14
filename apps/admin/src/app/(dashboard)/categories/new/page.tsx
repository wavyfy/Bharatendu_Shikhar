import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { CategoryFormPlaceholder } from "@/features/categories/components/CategoryFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "New Category | Bharatendu Shikhar",
};

async function NewCategoryContent() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");

  return (
    <div className="animate-in fade-in duration-300">
      <CategoryFormPlaceholder />
    </div>
  );
}

export default function NewCategoryPage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">New Category</h1>
        <p className="page-subtitle">Create a new category for organizing articles.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <NewCategoryContent />
      </Suspense>
    </AnimatedPage>
  );
}
