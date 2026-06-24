import Image from "next/image";
import Link from "next/link";
import { ArticleWithAuthor } from "@/utils/mapArticleData";

import { ArticleMeta } from "../shared/ArticleMeta";

function getImageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function FeatureArticle({ article }: { article?: ArticleWithAuthor }) {
  if (!article) return null;

  return (
    <Link href={`/article/${article.slug}`} className="block group/article hover:translate-y-[-2px] transition-all duration-300 rounded-[2px] overflow-hidden">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`order-2 lg:order-1 flex flex-col h-full ${article.featured_image ? 'lg:col-span-6' : 'lg:col-span-12'}`}>
          <h2 className="text-[23px] lg:text-[35px] font-medium mb-4 line-clamp-4 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
            {article.title}
          </h2>
        <p className="text-gray-600 dark:text-news-text-secondary text-[15px] leading-relaxed mb-4 line-clamp-5">
          {article.excerpt || article.content.substring(0, 150) + "..."}
        </p>
        <div className="mt-auto">
          <ArticleMeta article={article} />
        </div>
      </div>
      {article.featured_image && (
        <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col h-full">
          <div className="relative w-full aspect-4/3 bg-gray-100 dark:bg-news-card mb-2">
            <Image
              src={getImageUrl(article.featured_image)}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      )}
      </article>
    </Link>
  );
}
