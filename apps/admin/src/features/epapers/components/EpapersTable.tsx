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
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 font-medium">Title & Region</th>
              <th className="px-6 py-3 font-medium">Published Date</th>
              <th className="px-6 py-3 font-medium">Expiry Date</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
          {epapers.map((epaper) => {
            const isExpired = epaper.expiry_date && new Date(epaper.expiry_date) < new Date();
            const isPublished = epaper.published_at && new Date(epaper.published_at) <= new Date();

            return (
              <tr key={epaper.id} className="hover:bg-slate-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium text-slate-900">
                  <div className="truncate max-w-[250px]">{epaper.title}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {epaper.region?.name || "No Region"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-1">
                    {epaper.published_at ? (
                      <span className="text-slate-600">
                        {new Date(epaper.published_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Not set</span>
                    )}
                    <StatusBadge variant={isPublished ? 'published' : 'draft'} />
                  </div>
                </td>
                <td className="px-6 py-4">
                  {epaper.expiry_date ? (
                    <div className="flex flex-col items-start gap-1">
                      <span className={isExpired ? "text-red-500 line-through" : "text-slate-600"}>
                        {new Date(epaper.expiry_date).toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <StatusBadge variant="expired" />
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {epaper.author?.full_name || "Unknown"}
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
