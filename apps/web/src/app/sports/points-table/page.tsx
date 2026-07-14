import { getPublishedCompetitions, getPointsTableByCompetitionId } from "@/utils/fetchSports";
import { PointsTable } from "@/components/sports/PointsTable";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/shared/SafeImage";

export const metadata = {
  title: "Points Tables | Sports | Bharatendu Shikhar",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PointsTablePage() {
  const competitions = await getPublishedCompetitions({ limit: 50 });

  // Fetch points tables for all active competitions
  const tablesData = await Promise.all(
    competitions.map(async (comp) => {
      const entries = await getPointsTableByCompetitionId(comp.id);
      return { competition: comp, entries };
    })
  );

  // Filter out competitions that don't have any points table entries yet
  const activeTables = tablesData.filter((data) => data.entries.length > 0);

  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="bg-news-card border-b border-news-border py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-extrabold text-news-text tracking-tight">Points Tables</h1>
          </div>
          <p className="text-news-text-secondary text-base">
            Current standings across all active tournaments and leagues.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        {activeTables.length > 0 ? (
          activeTables.map(({ competition, entries }) => (
            <section key={competition.id} className="bg-news-card border border-news-border rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6 border-b border-news-border bg-news-card/50">
                <div className="flex items-center gap-4">
                  {competition.logo_url ? (
                    <SafeImage
                      src={competition.logo_url}
                      alt={competition.title}
                      width={48}
                      height={48}
                      className="rounded-xl object-cover ring-2 ring-news-border"
                      unoptimized
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-news-border flex items-center justify-center text-news-text-secondary ring-2 ring-news-border">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-news-text">{competition.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium uppercase text-news-text-secondary">
                        {competition.sport}
                      </span>
                      {competition.season && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-on-surface-variant opacity-50" />
                          <span className="text-xs text-news-text-secondary">{competition.season}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/sports/${competition.sport}/${competition.slug}`}
                  className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                >
                  View Competition
                </Link>
              </div>

              {/* Table */}
              <div className="p-0 sm:p-6 sm:pt-4">
                <PointsTable entries={entries} sport={competition.sport} />
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No active points tables available.</p>
          </div>
        )}
      </div>
    </main>
  );
}
