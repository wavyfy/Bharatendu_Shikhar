import Link from "next/link";
import Image from "next/image";
import { Trophy } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CompetitionCard({ competition }: { competition: any }) {
  const isLive = competition.status === "live";
  const statusText = isLive ? "LIVE" : (competition.status === 'completed' ? "COMPLETED" : (competition.status || "ACTIVE").toUpperCase());
  const statusColorClass = isLive 
    ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" 
    : "bg-news-border text-news-text-secondary";

  const formattedDate = (competition.start_date && competition.end_date)
    ? `${new Date(competition.start_date).toLocaleDateString('en-GB', { month: 'short' })} - ${new Date(competition.end_date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`
    : competition.season || "TBA";

  return (
    <Link
      href={`/sports/${competition.sport}/${competition.slug}`}
      className="group flex flex-col bg-news-card rounded-3xl p-5 shadow-sm border border-news-border hover:shadow-md transition-shadow hover:border-gray-300"
    >
      {/* Top Row: Badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] md:text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${statusColorClass}`}>
            {statusText}
          </span>
          <span className="text-[10px] md:text-[11px] font-bold text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 px-3 py-1 rounded-full uppercase tracking-wider">
            {competition.sport || "CRICKET"}
          </span>
        </div>
        <span className="text-[11px] md:text-xs font-bold text-news-text uppercase">{competition.competition_type || "TOURNAMENT"}</span>
      </div>

      {/* Middle Row: Title and Logo */}
      <div className="flex items-center gap-4 px-2 mb-4">
        {competition.logo_url ? (
          <Image src={competition.logo_url} alt={competition.title} width={64} height={64} className="w-12 h-12 md:w-16 md:h-16 object-contain" unoptimized />
        ) : (
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-news-border flex items-center justify-center font-bold text-sm md:text-lg shrink-0">
            <Trophy className="w-6 h-6 text-news-text-secondary" />
          </div>
        )}
        
        <div className="flex flex-col gap-1">
          <h3 className="text-base md:text-lg font-bold text-news-text line-clamp-2 leading-tight">
            {competition.title}
          </h3>
        </div>
      </div>

      {/* Bottom Row: Date */}
      <div className="flex items-center justify-between border-t border-news-border pt-3 mt-auto">
        <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary truncate mr-2">
          {competition.title}
        </span>
        <span className="text-[12px] md:text-[13px] font-medium text-news-text-secondary shrink-0">
          {formattedDate}
        </span>
      </div>
    </Link>
  );
}
