"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRegionAction } from "../actions";
import type { RegionRow } from "../types";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

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
    <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Slug</th>
            <th className="px-6 py-3 font-medium">Created</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {regions.map((region) => (
            <tr key={region.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{region.name}</td>
              <td className="px-6 py-4 text-gray-500 font-mono text-xs">{region.slug}</td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(region.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Link href={`/regions/${region.id}/edit`}>
                  <Button variant="secondary" size="sm" disabled={isPending}>
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(region)}
                  disabled={isPending}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
