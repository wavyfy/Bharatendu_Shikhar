import Image from "next/image";
import Link from "next/link";
import { ArticleWithAuthor } from "@/utils/mapArticleData";
import { ArticleMeta } from "../shared/ArticleMeta";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export function SecondaryFeatureArticle({ article }: { article?: ArticleWithAuthor }) {
  if (!article) return null;
  return (
    <Link href={`/article/${article.slug}`} className="block group/article hover:translate-y-[-2px] transition-all duration-300 rounded-[2px] overflow-hidden">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={`order-2 lg:order-1 flex flex-col h-full ${article.featured_image ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <h3 className="font-medium text-[29px] leading-relaxed mb-4 pr-4 line-clamp-4 group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors">
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="text-gray-600 dark:text-gray-400 text-[17px] leading-relaxed mb-6 pr-4 line-clamp-3">
              {article.excerpt}
            </p>
          )}
        <div className="mt-auto">
          <ArticleMeta article={article} />
        </div>
      </div>
      {article.featured_image && (
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col h-full justify-stretch">
          <div className="relative w-full aspect-video lg:aspect-auto lg:h-full bg-gray-100 dark:bg-news-card rounded-[2px] overflow-hidden">
            <Image
              src={getImageUrl(article.featured_image)!}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              className="object-cover transition-transform duration-500 "
            />
          </div>
        </div>
      )}
      </article>
    </Link>
  );
}
