import Image from "next/image";
import { ArticleWithAuthor } from "@/utils/mapArticleData";
import { ArticleMeta } from "./ArticleMeta";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function RelatedArticlesList({ articles }: { articles: ArticleWithAuthor[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <div className="flex flex-col">
      <h2 className="font-playfair font-bold text-[19px] text-black dark:text-news-text mb-6 text-center border-b-2 border-gray-300 dark:border-news-border pb-2">Related News</h2>
      <div className="flex flex-row lg:flex-col gap-6 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {articles.map((article, index) => (
        <div key={article.id} className="min-w-[85vw] lg:min-w-0 snap-center lg:snap-none">
          <article className="flex gap-4 items-start">
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3">
                {article.title}
              </h4>
              <ArticleMeta article={article} />
            </div>
            {article.featured_image && (
              <div className="w-[120px] shrink-0">
                <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card">
                  <Image
                    src={getImageUrl(article.featured_image)!}
                    alt={article.title}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </article>
          {index < articles.length - 1 && (
            <div className="hidden lg:block h-px w-full bg-gray-300 dark:bg-news-border my-4"></div>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
