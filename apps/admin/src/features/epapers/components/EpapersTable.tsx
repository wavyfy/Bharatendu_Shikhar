"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteEpaperAction } from "../actions";
import type { EpaperWithRelations } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, FileText } from "lucide-react";

interface EpapersTableProps {
  epapers: EpaperWithRelations[];
}

export function EpapersTable({ epapers }: EpapersTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(epaper: EpaperWithRelations) {
    const ok = await confirm({
      title: `Delete "${epaper.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteEpaperAction(epaper.id);
      
      if (res.success) {
        toast.success(`"${epaper.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete E-Paper");
      }
    });
  }

  if (epapers.length === 0) {
    return (
      <EmptyState
        title="No e-papers found"
        description="Get started by uploading your first e-paper."
        actionLabel="Upload E-Paper"
        actionHref="/epapers/new"
      />
    );
  }

  return (
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Title & Region</th>
              <th className="px-6 py-3 font-medium">Published Date</th>
              <th className="px-6 py-3 font-medium">Expiry Date</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
          {epapers.map((epaper) => {
            const isExpired = epaper.expiry_date && new Date(epaper.expiry_date) < new Date();
            const isPublished = epaper.published_at && new Date(epaper.published_at) <= new Date();

            return (
              <tr key={epaper.id} className="hover:bg-surface-container-low transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-on-surface">
                  <div className="truncate max-w-[250px]">{epaper.title}</div>
                  <div className="text-xs text-outline mt-1">
                    {epaper.region?.name || "No Region"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-1">
                    {epaper.published_at ? (
                      <span className="text-on-surface-variant">
                        {new Date(epaper.published_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-outline-variant italic">Not set</span>
                    )}
                    <StatusBadge variant={isPublished ? 'published' : 'draft'} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  {epaper.expiry_date ? (
                    <div className="flex flex-col items-start gap-1">
                      <span className={isExpired ? "text-red-500 line-through" : "text-on-surface-variant"}>
                        {new Date(epaper.expiry_date).toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <StatusBadge variant="expired" />
                      )}
                    </div>
                  ) : (
                    <span className="text-outline-variant italic">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-outline">
                  {epaper.author?.full_name || "—"}
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionMenu
                    items={[
                      {
                        label: "View PDF",
                        icon: <FileText strokeWidth={1.5} />,
                        href: epaper.pdf_url,
                      },
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/epapers/${epaper.id}/edit`,
                        disabled: isPending,
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 strokeWidth={1.5} />,
                        onClick: () => handleDelete(epaper),
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
