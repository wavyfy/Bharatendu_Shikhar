"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { LiveUpdateModal } from "./LiveUpdateModal";
import { deleteLiveUpdateAction } from "../actions/liveUpdates";
import type { LiveUpdateRow } from "../types";
import { Pencil, Trash2, PlusCircle, Radio } from "lucide-react";

interface LiveUpdatesSectionProps {
  articleId: number;
  initialUpdates: LiveUpdateRow[];
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
}

/**
 * Renders an interactive timeline section for managing live updates on an article.
 *
 * Displays timestamped updates in newest-first order with options to add, edit,
 * or delete individual updates.
 */
export function LiveUpdatesSection({ articleId, initialUpdates }: LiveUpdatesSectionProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<LiveUpdateRow | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Sort newest first (server already orders, but guard client-side too)
  const updates = [...initialUpdates].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  function openAddModal() {
    setEditingUpdate(null);
    setModalOpen(true);
  }

  function openEditModal(update: LiveUpdateRow) {
    setEditingUpdate(update);
    setModalOpen(true);
  }

  function handleModalClose() {
    setModalOpen(false);
    setEditingUpdate(null);
    // Refresh to reflect server state
    router.refresh();
  }

  async function handleDelete(update: LiveUpdateRow) {
    const ok = await confirm({
      title: "Delete this update?",
      description: `"${update.headline}" will be permanently removed.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;

    setDeletingId(update.id);
    startTransition(async () => {
      const res = await deleteLiveUpdateAction(update.id, articleId);
      setDeletingId(null);
      if (res.success) {
        toast.success("Update deleted.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete update.");
      }
    });
  }

  return (
    <>
      {/* Section card */}
      <div className="cms-card m-4 sm:m-6 shadow-md">
        {/* Header */}
        <div className="cms-card-header border-b border-outline-variant px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {/* Pulsing live indicator */}
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <h2 className="text-lg font-bold leading-tight text-on-surface tracking-wide">
                Live Updates
              </h2>
              <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full border border-outline-variant">
                {updates.length}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400 font-medium">
              Timeline entries — newest first. Each update is timestamped automatically.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={openAddModal}
            disabled={isPending}
            className="flex items-center gap-1.5 shrink-0"
          >
            <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
            Add Update
          </Button>
        </div>

        {/* Updates list */}
        <div className="bg-transparent rounded-b-xl">
          {updates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-6">
              <Radio className="w-10 h-10 text-slate-300 mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-on-surface-variant">No updates yet</p>
              <p className="text-xs text-slate-400 mt-1">
                Click &ldquo;Add Update&rdquo; to post the first timeline entry.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-outline-variant">
              {updates.map((update, index) => (
                <div
                  key={update.id}
                  className="relative flex gap-4 px-6 py-5 hover:bg-surface-container-low transition-colors duration-150 group"
                >
                  {/* Timeline rail */}
                  <div className="flex flex-col items-center pt-1 shrink-0">
                    {/* Dot */}
                    <div className={`
                      w-2.5 h-2.5 rounded-full border-2 shrink-0
                      ${index === 0
                        ? "bg-red-500 border-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]"
                        : "bg-surface border-outline-variant"
                      }
                    `} />
                    {/* Vertical line — hide for last item */}
                    {index < updates.length - 1 && (
                      <div className="w-px flex-1 bg-outline-variant mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Timestamp */}
                    <time
                      dateTime={update.created_at}
                      className="text-xs font-semibold text-primary uppercase tracking-wide"
                    >
                      {formatTimestamp(update.created_at)}
                    </time>

                    <h3 className="mt-1 text-sm font-semibold text-on-surface leading-snug">
                      {update.headline}
                    </h3>

                    <div 
                      className="mt-1 text-sm text-on-surface-variant leading-relaxed line-clamp-3 [&>p]:mb-0 [&>p]:mt-1"
                      dangerouslySetInnerHTML={{ __html: update.content }}
                    />

                    {/* Updated indicator */}
                    {update.updated_at !== update.created_at && (
                      <p className="mt-1.5 text-xs text-slate-400">
                        Edited {formatTimestamp(update.updated_at)}
                      </p>
                    )}
                  </div>

                  {/* Actions — shown on hover */}
                  <div className="flex items-start gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button
                      type="button"
                      title="Edit update"
                      onClick={() => openEditModal(update)}
                      disabled={isPending}
                      className="p-1.5 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                    </button>
                    <button
                      type="button"
                      title="Delete update"
                      onClick={() => handleDelete(update)}
                      disabled={isPending || deletingId === update.id}
                      className="p-1.5 rounded text-on-surface-variant hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {deletingId === update.id ? (
                        <Spinner size="sm" className="text-red-500" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <LiveUpdateModal
          articleId={articleId}
          editingUpdate={editingUpdate}
          onClose={handleModalClose}
        />
      )}
    </>
  );
}
