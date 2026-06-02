import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/api";
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

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const profile = data as { role: unknown } | null;
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const category = await getCategoryById(categoryId);
  if (!category) redirect("/categories");

  return (
    <AnimatedPage className="space-y-6">

      <CategoryFormPlaceholder initialData={category} />
    </AnimatedPage>
  );
}
