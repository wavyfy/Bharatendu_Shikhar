import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";

interface CompetitionMatchesListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary",
  live: "bg-red-500/10 text-red-500",
  completed: "bg-green-500/10 text-green-600",
};

export function CompetitionMatchesList({ matches }: CompetitionMatchesListProps) {
  if (matches.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50 block">
          sports_cricket
        </span>
        <p className="text-sm">No matches linked to this competition yet.</p>
        <Link href="/sports/matches/new" className="btn-cms-primary mt-4 inline-flex">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Match
        </Link>
      </div>
    );
  }

  // Group by stage
  const stages = Array.from(new Set(matches.map((m) => m.stage || ""))).sort();

  return (
    <div className="p-5 space-y-6">
      {stages.map((stage) => {
        const stageMatches = matches.filter((m) => (m.stage || "") === stage);
        return (
          <div key={stage}>
            {stage && (
              <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 px-1">
                {stage}
              </h3>
            )}
            <div className="space-y-2">
              {stageMatches.map((match) => {
                const home = match.home_team?.name || match.home_team_name || "Home";
                const away = match.away_team?.name || match.away_team_name || "Away";
                return (
                  <Link
                    key={match.id}
                    href={`/sports/matches/${match.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                          STATUS_STYLES[match.status] || ""
                        }`}
                      >
                        {match.status === "live" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                        {match.status}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-on-surface text-sm group-hover:text-primary transition-colors truncate">
                          {home} vs {away}
                        </p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-on-surface-variant">
                          {match.match_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(match.match_date).toLocaleDateString()}
                            </span>
                          )}
                          {match.venue && (
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 shrink-0" />
                              {match.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      {match.status !== "upcoming" && (match.home_score || match.away_score) ? (
                        <p className="text-sm font-bold font-mono text-on-surface">
                          {match.home_score || "—"} : {match.away_score || "—"}
                        </p>
                      ) : null}
                      {match.result_text && (
                        <p className="text-[10px] text-on-surface-variant mt-0.5 max-w-[140px] text-right">
                          {match.result_text}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
