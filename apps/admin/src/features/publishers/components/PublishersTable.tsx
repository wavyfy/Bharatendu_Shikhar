"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { PublisherWithAuth } from "../types";
import { togglePublisherActiveAction } from "../actions";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Publisher</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Articles</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {publishers.map((pub) => (
              <tr key={pub.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{pub.full_name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{pub.email}</div>
                </td>
                <td className="px-6 py-4">
                  {pub.is_active ? (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-medium text-gray-900">{pub.article_count || 0}</span>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
                    new Date(pub.created_at)
                  )}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link href={`/publishers/${pub.id}/edit`}>
                    <Button variant="secondary" size="sm" disabled={isPending}>
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={pub.is_active ? "text-red-600 hover:bg-red-50" : "text-green-700 hover:bg-green-50"}
                    onClick={() => handleToggleActive(pub)}
                    disabled={isPending}
                  >
                    {pub.is_active ? "Deactivate" : "Reactivate"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
