import { getPublishedMatches } from "@/utils/fetchSports";
import { MatchCard } from "@/components/sports/MatchCard";
import { Activity } from "lucide-react";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Live Scores | Sports | Bharatendu Shikhar",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function LivePage() {
  const matches = await getPublishedMatches({ status: "live", limit: 50 });

  if (matches.length === 1) {
    redirect(`/sports/match/${matches[0].slug}`);
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="relative w-full bg-news-card border-b border-news-border -mt-20 pt-24 md:pt-20 pb-4 md:pb-6 px-4 z-0">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <Activity className="w-8 h-8 text-red-500" />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <h1 className="text-3xl font-extrabold text-news-text tracking-tight">लाइव स्कोर</h1>
          </div>
          <p className="text-news-text-secondary text-base">
            चल रहे मैचों से वास्तविक समय के अपडेट, स्कोर और कमेंट्री।
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-10">
        {matches.length > 0 ? (
          <div className="flex flex-col gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">वर्तमान में कोई मैच लाइव नहीं है।</p>
            <p className="text-sm mt-2">आगामी खेलों के लिए शेड्यूल देखें।</p>
          </div>
        )}
      </div>
    </main>
  );
}
