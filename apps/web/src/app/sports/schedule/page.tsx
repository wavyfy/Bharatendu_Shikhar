import { getPublishedMatches, getPublishedCompetitions } from "@/utils/fetchSports";
import { MatchCard } from "@/components/sports/MatchCard";
import { CalendarDays } from "lucide-react";
import Image from "next/image";

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
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-1.5 h-5 bg-[#f0141e] rounded-full"></div>
        <h2 className="text-lg font-bold text-news-text uppercase tracking-wider">{title}</h2>
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
          <div className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden bg-slate-900 flex items-end md:items-center min-h-85 p-6 sm:p-8 md:p-12 shadow-sm mb-8">
            {featuredCompetition.banner_url && (
              <>
                <Image src={featuredCompetition.banner_url} alt="Banner" fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-r from-black/90 via-black/50 to-transparent md:to-black/10" />
              </>
            )}
            
            <div className="relative z-10 w-full flex flex-col items-center md:items-start text-center md:text-left mt-auto md:mt-0">
              <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
                {featuredCompetition.logo_url && (
                  <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center p-2.5 shadow-sm overflow-hidden shrink-0">
                    <Image src={featuredCompetition.logo_url} alt={featuredCompetition.title} width={64} height={64} className="object-contain" unoptimized />
                  </div>
                )}
                
                <h1 className="text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-sm tracking-tight font-serif font-bold">
                  {featuredCompetition.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-white font-medium">
                  {featuredCompetition.competition_type && (
                    <span className="bg-black/30 backdrop-blur-sm border border-white/10 text-white px-3 py-1 rounded-full uppercase tracking-wider text-[10px] font-bold shadow-sm">
                      {featuredCompetition.competition_type}
                    </span>
                  )}
                  {featuredCompetition.season && <span className="font-bold tracking-wide text-sm">{featuredCompetition.season}</span>}
                  {featuredCompetition.start_date && featuredCompetition.end_date && (
                    <span className="opacity-90 text-sm">
                      {new Date(featuredCompetition.start_date).toLocaleDateString()} - {new Date(featuredCompetition.end_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <p className="text-white/90 max-w-2xl mt-1 text-xs md:text-sm leading-relaxed">
                  {featuredCompetition.title} टूर्नामेंट कवरेज जिसमें लाइव मैच, परिणाम, शेड्यूल और अंक तालिका शामिल हैं।
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Separator - removed to reduce spacing */}

        <Section title="लाइव मैच" matches={liveMatches} />
        <Section title="आगामी मैच" matches={upcomingMatches} />
        <Section title="हाल के मैच" matches={recentMatches} />
        
        {matches.length === 0 && (
          <div className="text-center py-20 text-news-text-secondary bg-news-card rounded-2xl border border-news-border border-dashed">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">अभी कोई प्रतियोगिता उपलब्ध नहीं है।</p>
          </div>
        )}
      </div>
    </main>
  );
}
