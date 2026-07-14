"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMatchAction, toggleMatchPublishAction } from "../actions";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Globe, Archive, Trash2, BarChart2, Radio } from "lucide-react";
import Link from "next/link";

interface MatchesTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[];
}

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary",
  live: "bg-red-500/10 text-red-500",
  completed: "bg-green-500/10 text-green-600",
};

const SPORT_STYLES: Record<string, string> = {
  cricket: "bg-green-500/10 text-green-600",
  football: "bg-blue-500/10 text-blue-600",
};

export function MatchesTable({ matches }: MatchesTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDelete(match: any) {
    const ok = await confirm({
      title: `Delete "${match.title}"?`,
      description: "All updates will be deleted. This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteMatchAction(match.id);
      if (res.success) {
        toast.success(`"${match.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete");
      }
    });
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setProcessingId(id);
    const res = await toggleMatchPublishAction(id, !current);
    setProcessingId(null);
    if (res.success) {
      toast.success(current ? "Unpublished" : "Published");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed");
    }
  }

  if (matches.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">
          sports_cricket
        </span>
        <p className="text-lg font-medium">No matches yet</p>
        <p className="text-sm mt-1 mb-4 opacity-75">Schedule your first match.</p>
        <Link href="/sports/matches/new" className="btn-cms-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Match
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3 w-16 text-center font-medium">S.No.</th>
              <th className="px-6 py-3 font-medium">Match</th>
              <th className="px-6 py-3 font-medium">Sport</th>
              <th className="px-6 py-3 font-medium">Competition</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Visibility</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {matches.map((match, index) => {
              const home =
                match.home_team?.name || match.home_team_name || "Home";
              const away =
                match.away_team?.name || match.away_team_name || "Away";
              return (
                <tr
                  key={match.id}
                  className="hover:bg-surface-container-low transition-colors duration-150"
                >
                  <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="font-medium text-on-surface truncate">
                      {home} vs {away}
                    </div>
                    {match.stage && (
                      <div className="text-xs text-on-surface-variant mt-0.5">
                        {match.stage}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        SPORT_STYLES[match.sport] || ""
                      }`}
                    >
                      {match.sport}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {match.competition?.title || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        STATUS_STYLES[match.status] || ""
                      }`}
                    >
                      {match.status === "live" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      )}
                      {match.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                    {match.match_date
                      ? new Date(match.match_date).toLocaleDateString()
                      : "TBD"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge
                      variant={match.is_published ? "published" : "draft"}
                    />
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <ActionMenu
                      items={[
                        {
                          label: "Edit",
                          icon: <Pencil strokeWidth={1.5} />,
                          href: `/sports/matches/${match.id}`,
                          disabled: isPending,
                        },
                        {
                          label: "Score & Result",
                          icon: <BarChart2 strokeWidth={1.5} />,
                          href: `/sports/matches/${match.id}?tab=score`,
                          disabled: isPending,
                        },
                        {
                          label: "Live Updates",
                          icon: <Radio strokeWidth={1.5} />,
                          href: `/sports/matches/${match.id}?tab=updates`,
                          disabled: isPending,
                        },
                        {
                          label: match.is_published ? "Unpublish" : "Publish",
                          icon: match.is_published ? (
                            <Archive strokeWidth={1.5} />
                          ) : (
                            <Globe strokeWidth={1.5} />
                          ),
                          onClick: () =>
                            handleTogglePublish(match.id, match.is_published),
                          disabled: processingId === match.id || isPending,
                        },
                        {
                          label: "Delete",
                          icon: <Trash2 strokeWidth={1.5} />,
                          onClick: () => handleDelete(match),
                          variant: "danger",
                          disabled: isPending,
                        },
                      ]}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
