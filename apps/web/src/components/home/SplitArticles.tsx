import Link from "next/link";
import { ArticleWithAuthor} from "@/utils/mapArticleData";

import { ArticleMeta } from "../shared/ArticleMeta";

export function SplitArticles({ articles }: { articles: ArticleWithAuthor[] }) {
  const leftArticle = articles[0];
  const rightArticle = articles[1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0">
      {leftArticle ? (
        <Link href={`/article/${leftArticle.slug}`} className="group/article lg:pr-8 flex flex-col h-full border-b lg:border-b-0 border-gray-300 dark:border-news-border pb-6 lg:pb-0 hover:opacity-90 transition-opacity">
          <article className="flex flex-col h-full">
            <h3 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
              {leftArticle.title}
            </h3>
            <div className="mt-auto pt-4">
              <ArticleMeta article={leftArticle} />
            </div>
          </article>
        </Link>
      ) : (
        <article className="lg:pr-8 flex flex-col h-full border-b lg:border-b-0 border-gray-300 dark:border-news-border pb-6 lg:pb-0">
          <h3 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3">More News Coming Soon</h3>
        </article>
      )}
      
      {rightArticle ? (
        <Link href={`/article/${rightArticle.slug}`} className="group/article lg:pl-8 lg:border-l-2 border-gray-300 dark:border-news-border flex flex-col h-full pt-2 lg:pt-0 hover:opacity-90 transition-opacity">
          <article className="flex flex-col h-full">
            <h3 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
              {rightArticle.title}
            </h3>
            <div className="mt-auto pt-4">
              <ArticleMeta article={rightArticle} />
            </div>
          </article>
        </Link>
      ) : (
        <article className="lg:pl-8 lg:border-l-2 border-gray-300 dark:border-news-border flex flex-col h-full pt-2 lg:pt-0">
          <h3 className="font-playfair font-bold text-[19px] leading-tight mb-2 line-clamp-3">More News Coming Soon</h3>
        </article>
      )}
    </div>
  );
}
