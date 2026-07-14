import { getPublishedMatches, getPublishedCompetitions } from "@/utils/fetchSports";
import { MatchCard } from "@/components/sports/MatchCard";
import Image from "next/image";
import { Trophy } from "lucide-react";

import { redirect } from "next/navigation";

export const metadata = {
  title: "Match Schedule | Sports | Bharatendu Shikhar",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Section = ({ title, matches }: { title: string, matches: any[] }) => {
  if (matches.length === 0) return null;
  return (
    <div className="mb-8">
      <div className="mb-4">
        <span className="bg-[#f0141e] text-white font-bold px-4 py-1.5 rounded-full text-[11px] md:text-xs uppercase tracking-wide inline-block shadow-sm">
          {title}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {matches.map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>
    </div>
  );
};

export default async function SchedulePage() {
  const matches = await getPublishedMatches({ limit: 100 });

  if (matches.length === 1) {
    redirect(`/sports/match/${matches[0].slug}`);
  }

  const competitions = await getPublishedCompetitions({ limit: 1 });
  const featuredCompetition = competitions[0];

  const liveMatches = matches.filter(m => m.status === 'live' || m.status === 'in_progress');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming' || m.status === 'scheduled');
  const recentMatches = matches.filter(m => m.status === 'completed' || m.status === 'finished');

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-4 pt-8">
        
        {/* Banner */}
        {featuredCompetition && (
          <div className="w-full relative rounded-2xl overflow-hidden bg-slate-900 min-h-[300px] flex items-center p-8 sm:p-12 shadow-sm border border-slate-800/50 mb-8">
            {featuredCompetition.banner_url && (
              <>
                <Image src={featuredCompetition.banner_url} alt="Banner" fill className="object-cover opacity-60 mix-blend-overlay" unoptimized />
                <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/80 to-transparent" />
              </>
            )}
            
            <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Competition Details */}
                <div className="shrink-0">
                  {featuredCompetition.logo_url ? (
                    <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center p-2.5 shadow-lg overflow-hidden border border-white/20">
                      <Image src={featuredCompetition.logo_url} alt={featuredCompetition.title} width={76} height={76} className="object-contain" unoptimized />
                    </div>
                  ) : (
                    <div className="bg-white/10 backdrop-blur-md rounded-full w-24 h-24 flex items-center justify-center border border-white/20">
                      <Trophy className="w-12 h-12 text-white/80 drop-shadow-md" />
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col items-center md:items-start">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 drop-shadow-md tracking-tight font-sans">
                    {featuredCompetition.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-white/90 text-sm font-medium">
                    {featuredCompetition.competition_type && (
                      <span className="bg-[#f0141e] text-white px-3 py-1 rounded-full uppercase tracking-wider text-[11px] font-bold shadow-sm">
                        {featuredCompetition.competition_type}
                      </span>
                    )}
                    {featuredCompetition.season && <span className="font-bold tracking-wide">{featuredCompetition.season}</span>}
                    {featuredCompetition.start_date && featuredCompetition.end_date && (
                      <span className="opacity-80">
                        {new Date(featuredCompetition.start_date).toLocaleDateString()} - {new Date(featuredCompetition.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Separator - removed to reduce spacing */}

        <Section title="लाइव मैच" matches={liveMatches} />
        <Section title="आगामी मैच" matches={upcomingMatches} />
        <Section title="हाल के मैच" matches={recentMatches} />
        
        {matches.length === 0 && (
          <div className="text-center py-20 text-news-text-secondary">
            <p className="text-lg font-medium">शेड्यूल में कोई मैच नहीं मिला।</p>
          </div>
        )}
      </div>
    </main>
  );
}
