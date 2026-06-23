import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Ticker } from "@/components/home/Ticker";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { ExpandableSectionLayout } from "@/components/home/ExpandableSectionLayout";
import { fetchDynamicPageData, fetchTickerArticles, fetchSettings } from "@/utils/fetchData";
import { TickerSkeleton } from "@/components/skeletons/HomeSkeletons";
import { CategoryPageSkeleton } from "@/components/skeletons/CategorySkeletons";
import type { Metadata } from "next";
import { getSiteUrl } from "@/utils/seo";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";

/** CollectionPage + ItemList structured data for category/region listing pages. */
async function CollectionPageAndItemListSchema({
  pageTitle,
  displayDescription,
  pageType,
  slug,
  topArticles,
}: {
  pageTitle: string;
  displayDescription: string;
  pageType: "category" | "region";
  slug: string;
  topArticles: { title: string | null; slug: string }[];
}) {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  const pageUrl = `${siteUrl}/${pageType}/${slug}`;

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": displayDescription,
    "url": pageUrl,
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": pageTitle,
    "url": pageUrl,
    "itemListElement": topArticles.slice(0, 20).map((article, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": article.title,
      "url": `${siteUrl}/article/${article.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await fetchDynamicPageData(slug);
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  
  if (!pageData) {
    return {
      title: "Category Not Found",
    };
  }

  const urlType = pageData.type === "region" ? "region" : "category";

  const fallbackDescription = pageData.type === "region"
    ? `Latest ${pageData.pageTitle} news, local updates and regional coverage from Bharatendu Shikhar.`
    : `Latest ${pageData.pageTitle} news, updates and breaking stories from Bharatendu Shikhar.`;

  const metaDescription = pageData.seoDescription || fallbackDescription;

  return {
    title: pageData.pageTitle,
    description: metaDescription,
    alternates: {
      canonical: `${siteUrl}/${urlType}/${slug}`,
    },
    openGraph: {
      title: pageData.pageTitle,
      description: metaDescription,
      url: `${siteUrl}/${urlType}/${slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.pageTitle,
      description: metaDescription,
    },
  };
}

async function TickerSection() {
  const topArticles = await fetchTickerArticles();
  return <Ticker articles={topArticles} />;
}

async function CategoryContent({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const { slug } = await paramsPromise;
  const pageData = await fetchDynamicPageData(slug);
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  
  if (!pageData) {
    notFound();
  }

  const { topArticles, categorySections, pageTitle, seoDescription, type } = pageData;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: pageTitle }
  ];

  const fallbackDescription = type === "region"
    ? `Latest ${pageTitle} news, local updates and regional coverage from Bharatendu Shikhar.`
    : `Latest ${pageTitle} news, updates and breaking stories from Bharatendu Shikhar.`;

  const displayDescription = seoDescription || fallbackDescription;

  return (
    <div className="flex-1 min-w-0 flex flex-col mt-5 animate-in fade-in duration-300">
      <CollectionPageAndItemListSchema
        pageTitle={pageTitle}
        displayDescription={displayDescription}
        pageType={type as "category" | "region"}
        slug={pageData.slug}
        topArticles={topArticles}
      />
      <Breadcrumbs items={breadcrumbs} siteUrl={siteUrl} />
      <div className="pb-4 pt-2 mb-2 border-b-2 border-red-600">
        <h1 className="text-4xl font-playfair font-bold uppercase tracking-wider">{pageTitle}</h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          {displayDescription}
        </p>
      </div>
      
      <main className="mt-6">
        <ExpandableSectionLayout articles={topArticles} />
      </main>

      {/* Full-width Horizontal Ad separator */}
      <div className="my-6">
        <Advertisement slotId={`${pageData.type}:${pageData.id}`} orientation="horizontal" />
      </div>

      {/* Dynamic Topic Sections */}
      {categorySections.map((topic, index) => (
        <div key={topic.id}>
          {index > 0 && (
            <div className="my-6">
              <Advertisement slotId={`category:${topic.id}`} orientation="horizontal" />
            </div>
          )}
          <TopicSection data={topic} />
        </div>
      ))}
    </div>
  );
}

export default function DynamicRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="bg-news-bg text-news-text font-sans">
      <Suspense fallback={<TickerSkeleton />}>
        <TickerSection />
      </Suspense>

      <div className="max-w-[1700px] mx-auto px-4 flex gap-6 mb-20 items-start">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4 mt-8">
          <Advertisement slotId="fixed:vertical_left" orientation="vertical" />
        </div>

        <Suspense fallback={<CategoryPageSkeleton />}>
          <CategoryContent paramsPromise={params} />
        </Suspense>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4 mt-8">
          <Advertisement slotId="fixed:vertical_right" orientation="vertical" />
        </div>
      </div>
    </div>
  );
}
