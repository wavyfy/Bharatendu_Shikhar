import { getSessionUser } from "@/utils/session";
import { redirect } from "next/navigation";
import { CategoryFormPlaceholder } from "@/features/categories/components/CategoryFormPlaceholder";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "New Category | Bharatendu Shikhar",
};

export default async function NewCategoryPage() {
  const session = await getSessionUser();
  if (!session || session.role !== "admin") redirect("/dashboard");
  const user = session.user;
  const role = session.role;

  return <CategoryFormPlaceholder />;
}
