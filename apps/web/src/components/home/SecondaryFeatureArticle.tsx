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
    <Link href={`/article/${article.slug}`} className="block group/article transition-all duration-300 rounded-xs overflow-hidden">
      <article className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {article.featured_image && (
        <div className="order-1 lg:order-1 lg:col-span-5 flex flex-col h-full">
          <div className="relative w-full aspect-16/11 bg-gray-100 dark:bg-news-card mb-2 rounded-xs overflow-hidden">
            <Image
              src={getImageUrl(article.featured_image)!}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover object-top transition-transform duration-500 ease-out"
            />
          </div>
        </div>
      )}
        <div className={`order-2 lg:order-2 flex flex-col h-full ${article.featured_image ? "lg:col-span-7" : "lg:col-span-12"}`}>
          <h3 className="font-medium text-[29px] leading-normal mb-4 line-clamp-4 max-h-[5.75em] overflow-hidden group-hover/article:text-red-600 dark:group-hover/article:text-news-accent transition-colors duration-300">
            {article.title}
          </h3>
          <p className="text-gray-600 dark:text-news-text-secondary text-[17px] leading-relaxed mb-4 line-clamp-3 max-h-[4.8em] overflow-hidden">
            {article.excerpt || article.content.replace(/<[^>]+>/g, '').substring(0, 200) + "..."}
          </p>
          <div className="mt-auto">
            <ArticleMeta article={article} />
          </div>
        </div>
      </article>
    </Link>
  );
}
