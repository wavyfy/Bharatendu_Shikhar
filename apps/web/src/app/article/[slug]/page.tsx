import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";

import { Advertisement } from "@/components/shared/Advertisement";
import { ArticleMeta } from "@/components/shared/ArticleMeta";
import { Ticker } from "@/components/home/Ticker";
import { LiveTimeline } from "@/components/article/LiveTimeline";
import { fetchArticleBySlug, fetchTickerArticles, fetchRelatedArticles, fetchSettings } from "@/utils/fetchData";
import { DoubleRowRelatedSlider } from "@/components/article/DoubleRowRelatedSlider";
import type { SliderItem } from "@/components/home/HorizontalArticleSlider";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";
import { RelatedArticlesList } from "@/components/shared/RelatedArticlesList";
import { RelativeTime } from "@/components/shared/RelativeTime";
import type { Metadata, ResolvingMetadata } from "next";
import { sanitize } from "@repo/api";
import { getSiteUrl, getAbsoluteImageUrl } from "@/utils/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

import { TickerSkeleton } from "@/components/skeletons/HomeSkeletons";
import { ArticleSkeleton, RelatedArticlesSkeleton } from "@/components/skeletons/ArticleSkeletons";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticleBySlug(slug);
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const rawImage = article.featured_image || settings?.og_image_url;
  const absoluteImageUrl = getAbsoluteImageUrl(rawImage);
  const ogImages = absoluteImageUrl
    ? [{ url: absoluteImageUrl, alt: article.title || "भारतेन्दु शिखर" }]
    : previousImages;
  const publishedAt = article.published_at || article.created_at || new Date().toISOString();
  const updatedAt = article.updated_at || publishedAt;
  
  const articleWithProfiles = article as (typeof article & { profiles?: { full_name?: string } | null });
  const authorName = articleWithProfiles?.profiles?.full_name || "भारतेन्दु शिखर";
  const title = article.title || settings?.meta_title || "भारतेन्दु शिखर";
  const fallbackDescription = `भारतेन्दु शिखर पर पढ़ें ${article.title} से जुड़ी सभी ताज़ा ख़बरें और अपडेट।`;
  const description = article.excerpt || settings?.meta_description || fallbackDescription;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/article/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/article/${article.slug}`,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [authorName],
      images: ogImages,
      locale: "hi_IN",
      siteName: "भारतेन्दु शिखर",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}

async function JsonLdSchema({ article }: { article: ArticleWithAuthor & { categories?: { name?: string } | null; slug: string } }) {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  const publishedAt = article.published_at || article.created_at || new Date().toISOString();
  const updatedAt = article.updated_at || publishedAt;

  const title = article.title || settings?.meta_title || "भारतेन्दु शिखर";
  const description = article.excerpt || settings?.meta_description || title;
  const rawImage = article.featured_image || settings?.og_image_url;
  const imageUrl = getAbsoluteImageUrl(rawImage);
  const logoUrl = getAbsoluteImageUrl(settings?.site_logo_url, `${siteUrl}/logo.png`);

  const socialSameAs = [
    settings?.facebook_url,
    settings?.twitter_url,
    settings?.instagram_url,
    settings?.youtube_url,
    settings?.linkedin_url,
  ].filter((url): url is string => Boolean(url));

  const publisherSchema = {
    "@type": "NewsMediaOrganization",
    "name": "भारतेन्दु शिखर",
    "alternateName": "Bhartendu Shikhar",
    "url": siteUrl,
    "logo": {
      "@type": "ImageObject",
      "url": logoUrl,
    },
    ...(socialSameAs.length > 0 ? { "sameAs": socialSameAs } : {}),
    ...(settings?.contact_email || settings?.contact_phone ? {
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": settings?.contact_phone || undefined,
        "email": settings?.contact_email || undefined,
        "contactType": "customer service",
      }
    } : {})
  };

  const articleWithProfiles = article as (typeof article & { profiles?: { full_name?: string } | null });
  const realAuthorName = articleWithProfiles?.profiles?.full_name;
  const authorSchema = realAuthorName
    ? {
        "@type": "Person",
        "name": realAuthorName,
      }
    : {
        "@type": "Organization",
        "name": "भारतेन्दु शिखर",
        "url": siteUrl,
      };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/article/${article.slug}`
    },
    "headline": title,
    "description": description,
    "image": imageUrl ? [imageUrl] : [],
    "datePublished": publishedAt,
    "dateModified": updatedAt,
    "inLanguage": "hi",
    ...(article.categories?.name ? { "articleSection": article.categories.name } : {}),
    "author": authorSchema,
    "publisher": publisherSchema
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  );
}

