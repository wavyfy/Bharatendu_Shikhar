"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteBadgeAction } from "../actions";
import type { BadgeRow } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Pencil, Trash2 } from "lucide-react";

interface BadgesTableProps {
  badges: BadgeRow[];
}

export function BadgesTable({ badges }: BadgesTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(badge: BadgeRow) {
    const ok = await confirm({
      title: `Delete "${badge.name}"?`,
      description: "This will remove the badge from all articles.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteBadgeAction(badge.id);
      if (res.success) {
        toast.success(`"${badge.name}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete badge.");
      }
    });
  }

  if (badges.length === 0) {
    return (
      <EmptyState
        title="No badges yet"
        description="Create labels like Breaking News, Live, or Exclusive."
        actionLabel="Create Badge"
        actionHref="/badges/new"
      />
    );
  }

  return (
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Badge</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Color</th>
              <th className="px-6 py-3 font-medium">Created</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {badges.map((badge) => (
              <tr
                key={badge.id}
                className="hover:bg-surface-container-low transition-colors duration-150"
              >
                <td className="px-6 py-4">
                  <span
                    className="inline-flex items-center gap-2 px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.name}
                  </span>
                </td>
                <td className="px-6 py-4 text-outline font-mono text-xs">
                  {badge.slug}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-5 h-5 rounded border border-outline-variant shrink-0"
                      style={{ backgroundColor: badge.color }}
                    />
                    <span className="text-on-surface-variant font-mono text-xs">
                      {badge.color}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-outline">
                  {new Date(badge.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/badges/${badge.id}/edit`,
                        disabled: isPending,
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 strokeWidth={1.5} />,
                        onClick: () => handleDelete(badge),
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
