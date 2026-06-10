import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { getArticleById } from "@/features/articles/queries";
import { ArticleFormPlaceholder } from "@/features/articles/components/ArticleFormPlaceholder";
import { getCategories } from "@/features/categories/queries";
import { getRegions } from "@/features/regions/queries";
import { getBadges } from "@/features/badges/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = {
  title: "Edit Article | Bharatendu Shikhar",
};

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = await params;
  const articleId = parseInt(resolvedParams.id, 10);

  if (isNaN(articleId)) {
    redirect("/articles");
  }

  // Get user role to enforce permissions
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let role = "publisher";
  const { supabaseAdmin } = await import("@repo/api");
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((data as { role?: string } | null)?.role === "admin") {
    role = "admin";
  }

  const authorId = role === "admin" ? null : user.id;

  const [article, { categories }, { regions }, { badges }] = await Promise.all([
    getArticleById(articleId, authorId),
    getCategories({ limit: 100 }),
    getRegions({ limit: 100 }),
    getBadges({ limit: 100 }),
  ]);

  if (!article) {
    redirect("/articles");
  }

  return (
    <AnimatedPage className="space-y-6">
      <ArticleFormPlaceholder
        initialData={article}
        categories={categories}
        regions={regions}
        badges={badges}
      />
    </AnimatedPage>
  );
}
