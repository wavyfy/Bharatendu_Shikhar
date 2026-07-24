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
      <div className="max-w-6xl mx-auto px-4 pt-10 pb-10">
        {matches.length > 0 ? (
          <div className="flex flex-col gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">अभी कोई प्रतियोगिता उपलब्ध नहीं है।</p>
          </div>
        )}
      </div>
    </main>
  );
}
