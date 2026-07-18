import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";
import { getMatchBySlug, getPointsTableByCompetitionId } from "@/utils/fetchSports";
import { PointsTable } from "@/components/sports/PointsTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MatchDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getMatchBySlug(slug);
  if (!result) notFound();

  const { match, updates } = result;

  let pointsTableEntries = [];
  if (match.competition_id) {
    pointsTableEntries = await getPointsTableByCompetitionId(match.competition_id);
  }

  const home = match.home_team?.name || "घरेलू";
  const away = match.away_team?.name || "विपक्षी";
  const homeLogo = match.home_team?.logo_url;
  const awayLogo = match.away_team?.logo_url;
  const isLive = match.status === "live";
  const isCricket = match.sport === "cricket";

  const parseScore = (scoreStr?: string | null) => {
    if (!scoreStr) return { runs: "-", over: "" };
    const m = scoreStr.match(/^(.*?)\s*\((.*?)\)$/);
    if (m) {
      return { runs: m[1], over: m[2] };
    }
    return { runs: scoreStr, over: "" };
  };

  const homeParsed = parseScore(match.home_score);
  const awayParsed = parseScore(match.away_score);

  const keyMoments = updates.filter((u: {is_key_moment?: boolean}) => u.is_key_moment);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function UpdateRow({ u, isLast }: { u: any, isLast?: boolean }) {
    const timeLabel = (u.over_ball || u.minute != null)
      ? `${isCricket ? u.over_ball + " ov" : u.minute + "'"} - लाइव - ${new Date(u.created_at).toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}`
      : `लाइव - ${new Date(u.created_at).toLocaleTimeString("hi-IN", { hour: "2-digit", minute: "2-digit" })}`;

    const titleStr = u.title || "मैच अपडेट";
    const isWicket = titleStr.toLowerCase().includes("wicket") || u.update_type === "wicket";

    return (
      <div className="flex pb-8 md:pb-10 relative group">
        {/* Left Column: Timeline Line & Dot */}
        <div className="w-8 shrink-0 relative flex justify-center">
          {!isLast && (
            <div className="absolute top-[8px] bottom-[-10px] w-[2px] bg-news-border" />
          )}
          <div className="absolute top-[8px] w-2.5 h-2.5 rounded-full bg-[#f0141e] z-10 shadow-[0_0_0_4px_var(--background)]" />
        </div>

        {/* Right Column: Content */}
        <div className="flex-1">
          {/* Title Row */}
          <div className="flex items-center gap-3 mb-2 md:mb-3">
            <h4 className={`font-serif text-lg md:text-[22px] font-black leading-none ${isWicket ? 'text-[#f0141e] uppercase tracking-wide' : 'text-news-text'}`}>
              {titleStr}
            </h4>
            <span className="bg-[#f0141e] text-white text-[10px] md:text-[11px] font-bold px-2 py-1 rounded leading-none shrink-0 shadow-sm">
              {timeLabel}
            </span>
          </div>

          {/* Description */}
          <p className="text-[13px] md:text-sm text-news-text-secondary leading-relaxed pr-4">
            {u.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Match Header Scoreboard */}
      <section className="px-4 py-8 max-w-6xl mx-auto mt-4">
        <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden flex flex-col items-center bg-slate-900 shadow-lg pb-8 pt-6">
          
          {/* Top Left Status Badge */}
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20">
            <span className={`text-[10px] md:text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded shadow-sm ${isLive ? 'bg-[#f0141e] text-white' : 'bg-white/20 text-white'}`}>
              {match.status === 'live' ? 'लाइव' : (match.status === 'finished' ? 'पूर्ण' : match.status)}
            </span>
          </div>

          {/* Dark Overlay Background */}
          <div className="absolute inset-0 flex w-full h-full pointer-events-none opacity-40">
            <div className="w-1/2 h-full bg-linear-to-r from-black/50 to-transparent"></div>
            <div className="w-1/2 h-full bg-linear-to-l from-black/50 to-transparent"></div>
          </div>
          
          {/* Watermarks (Inverse) */}
          <div className="absolute inset-0 flex w-full h-full justify-between items-center px-4 md:px-12 pointer-events-none overflow-hidden opacity-10 mix-blend-plus-lighter">
            {homeLogo ? (
              <Image src={homeLogo} alt="" width={300} height={300} className="w-[300px] md:w-[400px] -ml-16 md:-ml-20 grayscale invert" unoptimized />
            ) : <div />}
            {awayLogo ? (
              <Image src={awayLogo} alt="" width={300} height={300} className="w-[300px] md:w-[400px] -mr-16 md:-mr-20 grayscale invert" unoptimized />
            ) : <div />}
          </div>

          <div className="relative z-10 w-full text-white">
            {/* Stadium */}
            <div className="text-center mb-6">
              <span className="font-bold text-xs md:text-sm text-gray-300 uppercase tracking-wider">{match.venue || "स्टेडियम टीबीए"}</span>
            </div>
            
            {/* Scoreboard content */}
            <div className="flex items-center justify-center gap-2 md:gap-8 px-2 md:px-4 w-full">
              
              {/* Home Team */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-end gap-2 md:gap-4 flex-1">
                <span className="text-sm md:text-2xl font-bold text-center md:text-right leading-tight line-clamp-2 md:line-clamp-none">{home}</span>
                {homeLogo ? (
                  <Image src={homeLogo} alt={home} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-contain bg-white shadow-sm shrink-0" unoptimized />
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-news-border flex items-center justify-center font-bold text-xl md:text-2xl shrink-0">{home.charAt(0)}</div>
                )}
              </div>

              {/* Score */}
              <div className="flex flex-col items-center justify-center shrink-0 px-2 md:px-6">
                <div className="flex items-center gap-3 md:gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-black tracking-tight text-white text-right drop-shadow-sm">{homeParsed.runs}</span>
                    {homeParsed.over && <span className="text-[10px] md:text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{homeParsed.over}</span>}
                  </div>
                  
                  <div className="flex flex-col items-center justify-center shrink-0 -mt-2">
                    <span className="text-[12px] md:text-sm font-black tracking-widest text-white/40 px-3 py-1">
                      VS
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-black tracking-tight text-white text-left drop-shadow-sm">{awayParsed.runs}</span>
                    {awayParsed.over && <span className="text-[10px] md:text-xs text-gray-400 font-bold mt-1 uppercase tracking-wider">{awayParsed.over}</span>}
                  </div>
                </div>
              </div>

              {/* Away Team */}
              <div className="flex flex-col md:flex-row items-center justify-start gap-2 md:gap-4 flex-1">
                {awayLogo ? (
                  <Image src={awayLogo} alt={away} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 rounded-full object-contain bg-white shadow-sm shrink-0" unoptimized />
                ) : (
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-news-border flex items-center justify-center font-bold text-xl md:text-2xl shrink-0">{away.charAt(0)}</div>
                )}
                <span className="text-sm md:text-2xl font-bold text-center md:text-left leading-tight line-clamp-2 md:line-clamp-none">{away}</span>
              </div>

            </div>

            {/* Match Result Text placed below to keep horizontal alignment centered */}
            {(match.live_status_text || match.result_text) && (
              <div className="mt-6 flex justify-center px-4">
                <span className={`text-xs md:text-sm font-bold text-center px-4 py-1.5 rounded-full shadow-sm ${isLive ? 'bg-[#f0141e] text-white' : 'bg-white/10 text-white'}`}>
                  {match.live_status_text || match.result_text}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <hr className="max-w-6xl mx-auto border-news-border/20 mb-8" />

      {/* Points Table Section */}
      <section className="max-w-6xl mx-auto px-4 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-news-text leading-none mt-1">अंक तालिका</h2>
        </div>
        
        {pointsTableEntries.length > 0 ? (
          <div className="bg-news-card rounded-3xl p-6 shadow-sm border border-news-border">
            {/* League Header */}
            {match.competition && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-news-text">
                  {match.competition.logo_url ? (
                    <Image src={match.competition.logo_url} alt="" width={24} height={24} className="rounded-full w-6 h-6 object-contain" unoptimized />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-news-border flex items-center justify-center font-bold text-[10px] text-news-text">
                      {match.competition.title.charAt(0)}
                    </div>
                  )}
                  <span>{match.competition.title}</span>
                </div>
                <Link href="/sports/competitions" className="text-[13px] text-news-text-secondary hover:text-news-text flex items-center gap-1 transition-colors">
                  सभी देखें <span className="text-base leading-none mb-0.5">&rsaquo;</span>
                </Link>
              </div>
            )}
            
            <PointsTable entries={pointsTableEntries} sport={match.sport} />
          </div>
        ) : (
          <div className="text-sm text-news-text-secondary text-center py-8">कोई अंक तालिका उपलब्ध नहीं है।</div>
        )}
      </section>

      {/* Main Content Layout (Live Commentary in 2 Columns) */}
      <section className="max-w-6xl mx-auto px-4 mt-8 mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-xl leading-none">🎙️</span>
          <h2 className="text-lg font-bold text-news-text leading-none mt-1">मैच कमेंट्री और अपडेट</h2>
        </div>

        <div className="bg-news-card p-8 md:p-12 lg:p-16 rounded-3xl shadow-sm border border-news-border">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Left Column: Key Moments */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="bg-[#f0141e] text-white font-bold px-4 py-1.5 rounded-full text-[11px] md:text-xs uppercase tracking-wide inline-block shadow-sm">मुख्य क्षण</span>
            </div>
            {keyMoments.length > 0 ? (
              <div className="flex flex-col max-h-[500px] overflow-y-auto pr-2">
                {keyMoments.map((u, idx) => (
                  <UpdateRow key={u.id} u={u} isLast={idx === keyMoments.length - 1} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-news-text-secondary text-sm">
                अभी तक कोई मुख्य क्षण नहीं।
              </div>
            )}
          </div>

          {/* Right Column: Live Commentary */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="bg-[#f0141e] text-white font-bold px-4 py-1.5 rounded-full text-[11px] md:text-xs uppercase tracking-wide inline-block shadow-sm">लाइव कमेंट्री</span>
            </div>
            {updates.length > 0 ? (
              <div className="flex flex-col max-h-[500px] overflow-y-auto pr-2">
                {updates.map((u, idx) => (
                  <UpdateRow key={u.id} u={u} isLast={idx === updates.length - 1} />
                ))}
              </div>
            ) : (
              <div className="py-8 text-news-text-secondary text-sm">
                {isLive ? "लाइव कमेंट्री यहां दिखाई देगी।" : "कोई कमेंट्री उपलब्ध नहीं है।"}
              </div>
            )}
          </div>
          
        </div>
        </div>
      </section>
    </main>
  );
}