async function TickerSection() {
  const topArticles = await fetchTickerArticles();
  return <Ticker articles={topArticles} />;
}

async function ArticleContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  const [article, settings] = await Promise.all([
    fetchArticleBySlug(slug),
    fetchSettings(),
  ]);
  const siteUrl = getSiteUrl(settings?.site_url).toString();

  if (!article) {
    notFound();
  }

  const relatedArticles = await fetchRelatedArticles(
    article.categories?.id,
    article.regions?.id,
    article.id
  );

  const breadcrumbs = [{ label: "होम", href: "/" }];
  if (article.categories) {
    breadcrumbs.push({ label: article.categories.name, href: `/${article.categories.slug}` });
  }
  breadcrumbs.push({ label: article.title, href: "#" });

  const publishedAt = article.published_at || article.created_at || new Date().toISOString();

  return (
    <article className="flex-1 min-w-0 flex flex-col animate-in fade-in duration-300">
      <JsonLdSchema article={article} />
      <div className="flex flex-col lg:grid lg:grid-cols-13 gap-0 md:gap-6">
        <div className="lg:col-span-9 flex flex-col min-w-0">
          <header>
            <Breadcrumbs items={breadcrumbs} siteUrl={siteUrl} />
            {/* Article Title */}
            <h1 className="text-2xl md:text-4xl font-medium text-black dark:text-white mb-3">
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
                    src={getAbsoluteImageUrl(article.featured_image)!}
                    alt={article.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Article Excerpt / Lead Paragraph */}
            {article.excerpt && (
              <div className="pl-4 border-l-4 border-red-500 mb-6">
                <p className="text-lg italic md:text-[18px] leading-relaxed text-gray-700 dark:text-gray-400 font-medium">
                  {article.excerpt}
                </p>
              </div>
            )}
          </header>

          <div
            className="w-full text-left prose prose-lg md:prose-xl max-w-none dark:prose-invert prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-a:text-red-600 dark:prose-a:text-news-accent hover:prose-a:text-red-700 prose-img:rounded-md"
            dangerouslySetInnerHTML={{ __html: sanitize(article.content) }}
          />

          <div className="w-full flex justify-end mt-4">
            <time dateTime={publishedAt}>
              <RelativeTime 
                dateString={publishedAt} 
                className="text-sm font-medium text-gray-500 dark:text-gray-400"
              />
            </time>
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

  const relatedArticles = await fetchRelatedArticles(
    article.categories?.id,
    article.regions?.id,
    article.id
  );

  const categorySliderItems: SliderItem[] = relatedArticles
    .filter((art) => art.category_id === article.categories?.id)
    .map((art) => ({
      id: art.id.toString(),
      label: article.categories?.name || "Related Topic",
      slug: article.categories?.slug || "",
      article: art,
    }));

  const regionSliderItems: SliderItem[] = relatedArticles
    .filter((art) => art.category_id !== article.categories?.id)
    .map((art) => ({
      id: art.id.toString(),
      label: article.regions?.name || "Related Region",
      slug: article.regions?.slug || "",
      article: art,
    }));

  if (categorySliderItems.length === 0 && regionSliderItems.length === 0) {
    return null;
  }

  return (
    <div className="max-w-350 mx-auto px-4 pb-4 w-full animate-in fade-in duration-300">
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
      <main className="max-w-425 mx-auto px-4 flex justify-between gap-4 mb-2 items-start mt-4 w-full">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-40 shrink-0 sticky top-4">
          <Advertisement slotId="fixed:vertical_left" orientation="vertical" />
        </div>

        <Suspense fallback={<ArticleSkeleton />}>
          <ArticleContent paramsPromise={params} />
        </Suspense>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-40 shrink-0 sticky top-4">
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
