import { Suspense } from "react";
import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { CategoryFormPlaceholder } from "@/features/categories/components/CategoryFormPlaceholder";
import { getCategoryById } from "@/features/categories/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { FormSkeleton } from "@/components/skeletons/FormSkeleton";

export const metadata = {
  title: "Edit Category | Bharatendu Shikhar",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

async function EditCategoryContent({ paramsPromise }: { paramsPromise: EditCategoryPageProps["params"] }) {
  const resolvedParams = await paramsPromise;
  const categoryId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(categoryId)) redirect("/categories");

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");

  const category = await getCategoryById(categoryId);
  if (!category) redirect("/categories");

  return (
    <div className="animate-in fade-in duration-300">
      <CategoryFormPlaceholder initialData={category} />
    </div>
  );
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">Edit Category</h1>
        <p className="page-subtitle">Update category details and configuration.</p>
      </div>

      <Suspense fallback={<FormSkeleton />}>
        <EditCategoryContent paramsPromise={params} />
      </Suspense>
    </AnimatedPage>
  );
}
