import Image from "next/image";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Table({ rows, isCricket }: { rows: any[]; isCricket: boolean }) {
  const hasForm = rows.some((r) => Array.isArray(r.form) && r.form.length > 0);

  return (
    <div className="overflow-x-auto overflow-y-auto max-h-[500px] pb-6 pr-2">
      <table className="w-full text-[15px] text-left border-separate border-spacing-y-2">
        <thead className="text-[14px] text-news-text-secondary font-medium">
          <tr>
            <th className="px-6 py-4 text-left font-normal w-[40%] min-w-[200px]">टीम</th>
            <th className="px-2 py-4 text-center font-normal w-[8%]">जी</th>
            <th className="px-2 py-4 text-center font-normal w-[8%]">ड्रा</th>
            <th className="px-2 py-4 text-center font-normal w-[8%]">हा</th>
            {isCricket && <th className="px-2 py-4 text-center font-normal w-[10%]">NRR</th>}
            {!isCricket && (
              <>
                <th className="px-2 py-4 text-center font-normal w-[8%]">GF</th>
                <th className="px-2 py-4 text-center font-normal w-[8%]">GA</th>
              </>
            )}
            <th className="px-2 py-4 text-center font-normal w-[8%]">अंक</th>
            {hasForm && <th className="px-6 py-4 text-left font-normal w-[15%] min-w-[120px]">अंतिम मैच</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((entry, i) => {
            const form = Array.isArray(entry.form) ? entry.form : [];
            const rowBg = "bg-[#e2e6eb] dark:bg-[#1e1e1e]";

            return (
              <tr key={entry.id} className={`${rowBg} transition-colors group`}>
                <td className="px-6 py-4 rounded-l-xl border-y border-l border-white dark:border-background">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold w-4 text-center">{i + 1}</span>
                    {(entry.team?.logo_url || entry.team_logo_url) ? (
                      <Image
                        src={entry.team?.logo_url || entry.team_logo_url}
                        alt={entry.team_name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-news-card shrink-0" />
                    )}
                    <span className="font-medium text-news-text whitespace-nowrap">{entry.team_name}</span>
                  </div>
                </td>
                <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">{entry.won ?? "-"}</td>
                <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">{entry.drawn ?? "-"}</td>
                <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">{entry.lost ?? "-"}</td>
                {isCricket && (
                  <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">
                    {entry.net_run_rate != null
                      ? (Number(entry.net_run_rate) >= 0 ? "+" : "") + Number(entry.net_run_rate).toFixed(3)
                      : "—"}
                  </td>
                )}
                {!isCricket && (
                  <>
                    <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">{entry.goals_for ?? "-"}</td>
                    <td className="px-2 py-4 text-center text-news-text-secondary border-y border-white dark:border-background">{entry.goals_against ?? "-"}</td>
                  </>
                )}
                <td className={`px-2 py-4 text-center text-news-text border-y border-white dark:border-background ${!hasForm ? 'rounded-r-xl border-r' : ''}`}>{entry.points ?? "-"}</td>
                {hasForm && (
                  <td className="px-6 py-4 text-left rounded-r-xl border-y border-r border-white dark:border-background">
                    <div className="flex items-center gap-1.5">
                      {form.map((result: string, idx: number) => {
                        if (result === "W") return <CheckCircle2 key={idx} className="w-[18px] h-[18px] text-[#22C55E] fill-[#22C55E]" />;
                        if (result === "L") return <XCircle key={idx} className="w-[18px] h-[18px] text-[#EF4444] fill-[#EF4444]" />;
                        return <MinusCircle key={idx} className="w-[18px] h-[18px] text-gray-400 fill-gray-400" />;
                      })}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PointsTable({ entries, sport }: { entries: any[]; sport: string }) {
  if (!entries || entries.length === 0) return null;

  // Group by group_name
  const groups = Array.from(new Set(entries.map((e) => e.group_name || ""))).sort();
  const hasGroups = groups.some((g) => g !== "");
  const isCricket = sport === "cricket";

  if (!hasGroups) {
    return <Table rows={entries} isCricket={isCricket} />;
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          {group && (
            <h4 className="text-xs font-bold uppercase tracking-wider text-news-text-secondary mb-2 px-6 pt-4">
              ग्रुप {group}
            </h4>
          )}
          <Table rows={entries.filter((e) => (e.group_name || "") === group)} isCricket={isCricket} />
        </div>
      ))}
    </div>
  );
}
