import type { Metadata } from "next";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";
import { SearchPageClient } from "./SearchPageClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "भारतेन्दु शिखर";

  return {
    title: `खोज | ${siteName}`,
    description: "लेख एवं समाचार खोजें।",
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${siteUrl}/search`,
    },
  };
}

export default function SearchPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg py-10">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-medium mb-8 text-black dark:text-news-text border-b-2 border-red-600 pb-4 inline-block">
          खोजिें
        </h1>
        <Suspense fallback={
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-red-600" size={32} />
          </div>
        }>
          <SearchPageClient />
        </Suspense>
      </div>
    </main>
  );
}
