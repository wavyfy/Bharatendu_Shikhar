"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteElectionAction, toggleElectionPublishAction } from "../actions";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Globe, Archive, Trash2 } from "lucide-react";
import Link from "next/link";

interface ElectionsTableProps {
  elections: any[];
}

export function ElectionsTable({ elections }: ElectionsTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  async function handleDelete(election: any) {
    const ok = await confirm({
      title: `Delete "${election.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteElectionAction(election.id);
      if (res.success) {
        toast.success(`"${election.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete election");
      }
    });
  }

  async function handleTogglePublish(id: string, currentStatus: boolean) {
    setProcessingId(id);
    const res = await toggleElectionPublishAction(id, !currentStatus);
    setProcessingId(null);
    
    if (res.success) {
      toast.success(currentStatus ? "Election drafted" : "Election published");
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to update election status");
    }
  }

  if (elections.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">how_to_vote</span>
        <p className="text-lg font-medium">No elections found</p>
        <p className="text-sm mt-1 mb-4 opacity-75">Get started by creating a new election.</p>
        <Link href="/elections/new" className="btn-cms-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Election
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
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Region</th>
              <th className="px-6 py-3 font-medium">Visibility</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Voting Date</th>
              <th className="px-6 py-3 font-medium">Created By</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
          {elections.map((election, index) => {
            const regionName = election.region?.name || "Global";
            const authorName = election.author?.full_name || "Unknown";

            return (
              <tr key={election.id} className="hover:bg-surface-container-low transition-colors duration-150">
                <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 font-medium">{index + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface max-w-xs truncate">
                  {election.title}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">{regionName}</td>
                <td className="px-6 py-4">
                  <StatusBadge variant={election.is_published ? 'published' : 'draft'} />
                </td>
                <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                  election.status === "upcoming" ? "bg-primary/10 text-primary" :
                  election.status === "live" ? "bg-red-500/10 text-red-500" :
                  "bg-green-500/10 text-green-600"
                }`}>
                  {election.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                  {election.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                {election.voting_date ? new Date(election.voting_date).toLocaleDateString() : "TBD"}
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">{authorName}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <ActionMenu
                  items={[
                    {
                      label: "Edit",
                      icon: <Pencil strokeWidth={1.5} />,
                      href: `/elections/${election.id}`,
                      disabled: isPending,
                    },
                    {
                      label: !election.is_published ? "Publish" : "Unpublish",
                      icon: !election.is_published ? <Globe strokeWidth={1.5} /> : <Archive strokeWidth={1.5} />,
                      onClick: () => handleTogglePublish(election.id, election.is_published),
                      disabled: processingId === election.id || isPending,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 strokeWidth={1.5} />,
                      onClick: () => handleDelete(election),
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
