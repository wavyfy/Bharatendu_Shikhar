"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRegionAction } from "../actions";
import type { RegionRow } from "../types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { Pencil, Trash2 } from "lucide-react";

interface RegionsTableProps {
  regions: RegionRow[];
}

export function RegionsTable({ regions }: RegionsTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(region: RegionRow) {
    const ok = await confirm({
      title: `Delete "${region.name}"?`,
      description: "This will fail if any articles are attached to this region.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await deleteRegionAction(region.id);
      if (res.success) {
        toast.success(`"${region.name}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete region.");
      }
    });
  }

  if (regions.length === 0) {
    return (
      <EmptyState
        title="No regions yet"
        description="Regions group content by geography. Create one to get started."
        actionLabel="Add Region"
        actionHref="/regions/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 dark:text-slate-400 uppercase bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-600">
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Slug</th>
            <th className="px-6 py-3 font-medium">Created</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
          {regions.map((region) => (
            <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{region.name}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs">{region.slug}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400">
                {new Date(region.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <ActionMenu
                  items={[
                    {
                      label: "Edit",
                      icon: <Pencil strokeWidth={1.5} />,
                      href: `/regions/${region.id}/edit`,
                      disabled: isPending,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 strokeWidth={1.5} />,
                      onClick: () => handleDelete(region),
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
  );
}
