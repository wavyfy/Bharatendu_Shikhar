import { Suspense } from "react";
import { notFound } from "next/navigation";

import { Ticker } from "@/components/home/Ticker";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { ExpandableSectionLayout } from "@/components/home/ExpandableSectionLayout";
import { fetchDynamicPageData, fetchTickerArticles } from "@/utils/fetchData";
import { TickerSkeleton } from "@/components/skeletons/HomeSkeletons";
import { CategoryPageSkeleton } from "@/components/skeletons/CategorySkeletons";
import type { Metadata } from "next";

export const revalidate = 60; // Revalidate every 60 seconds

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const pageData = await fetchDynamicPageData(slug);
  
  if (!pageData) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: pageData.pageTitle,
    description: `Latest news, articles, and updates for ${pageData.pageTitle}.`,
    openGraph: {
      title: pageData.pageTitle,
      description: `Latest news, articles, and updates for ${pageData.pageTitle}.`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageData.pageTitle,
      description: `Latest news, articles, and updates for ${pageData.pageTitle}.`,
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
  
  if (!pageData) {
    notFound();
  }

  const { topArticles, categorySections, pageTitle } = pageData;

  return (
    <div className="flex-1 min-w-0 flex flex-col mt-8 animate-in fade-in duration-300">
      <div className="py-6 mb-2 border-b-2 border-red-600">
        <h1 className="text-4xl font-playfair font-bold uppercase tracking-wider">{pageTitle}</h1>
      </div>
      
      <main className="mt-6">
        <ExpandableSectionLayout articles={topArticles} />
      </main>

      {/* Full-width Horizontal Ad separator */}
      <div className="mb-12 mt-12">
        <Advertisement orientation="horizontal" />
      </div>

      {/* Dynamic Topic Sections */}
      {categorySections.map((topic, index) => (
        <div key={topic.id}>
          {index > 0 && (
            <div className="my-12">
              <Advertisement orientation="horizontal" />
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
          <Advertisement orientation="vertical" />
        </div>

        <Suspense fallback={<CategoryPageSkeleton />}>
          <CategoryContent paramsPromise={params} />
        </Suspense>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4 mt-8">
          <Advertisement orientation="vertical" />
        </div>
      </div>
    </div>
  );
}
