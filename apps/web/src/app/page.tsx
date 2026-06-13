
import { Ticker } from "@/components/home/Ticker";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { ExpandableSectionLayout } from "@/components/home/ExpandableSectionLayout";
import { HorizontalArticleSlider } from "@/components/home/HorizontalArticleSlider";
import { fetchHomepageData, fetchBottomSlidersData } from "@/utils/fetchData";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { topArticles, categorySections } = await fetchHomepageData();

  const { regionSliderItems, categorySliderItems } = await fetchBottomSlidersData();

  return (
    <div className="bg-news-bg text-news-text font-sans">
      <Ticker articles={topArticles} />

      <div className="max-w-[1700px] mx-auto px-4 flex gap-6 mb-8 items-start">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <main style={{ zoom: 0.95 }}>
            <ExpandableSectionLayout articles={topArticles} />
          </main>

          {/* Full-width Horizontal Ad separator */}
          <div className="mb-12">
            <Advertisement orientation="horizontal" />
          </div>

          {/* Dynamic Topic Sections */}
          <div style={{ zoom: 0.95 }}>
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
        </div>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>
      </div>

      {/* Bottom Sliders (Outside sticky ad container) */}
      <div className="max-w-[1400px] mx-auto px-0 mb-0 mt-4 flex flex-col gap-0 shadow-sm" style={{ zoom: 1 }}>
        <HorizontalArticleSlider title="UTTARAKHAND REGIONS" items={regionSliderItems} />
        <HorizontalArticleSlider title="GLOBAL NEWS" items={categorySliderItems} />
      </div>
    </div>
  );
}
