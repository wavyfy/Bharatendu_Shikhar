"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  deleteCompetitionAction,
  toggleCompetitionPublishAction,
} from "../actions";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Globe, Archive, Trash2 } from "lucide-react";
import Link from "next/link";

interface CompetitionsTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  competitions: any[];
}

const SPORT_STYLES: Record<string, string> = {
  cricket: "bg-green-500/10 text-green-600",
  football: "bg-blue-500/10 text-blue-600",
};

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-primary/10 text-primary",
  live: "bg-red-500/10 text-red-500",
  completed: "bg-green-500/10 text-green-600",
};

export function CompetitionsTable({ competitions }: CompetitionsTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDelete(comp: any) {
    const ok = await confirm({
      title: `Delete "${comp.title}"?`,
      description: "All associated points table entries will be deleted. Matches will be unlinked.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteCompetitionAction(comp.id);
      if (res.success) {
        toast.success(`"${comp.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete");
      }
    });
  }

  async function handleTogglePublish(id: string, current: boolean) {
    setProcessingId(id);
    const res = await toggleCompetitionPublishAction(id, !current);
    setProcessingId(null);
    if (res.success) {
      toast.success(current ? "Unpublished" : "Published");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed");
    }
  }

  if (competitions.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">
          emoji_events
        </span>
        <p className="text-lg font-medium">No competitions yet</p>
        <p className="text-sm mt-1 mb-4 opacity-75">Create your first tournament or series.</p>
        <Link href="/sports/competitions/new" className="btn-cms-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Competition
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
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Sport</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Season</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Visibility</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {competitions.map((comp, index) => (
              <tr
                key={comp.id}
                className="hover:bg-surface-container-low transition-colors duration-150"
              >
                <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 font-medium">
                  {index + 1}
                </td>
                <td className="px-6 py-4 font-medium text-on-surface max-w-xs truncate">
                  {comp.title}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                      SPORT_STYLES[comp.sport] || "bg-surface-container text-on-surface-variant"
                    }`}
                  >
                    {comp.sport}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">
                  {comp.competition_type}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">
                  {comp.season || "—"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                      STATUS_STYLES[comp.status] || ""
                    }`}
                  >
                    {comp.status === "live" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    )}
                    {comp.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge variant={comp.is_published ? "published" : "draft"} />
                </td>
                <td className="px-6 py-4 text-right whitespace-nowrap">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/sports/competitions/${comp.id}`,
                        disabled: isPending,
                      },
                      {
                        label: comp.is_published ? "Unpublish" : "Publish",
                        icon: comp.is_published ? (
                          <Archive strokeWidth={1.5} />
                        ) : (
                          <Globe strokeWidth={1.5} />
                        ),
                        onClick: () => handleTogglePublish(comp.id, comp.is_published),
                        disabled: processingId === comp.id || isPending,
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 strokeWidth={1.5} />,
                        onClick: () => handleDelete(comp),
                        variant: "danger",
                        disabled: isPending,
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
