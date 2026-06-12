import { notFound } from "next/navigation";

import { Ticker } from "@/components/home/Ticker";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { ExpandableSectionLayout } from "@/components/home/ExpandableSectionLayout";
import { fetchDynamicPageData, fetchNavbarData } from "@/utils/fetchData";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function DynamicRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const pageData = await fetchDynamicPageData(slug);
  
  if (!pageData) {
    notFound();
  }

  const { topArticles, categorySections, pageTitle } = pageData;
  const { regions, categories } = await fetchNavbarData();

  return (
    <div className="bg-news-bg text-news-text font-sans">
      <Ticker articles={topArticles} />

      <div className="max-w-[1700px] mx-auto px-4 flex gap-6 mb-20 items-start">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="py-6 mb-2 border-b-2 border-red-600">
            <h1 className="text-4xl font-playfair font-bold uppercase tracking-wider">{pageTitle}</h1>
          </div>
          
          <main className="mt-6">
            <ExpandableSectionLayout articles={topArticles} />
          </main>

          {/* Full-width Horizontal Ad separator */}
          <div className="mb-12">
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

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>
      </div>
    </div>
  );
}
