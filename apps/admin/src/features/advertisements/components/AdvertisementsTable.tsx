"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { deleteAdvertisementAction, updateAdvertisementStatusAction } from "../actions";
import type { AdvertisementRow } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, Power, PowerOff } from "lucide-react";

interface AdvertisementsTableProps {
  advertisements: AdvertisementRow[];
}

export function AdvertisementsTable({ advertisements }: AdvertisementsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1", 10);
  const serialStart = (currentPage - 1) * 10;
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(ad: AdvertisementRow) {
    const ok = await confirm({
      title: `Delete "${ad.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteAdvertisementAction(ad.id);
      
      if (res.success) {
        toast.success(`"${ad.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete advertisement");
      }
    });
  }

  async function handleToggleStatus(ad: AdvertisementRow) {
    const newStatus = !ad.is_active;
    startTransition(async () => {
      const res = await updateAdvertisementStatusAction(ad.id, newStatus);
      if (res.success) {
        toast.success(`Advertisement ${newStatus ? 'activated' : 'deactivated'}.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to update status");
      }
    });
  }

  const getStatusVariant = (ad: AdvertisementRow): "active" | "inactive" | "expired" | "scheduled" => {
    const now = new Date();
    const startDate = new Date(ad.start_date);
    const endDate = new Date(ad.end_date);

    if (!ad.is_active) return "inactive";
    if (now > endDate) return "expired";
    if (now >= startDate && now <= endDate) return "active";
    if (now < startDate) return "scheduled";

    return "inactive";
  };

  if (advertisements.length === 0) {
    return (
      <EmptyState
        title="No advertisements found"
        description="Get started by creating your first advertisement."
        actionLabel="Create Advertisement"
        actionHref="/advertisements/create"
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
              <th className="px-6 py-3 font-medium">Ad Info</th>
              <th className="px-6 py-3 font-medium">Advertiser</th>
              <th className="px-6 py-3 font-medium">Start Date</th>
              <th className="px-6 py-3 font-medium">End Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
          {advertisements.map((ad, index) => {
            const statusVariant = getStatusVariant(ad);
            const isExpired = statusVariant === "expired";

            return (
              <tr key={ad.id} className="hover:bg-surface-container-low transition-colors duration-150">
                <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium">{serialStart + index + 1}</td>
                <td className="px-6 py-4 font-medium text-on-surface">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-10 rounded overflow-hidden bg-slate-100 shrink-0 border border-outline-variant">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ad.image_url} alt="Ad Thumbnail" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="truncate max-w-[250px]">{ad.title}</div>
                      {ad.redirect_url && (
                        <a href={ad.redirect_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-600 hover:underline truncate max-w-[250px]">
                          {ad.redirect_url}
                        </a>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-outline">
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-medium text-on-surface">{ad.advertiser_name}</span>
                    {ad.advertiser_phone && (
                      <span className="text-xs text-outline-variant">{ad.advertiser_phone}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-on-surface-variant text-sm">{new Date(ad.start_date).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={isExpired ? "text-red-500 line-through text-sm" : "text-on-surface-variant text-sm"}>
                    {new Date(ad.end_date).toLocaleDateString()}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge variant={statusVariant} />
                </td>
                <td className="px-6 py-4 text-right">
                  <ActionMenu
                    items={[
                      {
                        label: "Edit",
                        icon: <Pencil strokeWidth={1.5} />,
                        href: `/advertisements/${ad.id}/edit`,
                        disabled: isPending,
                      },
                      {
                        label: ad.is_active ? "Deactivate" : "Activate",
                        icon: ad.is_active ? <PowerOff strokeWidth={1.5} /> : <Power strokeWidth={1.5} />,
                        onClick: () => handleToggleStatus(ad),
                        disabled: isPending,
                      },
                      {
                        label: "Delete",
                        icon: <Trash2 strokeWidth={1.5} />,
                        onClick: () => handleDelete(ad),
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
