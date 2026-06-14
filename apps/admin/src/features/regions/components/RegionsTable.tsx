"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { deleteRegionAction, toggleRegionActiveAction } from "../actions";
import type { RegionRow } from "../types";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, Ban, CheckCircle } from "lucide-react";

interface RegionsTableProps {
  regions: RegionRow[];
}

export function RegionsTable({ regions }: RegionsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1", 10);
  const serialStart = (currentPage - 1) * 10;
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

  async function handleToggleActive(region: RegionRow) {
    const action = region.is_active ? "deactivate" : "reactivate";
    const ok = await confirm({
      title: `${region.is_active ? "Deactivate" : "Reactivate"} "${region.name}"?`,
      description: region.is_active
        ? "This region will be hidden from new e-papers and articles."
        : "This region will be available again.",
      confirmLabel: region.is_active ? "Deactivate" : "Reactivate",
      destructive: region.is_active,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await toggleRegionActiveAction(region.id, !region.is_active);
      if (res.success) {
        toast.success(`"${region.name}" ${action}d.`);
        router.refresh();
      } else {
        toast.error(res.error ?? `Failed to ${action} region.`);
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
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
        <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
          <tr>
            <th className="px-6 py-3 w-16 font-medium">S.No.</th>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Slug</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Created</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface">
          {regions.map((region, index) => (
            <tr key={region.id} className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium">{serialStart + index + 1}</td>
              <td className="px-6 py-4 font-medium text-gray-900 dark:text-slate-100">{region.name}</td>
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-mono text-xs">{region.slug}</td>
              <td className="px-6 py-4">
                <StatusBadge variant={region.is_active ? "active" : "inactive"} />
              </td>
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
                      label: region.is_active ? "Deactivate" : "Reactivate",
                      icon: region.is_active ? <Ban strokeWidth={1.5} /> : <CheckCircle strokeWidth={1.5} />,
                      onClick: () => handleToggleActive(region),
                      variant: region.is_active ? "danger" : "default",
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
    </div>
  );
}
