import { ArticleFormPlaceholder } from "@/features/articles/components/ArticleFormPlaceholder";
import { getCategories } from "@/features/categories/queries";
import { getRegions } from "@/features/regions/queries";

export const metadata = {
  title: "Create Article | Bharatendu Shikhar",
};

export default async function NewArticlePage() {
  const [{ categories }, { regions }] = await Promise.all([
    getCategories({ limit: 100 }),
    getRegions({ limit: 100 })
  ]);

  return (
    <div className="space-y-6">

      <ArticleFormPlaceholder categories={categories} regions={regions} />
    </div>
  );
}
