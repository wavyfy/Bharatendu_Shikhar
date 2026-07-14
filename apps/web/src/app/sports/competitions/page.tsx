import { getPublishedCompetitions } from "@/utils/fetchSports";
import { Trophy } from "lucide-react";


export const metadata = {
  title: "Competitions | Sports | Bharatendu Shikhar",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { CompetitionCard } from "@/components/sports/CompetitionCard";

export default async function CompetitionsPage() {
  const competitions = await getPublishedCompetitions({ limit: 50 });

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {competitions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {competitions.map((c) => (
              <CompetitionCard key={c.id} competition={c} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">अभी कोई प्रतियोगिता उपलब्ध नहीं है।</p>
          </div>
        )}
      </div>
    </main>
  );
}
