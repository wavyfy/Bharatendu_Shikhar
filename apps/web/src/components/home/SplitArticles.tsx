import Image from "next/image";
import Link from "next/link";
import { ArticleWithAuthor } from "@/utils/mapArticleData";
import { ArticleMeta } from "../shared/ArticleMeta";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function SplitArticles({ articles }: { articles: ArticleWithAuthor[] }) {
  const leftArticle = articles[0];
  const rightArticle = articles[1];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-0">
      {leftArticle ? (
        <Link href={`/article/${leftArticle.slug}`} className="group/article lg:pr-8 flex flex-col h-full hover:translate-y-[-2px] transition-all duration-300">
          <article className="flex flex-col h-full">
            <div className="flex flex-row gap-5 items-start">
              <div className="flex-1 min-w-0 pr-0">
                <h3 className="font-medium text-[19px] leading-relaxed mb-2 line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
                  {leftArticle.title}
                </h3>
              </div>
              {leftArticle.featured_image && (
                <div className="w-[120px] sm:w-[140px] shrink-0 lg:hidden">
                  <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card">
                    <Image
                      src={getImageUrl(leftArticle.featured_image)!}
                      alt={leftArticle.title}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-2 lg:pt-4">
              <ArticleMeta article={leftArticle} />
            </div>
          </article>
        </Link>
      ) : (
        <article className="lg:pr-8 flex flex-col h-full">
          <h3 className="font-medium text-[19px] leading-relaxed mb-2 line-clamp-3">और खबरें जल्द आ रही हैं</h3>
        </article>
      )}
      
      {leftArticle && rightArticle && (
        <div className="lg:hidden h-[2px] w-full bg-gray-300 dark:bg-news-border my-6"></div>
      )}
      
      {rightArticle ? (
        <Link href={`/article/${rightArticle.slug}`} className="group/article lg:pl-8 lg:border-l-2 border-gray-300 dark:border-news-border flex flex-col h-full hover:translate-y-[-2px] transition-all duration-300">
          <article className="flex flex-col h-full">
            <div className="flex flex-row gap-5 items-start">
              <div className="flex-1 min-w-0 pr-0">
                <h3 className="font-medium text-[19px] leading-relaxed mb-2 line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
                  {rightArticle.title}
                </h3>
              </div>
              {rightArticle.featured_image && (
                <div className="w-[120px] sm:w-[140px] shrink-0 lg:hidden">
                  <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card">
                    <Image
                      src={getImageUrl(rightArticle.featured_image)!}
                      alt={rightArticle.title}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-auto pt-2 lg:pt-4">
              <ArticleMeta article={rightArticle} />
            </div>
          </article>
        </Link>
      ) : rightArticle === undefined ? null : (
        <article className="lg:pl-8 lg:border-l-2 border-gray-300 dark:border-news-border flex flex-col h-full">
          <h3 className="font-medium text-[19px] leading-relaxed mb-2 line-clamp-3">और खबरें जल्द आ रही हैं</h3>
        </article>
      )}
    </div>
  );
}
