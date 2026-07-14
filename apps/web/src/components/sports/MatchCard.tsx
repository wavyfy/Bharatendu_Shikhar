import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MatchCard({ match }: { match: any }) {
  const home = match.home_team?.name || match.home_team_name || "घरेलू";
  const away = match.away_team?.name || match.away_team_name || "विपक्षी";
  const homeLogo = match.home_team?.logo_url;
  const awayLogo = match.away_team?.logo_url;
  const isLive = match.status === "live";

  const parseScore = (scoreStr?: string | null | number) => {
    if (scoreStr == null) return { runs: "-", over: "" };
    const str = String(scoreStr);
    const m = str.match(/^(.*?)\s*\((.*?)\)$/);
    if (m) return { runs: m[1], over: m[2] };
    return { runs: str, over: "" };
  };

  const homeParsed = parseScore(match.home_score);
  const awayParsed = parseScore(match.away_score);

  // Format date: "5 Jul"
  const formattedDate = match.match_date 
    ? new Date(match.match_date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'short' })
    : "टीबीए";

  const statusText = isLive ? "लाइव" : (match.status === 'finished' ? "पूर्ण" : (match.status || "अज्ञात").toUpperCase());
  const statusColorClass = isLive 
    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
    : "bg-news-border text-news-text-secondary";

  return (
    <Link
      href={`/sports/match/${match.slug}`}
      className="group flex flex-col bg-news-card rounded-3xl p-5 shadow-sm border border-news-border hover:shadow-md transition-shadow hover:border-gray-300"
    >
      {/* Top Row: Badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColorClass}`}>
            {statusText}
          </span>
          <span className="text-[10px] md:text-[11px] font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full uppercase tracking-wider">
            {match.sport === 'cricket' ? 'क्रिकेट' : (match.sport === 'football' ? 'फुटबॉल' : (match.sport || "क्रिकेट"))}
          </span>
        </div>
        <span className="text-[11px] md:text-xs font-bold text-news-text uppercase">{match.stage || "टी20"}</span>
      </div>

      {/* Middle Row: Teams and Score */}
      <div className="flex items-center justify-between px-2 mb-4">
        {/* Left Team (Home) */}
        <div className="flex flex-col items-center gap-3 w-[30%]">
          {homeLogo ? (
            <Image src={homeLogo} alt={home} width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 object-contain" unoptimized />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-news-border flex items-center justify-center font-bold text-sm md:text-lg shrink-0">{home.charAt(0)}</div>
          )}
          <span className="text-[13px] md:text-sm font-medium text-news-text text-center line-clamp-1">{home}</span>
        </div>

        {/* Center Score */}
        <div className="flex flex-col items-center justify-center w-[40%] gap-1.5">
          <div className="text-[15px] md:text-[17px] font-bold tracking-tight text-news-text flex items-center gap-1.5">
            {homeParsed.runs} <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary">({homeParsed.over || '0 ओवर'})</span>
          </div>
          <span className="text-[10px] font-semibold text-news-text-secondary uppercase tracking-widest my-0.5">VS</span>
          <div className="text-[15px] md:text-[17px] font-bold tracking-tight text-news-text flex items-center gap-1.5">
            {awayParsed.runs} <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary">({awayParsed.over || '0 ओवर'})</span>
          </div>
        </div>

        {/* Right Team (Away) */}
        <div className="flex flex-col items-center gap-3 w-[30%]">
          {awayLogo ? (
            <Image src={awayLogo} alt={away} width={48} height={48} className="w-10 h-10 md:w-12 md:h-12 object-contain" unoptimized />
          ) : (
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-news-border flex items-center justify-center font-bold text-sm md:text-lg shrink-0">{away.charAt(0)}</div>
          )}
          <span className="text-[13px] md:text-sm font-medium text-news-text text-center line-clamp-1">{away}</span>
        </div>
      </div>

      {/* Result Row */}
      {(match.live_status_text || match.result_text) && (
        <div className="flex justify-center items-center gap-1.5 mb-4 px-2">
          <Trophy className="w-4 h-4 text-red-500 shrink-0" />
          <span className="text-[11px] md:text-xs font-medium text-news-text text-center line-clamp-1">
            {match.live_status_text || match.result_text}
          </span>
        </div>
      )}

      {/* Bottom Row: Competition & Date */}
      <div className="flex items-center justify-between border-t border-news-border pt-3 mt-auto">
        <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary truncate mr-2">
          {match.competition?.title || match.competition_title || "मैच"}
        </span>
        <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary shrink-0">
          {formattedDate}
        </span>
      </div>
    </Link>
  );
}
