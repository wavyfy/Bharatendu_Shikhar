"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteTeamAction } from "../actions";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface TeamsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teams: any[];
}

export function TeamsTable({ teams }: TeamsTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDelete(team: any) {
    const ok = await confirm({
      title: `Delete "${team.name}"?`,
      description: "This cannot be undone. Matches using this team will lose the FK reference.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    setProcessingId(team.id);
    startTransition(async () => {
      const res = await deleteTeamAction(team.id);
      setProcessingId(null);
      if (res.success) {
        toast.success(`"${team.name}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete team");
      }
    });
  }

  if (teams.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">
          sports_cricket
        </span>
        <p className="text-lg font-medium">No teams yet</p>
        <p className="text-sm mt-1 mb-4 opacity-75">Add teams to use in matches.</p>
        <Link href="/sports/teams/new" className="btn-cms-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add Team
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
              <th className="px-6 py-3 w-16 font-medium text-center">S.No.</th>
              <th className="px-6 py-3 font-medium">Team</th>
              <th className="px-6 py-3 font-medium">Short</th>
              <th className="px-6 py-3 font-medium">Sport</th>
              <th className="px-6 py-3 font-medium">Country</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {teams.map((team, index) => (
              <tr
                key={team.id}
                className="hover:bg-surface-container-low transition-colors duration-150"
              >
                <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-on-surface">
                  <div className="flex items-center gap-3">
                    {team.logo_url ? (
                      <Image
                        src={team.logo_url}
                        alt={team.name}
                        width={28}
                        height={28}
                        className="rounded-full object-cover shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                          sports_cricket
                        </span>
                      </div>
                    )}
                    {team.name}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant font-mono">
                  {team.short_name || "—"}
                </td>
                <td className="px-6 py-4">
                  {team.sport ? (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                        team.sport === "cricket"
                          ? "bg-green-500/10 text-green-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {team.sport}
                    </span>
                  ) : (
                    <span className="text-on-surface-variant text-xs">Multi-sport</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {team.country || "—"}
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/sports/teams/${team.id}`,
                        disabled: isPending,
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 strokeWidth={1.5} />,
                        onClick: () => handleDelete(team),
                        variant: "danger",
                        disabled: isPending || processingId === team.id,
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
