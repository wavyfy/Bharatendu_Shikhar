import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { CategoryFormPlaceholder } from "@/features/categories/components/CategoryFormPlaceholder";
import { getCategoryById } from "@/features/categories/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Category | Bharatendu Shikhar",
};

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(categoryId)) redirect("/categories");

  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");
  const user = session.user;
  const role = session.role;

  const category = await getCategoryById(categoryId);
  if (!category) redirect("/categories");

  return (
    <AnimatedPage className="space-y-6">

      <CategoryFormPlaceholder initialData={category} />
    </AnimatedPage>
  );
}
