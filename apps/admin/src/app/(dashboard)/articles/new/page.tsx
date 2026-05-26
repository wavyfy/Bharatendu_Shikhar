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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 font-serif">Create Article</h1>
          <p className="text-neutral-500">Draft a new article for publication.</p>
        </div>
      </div>

      <ArticleFormPlaceholder categories={categories} regions={regions} />
    </div>
  );
}
