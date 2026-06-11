import Image from "next/image";
import { ArticleWithAuthor } from "@/utils/mapArticleData";
import { ArticleMeta } from "../shared/ArticleMeta";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function LiveUpdatesSection({ article }: { article?: ArticleWithAuthor }) {
  if (!article) return null;
  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className={`order-2 lg:order-1 flex flex-col h-full ${article.featured_image ? "lg:col-span-7" : "lg:col-span-12"}`}>
        <h3 className="font-playfair font-bold text-[29px] leading-tight mb-4 pr-4 line-clamp-4">
          {article.title}
        </h3>
        <div className="mt-auto">
          <ArticleMeta article={article} />
        </div>
      </div>
      {article.featured_image && (
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col h-full justify-center">
          <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card">
            <Image
              src={getImageUrl(article.featured_image)!}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover"
            />
          </div>
        </div>
      )}
    </article>
  );
}
