import { getPublishedMatches } from "@/utils/fetchSports";
import { MatchCard } from "@/components/sports/MatchCard";
import { CheckSquare } from "lucide-react";

export const metadata = {
  title: "Match Results | Sports | Bharatendu Shikhar",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResultsPage() {
  const matches = await getPublishedMatches({ status: "completed", limit: 100 });

  return (
    <main className="min-h-screen bg-background">
      <section className="bg-news-card border-b border-news-border py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <CheckSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-extrabold text-news-text tracking-tight">Recent Results</h1>
          </div>
          <p className="text-news-text-secondary text-base">
            Scores and scorecards from all completed matches.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {matches.length > 0 ? (
          <div className="flex flex-col gap-4">
            {matches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-news-text-secondary">
            <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No completed matches found.</p>
          </div>
        )}
      </div>
    </main>
  );
}
