import { notFound } from "next/navigation";
import Image from "next/image";

import { Advertisement } from "@/components/shared/Advertisement";
import { ArticleMeta } from "@/components/shared/ArticleMeta";
import { Ticker } from "@/components/home/Ticker";
import { LiveTimeline } from "@/components/article/LiveTimeline";
import { fetchArticleBySlug, fetchHomepageData } from "@/utils/fetchData";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

export const revalidate = 60;

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { topArticles } = await fetchHomepageData();

  return (
    <div className="bg-news-bg text-news-text font-sans">
      <Ticker articles={topArticles} />

      <main className="max-w-[1400px] mx-auto px-4 flex justify-between gap-6 mb-20 items-start mt-8 w-full">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>

        <article className="flex-1 min-w-0 max-w-[900px] mx-auto flex flex-col">
          {/* Article Title */}
          <h1 className="text-3xl md:text-5xl leading-[1.15] font-playfair font-bold tracking-tight text-black dark:text-white mb-6">
            {article.title}
          </h1>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="w-full mb-3 flex flex-col">
              <div className="relative w-full aspect-16/10 md:aspect-2/1 bg-gray-100 dark:bg-gray-800">
                <Image
                  src={article.featured_image}
                  alt={article.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

            {/* Article Excerpt / Lead Paragraph */}
          {article.excerpt && (
            <p className="text-lg md:text-[22px] leading-relaxed text-gray-800 dark:text-gray-300 font-medium mb-1">
              {article.excerpt}
            </p>
          )}

          {/* Article Meta (Date, Read Time, Source, Badge) */}
          <div className="w-full flex justify-end mb-8 mt-2">
            <ArticleMeta article={article as unknown as ArticleWithAuthor} />
          </div>

          {/* Article Content */}
          <div
            className="w-full text-left prose prose-lg md:prose-[21px] max-w-none dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-[1.8] prose-a:text-red-600 dark:prose-a:text-news-accent hover:prose-a:text-red-700 prose-img:rounded-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Live Timeline (Only for LIVE articles) */}
          {article.is_live && article.article_live_updates && article.article_live_updates.length > 0 && (
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
              <LiveTimeline updates={article.article_live_updates} />
            </div>
          )}
        </article>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>
      </main>
    </div>
  );
}
