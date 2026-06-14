import Image from "next/image";
import Link from "next/link";
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
      <div className="flex flex-row lg:flex-col gap-4 lg:gap-0 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {articles.map((article, index) => (
        <div key={article.id} className="min-w-[85vw] lg:min-w-0 snap-center lg:snap-none relative h-full">
          <Link href={`/article/${article.slug}`} className="block group/article hover:translate-y-[-2px] transition-all duration-300 h-full">
            <article className="flex flex-col h-full justify-between">
              <div className="flex flex-row gap-5 items-start">
                <div className="flex-1 min-w-0 pr-0">
                  <h4 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
                    {article.title}
                  </h4>
                </div>
                {article.featured_image && (
                  <div className="w-[90px] sm:w-[110px] shrink-0">
                    <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card">
                      <Image
                        src={getImageUrl(article.featured_image)!}
                        alt={article.title}
                        fill
                        sizes="90px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3">
                <ArticleMeta article={article} />
              </div>
            </article>
          </Link>
          {index < articles.length - 1 && (
            <>
              <div className="hidden lg:block h-[2px] w-full bg-gray-300 dark:bg-news-border my-4"></div>
              <div className="block lg:hidden absolute -right-2 top-0 bottom-0 w-[2px] bg-gray-300 dark:bg-news-border"></div>
            </>
          )}
        </div>
      ))}
      </div>
    </div>
  );
}
