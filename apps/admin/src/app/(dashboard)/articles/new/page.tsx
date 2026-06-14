import { Suspense } from "react";
import { ArticleFormPlaceholder } from "@/features/articles/components/ArticleFormPlaceholder";
import { getCategories } from "@/features/categories/queries";
import { getRegions } from "@/features/regions/queries";
import { getBadges } from "@/features/badges/queries";
import { AnimatedPage } from "@/components/ui/AnimatedPage";
import { ArticleEditorSkeleton } from "@/components/skeletons/ArticleEditorSkeleton";

export const metadata = {
  title: "Create Article | Bharatendu Shikhar",
};

async function NewArticleContent() {
  const [{ categories }, { regions }, { badges }] = await Promise.all([
    getCategories({ limit: 100 }),
    getRegions({ limit: 100 }),
    getBadges({ limit: 100 }),
  ]);

  return (
    <div className="animate-in fade-in duration-300 w-full">
      <ArticleFormPlaceholder categories={categories} regions={regions} badges={badges} />
    </div>
  );
}

export default function NewArticlePage() {
  return (
    <AnimatedPage className="space-y-6">
      <div className="mb-2">
        <h1 className="page-title">Create Article</h1>
        <p className="page-subtitle">Author a new article and publish it to the platform.</p>
      </div>

      <Suspense fallback={<ArticleEditorSkeleton />}>
        <NewArticleContent />
      </Suspense>
    </AnimatedPage>
  );
}
