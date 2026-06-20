import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Advertisement } from "@/components/shared/Advertisement";
import { ArticleMeta } from "@/components/shared/ArticleMeta";
import { Ticker } from "@/components/home/Ticker";
import { LiveTimeline } from "@/components/article/LiveTimeline";
import { fetchArticleBySlug, fetchTickerArticles, fetchRelatedArticles } from "@/utils/fetchData";
import { DoubleRowRelatedSlider } from "@/components/article/DoubleRowRelatedSlider";
import type { SliderItem } from "@/components/home/HorizontalArticleSlider";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";
import { RelatedArticlesList } from "@/components/shared/RelatedArticlesList";
import { RelativeTime } from "@/components/shared/RelativeTime";
import type { Metadata, ResolvingMetadata } from "next";

import { TickerSkeleton } from "@/components/skeletons/HomeSkeletons";
import { ArticleSkeleton, RelatedArticlesSkeleton } from "@/components/skeletons/ArticleSkeletons";

export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const ogImages = article.featured_image ? [article.featured_image, ...previousImages] : previousImages;

  return {
    title: article.title,
    description: article.excerpt || `Read ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.excerpt || `Read ${article.title}`,
      type: "article",
      publishedTime: article.published_at || article.created_at || undefined,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || `Read ${article.title}`,
      images: ogImages,
    },
  };
}

async function TickerSection() {
  const topArticles = await fetchTickerArticles();
  return <Ticker articles={topArticles} />;
}

async function ArticleContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  const article = await fetchArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { categoryArticles, regionArticles } = await fetchRelatedArticles(
    article.categories?.id,
    article.regions?.id,
    article.id
  );

  let relatedArticles = categoryArticles.slice(0, 5);
  if (relatedArticles.length === 0) {
    relatedArticles = regionArticles.slice(0, 5);
  }

  const tags = [];
  if (article.categories?.name) tags.push(article.categories.name);
  if (article.regions?.name) tags.push(article.regions.name);

  return (
    <article className="flex-1 min-w-0 flex flex-col animate-in fade-in duration-300">
      <div className="flex flex-col lg:grid lg:grid-cols-13 gap-0 md:gap-6">
        <div className="lg:col-span-9 flex flex-col min-w-0">
          {/* Category / Region Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500 font-medium mb-3">
              {tags.map((tag, i) => (
                <span key={tag} className="flex items-center gap-3">
                  {tag}
                  {i < tags.length - 1 && <span className="text-gray-400 dark:text-gray-500 text-sm">&bull;</span>}
                </span>
              ))}
            </div>
          )}
          {/* Article Title */}
          <h1 className="text-2xl md:text-4xl font-playfair font-bold text-black dark:text-white mb-3">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="mb-4">
            <ArticleMeta article={article as unknown as ArticleWithAuthor} isArticlePage={true} alignRight={true} />
          </div>

          {/* Featured Image */}
          {article.featured_image && (
            <div className="w-full mb-5 flex flex-col">
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
            <div className="pl-4 border-l-4 border-red-500">
              <p className="text-lg italic md:text-[18px] leading-relaxed text-gray-700 dark:text-gray-400 font-medium">
                {article.excerpt}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div
            className="w-full text-left prose prose-lg md:prose-[21px] max-w-none dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-[1.8] prose-a:text-red-600 dark:prose-a:text-news-accent hover:prose-a:text-red-700 prose-img:rounded-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="w-full flex justify-end mt-4">
            <RelativeTime 
              dateString={article.published_at || article.created_at || ""} 
              className="text-sm font-medium text-gray-500 dark:text-gray-400"
            />
          </div>

          {/* Live Timeline (Only for LIVE articles) */}
          {article.is_live && article.article_live_updates && article.article_live_updates.length > 0 && (
            <div className="mt-8 border-t-2 border-gray-300 dark:border-gray-800 pt-8">
              <LiveTimeline updates={article.article_live_updates} />
            </div>
          )}
        </div>

        {/* Related News Sidebar */}
        {relatedArticles.length > 0 && (
          <div className="lg:col-span-4 lg:pl-5 border-t-2 lg:border-t-0 lg:border-l-2 border-gray-300 dark:border-news-border mt-4 pt-4 lg:mt-0 lg:pt-0">
            <div className="sticky top-4 overflow-y-auto max-h-[calc(100vh-2rem)] pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
              <RelatedArticlesList articles={relatedArticles as unknown as ArticleWithAuthor[]} />
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

async function RelatedSection({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  const article = await fetchArticleBySlug(slug);

  if (!article) return null;

  const { categoryArticles, regionArticles } = await fetchRelatedArticles(
    article.categories?.id,
    article.regions?.id,
    article.id
  );

  const categorySliderItems: SliderItem[] = categoryArticles.map((art) => ({
    id: art.id.toString(),
    label: article.categories?.name || "Related Topic",
    slug: article.categories?.slug || "",
    article: art,
  }));

  const regionSliderItems: SliderItem[] = regionArticles.map((art) => ({
    id: art.id.toString(),
    label: article.regions?.name || "Related Region",
    slug: article.regions?.slug || "",
    article: art,
  }));

  if (categorySliderItems.length === 0 && regionSliderItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 pb-4 w-full animate-in fade-in duration-300">
      <DoubleRowRelatedSlider
        topTitle={article.categories?.name || "Topic"}
        topItems={categorySliderItems}
        bottomTitle={article.regions?.name || "Region"}
        bottomItems={regionSliderItems}
      />
    </div>
  );
}


export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="bg-news-bg text-news-text font-sans">
      <Suspense fallback={<TickerSkeleton />}>
        <TickerSection />
      </Suspense>
      <main className="max-w-[1700px] mx-auto px-4 flex justify-between gap-4 mb-2 items-start mt-4 w-full">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement slotId="fixed:vertical_left" orientation="vertical" />
        </div>

        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleContent paramsPromise={params} />
        </Suspense>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement slotId="fixed:vertical_right" orientation="vertical" />
        </div>
      </main>

      {/* Related Article Sliders Section */}
      <Suspense fallback={<RelatedArticlesSkeleton />}>
        <RelatedSection paramsPromise={params} />
      </Suspense>
    </div>
  );
}
