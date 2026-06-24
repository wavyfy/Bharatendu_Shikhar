import { Suspense } from "react";
import { Ticker } from "@/components/home/Ticker";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { ExpandableSectionLayout } from "@/components/home/ExpandableSectionLayout";
import { HorizontalArticleSlider } from "@/components/home/HorizontalArticleSlider";
import { fetchHomepageData, fetchBottomSlidersData } from "@/utils/fetchData";
import { 
  TickerSkeleton, 
  FeaturedSkeleton, 
  CategorySectionsSkeleton, 
  BottomSlidersSkeleton 
} from "@/components/skeletons/HomeSkeletons";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";

export const revalidate = 60; // Revalidate every 60 seconds

async function JsonLdSchema() {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString();
  const siteName = settings?.site_name || "Bharatendu Shikhar";
  const logoUrl = settings?.site_logo_url || "";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": siteName,
    "url": siteUrl,
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": siteUrl,
    "logo": logoUrl,
  };

  // ItemList: latest published articles for search engine article ordering
  const { topArticles } = await fetchHomepageData();
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `Latest News — ${siteName}`,
    "url": siteUrl,
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </>
  );
}

async function TickerSection() {
  const { topArticles } = await fetchHomepageData();
  return <Ticker articles={topArticles} />;
}

async function FeaturedSection() {
  const { topArticles } = await fetchHomepageData();
  return <ExpandableSectionLayout articles={topArticles} />;
}

async function CategoriesSection() {
  const { categorySections } = await fetchHomepageData();
  return (
    <>
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
    </>
  );
}

async function BottomSlidersSection() {
  const { regionSliderItems, categorySliderItems } = await fetchBottomSlidersData();
  return (
    <div className="max-w-[1400px] mx-auto px-0 mb-0 mt-4 flex flex-col gap-0 shadow-sm" style={{ zoom: 1 }}>
      <HorizontalArticleSlider title="उत्तराखंड क्षेत्र" items={regionSliderItems} />
      <HorizontalArticleSlider title="विश्व समाचार" items={categorySliderItems} />
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-news-bg text-news-text font-sans">
      <JsonLdSchema />
      <Suspense fallback={<TickerSkeleton />}>
        <TickerSection />
      </Suspense>

      <div className="max-w-[1700px] mx-auto px-4 flex gap-6 mb-8 items-start">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-15 mt-8">
          <Advertisement slotId="fixed:vertical_left" orientation="vertical" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col mt-8">
          <main style={{ zoom: 0.95 }}>
            <Suspense fallback={<FeaturedSkeleton />}>
              <FeaturedSection />
            </Suspense>
          </main>

          {/* Full-width Horizontal Ad separator */}
          <div className="my-6">
            <Advertisement slotId="fixed:home_horizontal" orientation="horizontal" />
          </div>

          {/* Dynamic Topic Sections */}
          <div style={{ zoom: 0.95 }}>
            <Suspense fallback={<CategorySectionsSkeleton />}>
              <CategoriesSection />
            </Suspense>
          </div>
        </div>

        {/* Right Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-15 mt-8">
          <Advertisement slotId="fixed:vertical_right" orientation="vertical" />
        </div>
      </div>

      {/* Bottom Sliders */}
      <Suspense fallback={<BottomSlidersSkeleton />}>
        <BottomSlidersSection />
      </Suspense>
    </div>
  );
}
