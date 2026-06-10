"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { PublisherWithAuth } from "../types";
import { togglePublisherActiveAction } from "../actions";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Ban, CheckCircle } from "lucide-react";

export function PublishersTable({ publishers }: { publishers: PublisherWithAuth[] }) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleToggleActive(pub: PublisherWithAuth) {
    const action = pub.is_active ? "deactivate" : "reactivate";
    const ok = await confirm({
      title: `${pub.is_active ? "Deactivate" : "Reactivate"} "${pub.full_name}"?`,
      description: pub.is_active
        ? "They will be immediately blocked from logging in."
        : "They will be able to log in again.",
      confirmLabel: pub.is_active ? "Deactivate" : "Reactivate",
      destructive: pub.is_active,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await togglePublisherActiveAction(pub.id, !pub.is_active);
      if (res.success) {
        toast.success(`"${pub.full_name}" ${action}d.`);
        router.refresh();
      } else {
        toast.error(res.error ?? `Failed to ${action} publisher.`);
      }
    });
  }

  if (publishers.length === 0) {
    return (
      <EmptyState
        title="No publishers yet"
        description="Publishers can write and manage articles. Add your first publisher to get started."
        actionLabel="Add Publisher"
        actionHref="/publishers/new"
      />
    );
  }

  return (
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Articles</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {publishers.map((pub) => (
              <tr key={pub.id} className="hover:bg-surface-container-low transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 dark:text-slate-100">{pub.full_name}</div>
                  <div className="text-gray-500 dark:text-slate-400 text-xs mt-0.5">{pub.email}</div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge variant={pub.is_active ? "active" : "inactive"} />
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium text-gray-900 dark:text-slate-100">{pub.article_count || 0}</span>
                </td>
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                    new Date(pub.created_at)
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/publishers/${pub.id}/edit`,
                        disabled: isPending,
                      },
                      {
                        label: pub.is_active ? "Deactivate" : "Reactivate",
                        icon: pub.is_active ? <Ban strokeWidth={1.5} /> : <CheckCircle strokeWidth={1.5} />,
                        onClick: () => handleToggleActive(pub),
                        variant: pub.is_active ? "danger" : "default",
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
