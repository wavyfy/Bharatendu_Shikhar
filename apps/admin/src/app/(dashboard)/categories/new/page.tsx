import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@repo/api";
import { CategoryFormPlaceholder } from "@/features/categories/components/CategoryFormPlaceholder";

export const metadata = {
  title: "New Category | Bharatendu Shikhar",
};

export default async function NewCategoryPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 font-serif">Create Category</h1>
        <p className="text-neutral-500">Add a new category for articles.</p>
      </div>
      <CategoryFormPlaceholder />
    </div>
  );
}
