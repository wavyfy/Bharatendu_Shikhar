import { Home } from "lucide-react";
import { getPublishedCompetitions } from "@/utils/fetchSports";
import { CompetitionCard } from "@/components/sports/CompetitionCard";
import { redirect } from "next/navigation";

import type { Metadata } from "next";
import { fetchSettings } from "@/utils/fetchData";
import { getSiteUrl } from "@/utils/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const siteUrl = getSiteUrl(settings?.site_url).toString().replace(/\/$/, "");
  const siteName = settings?.site_name || "भारतेन्दु शिखर";

  return {
    title: `खेल समाचार | ${siteName}`,
    description: "क्रिकेट, फुटबॉल और अन्य खेलों के लाइव स्कोर, मैच शेड्यूल और अपडेट।",
    alternates: {
      canonical: `${siteUrl}/sports`,
    },
    openGraph: {
      title: `खेल समाचार | ${siteName}`,
      description: "क्रिकेट, फुटबॉल और अन्य खेलों के लाइव स्कोर, मैच शेड्यूल और अपडेट।",
      url: `${siteUrl}/sports`,
      siteName,
      locale: "hi_IN",
      type: "website",
    },
  };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SportsPage() {
  const competitions = await getPublishedCompetitions({ limit: 50 });

  if (competitions.length === 1) {
    redirect(`/sports/${competitions[0].sport}/${competitions[0].slug}`);
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero section is now handled globally in SportsLayout */}

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        <section id="competitions" className="scroll-mt-20">
          <h2 className="text-xl font-bold text-news-text mb-5">प्रतियोगिताएं</h2>
          {competitions.length > 0 ? (
            <div className="flex flex-col gap-4">
              {competitions.map((c) => (
                <CompetitionCard key={c.id} competition={c} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
              <Home className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">अभी कोई प्रतियोगिता उपलब्ध नहीं है।</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
