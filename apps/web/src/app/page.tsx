import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Navbar } from "@/components/layout/Navbar";
import { Ticker } from "@/components/home/Ticker";
import { FeatureArticle } from "@/components/home/FeatureArticle";
import { SplitArticles } from "@/components/home/SplitArticles";
import { LiveUpdatesSection } from "@/components/home/LiveUpdatesSection";
import { RelatedArticlesList } from "@/components/shared/RelatedArticlesList";
import { Advertisement } from "@/components/shared/Advertisement";
import { TopicSection } from "@/components/home/TopicSection";
import { fetchHomepageData } from "@/utils/fetchData";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const { topArticles, categorySections } = await fetchHomepageData();

  return (
    <div className="min-h-screen bg-white text-black font-sans">

      <TopBar />
      <Header />
      <Navbar />
      <Ticker />

      <div className="max-w-[1700px] mx-auto px-4 flex gap-6 mb-20 items-start">
        {/* Left Sticky Ad */}
        <div className="hidden xl:block w-[160px] shrink-0 sticky top-4">
          <Advertisement orientation="vertical" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <main className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
            
            {/* Left Column (Main Articles) */}
            <div className="md:col-span-8 pr-4">
              <FeatureArticle article={topArticles[0]} />
              
              <div className="h-px w-full bg-gray-300 my-6"></div>
              
              <SplitArticles articles={topArticles.slice(1, 3)} />
              
              <div className="h-px w-full bg-gray-300 my-6"></div>
              
              <LiveUpdatesSection article={topArticles[3]} />
              
              <div className="h-px w-full bg-gray-300 my-6"></div>
            </div>
            
            {/* Right Column (Related) */}
            <div className="md:col-span-4 pl-4 md:border-l border-gray-300">
              <RelatedArticlesList 
                articles={topArticles.slice(4).map((art) => ({
                  id: art.id.toString(),
                  source: art.profiles?.full_name || "Editorial Team",
                  title: art.title,
                  readTime: art.content ? `${Math.ceil(art.content.trim().split(/\s+/).length / 200)} MIN READ` : "1 MIN READ",
                  imageSrc: art.featured_image?.startsWith("http") 
                    ? art.featured_image 
                    : art.featured_image 
                      ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${art.featured_image}` 
                      : null
                }))} 
              />
            </div>
            
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
