"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Spinner } from "@/components/ui/Spinner";
import { createLiveUpdateAction, updateLiveUpdateAction } from "../actions/liveUpdates";
import type { LiveUpdateRow } from "../types";

interface LiveUpdateModalProps {
  articleId: number;
  editingUpdate?: LiveUpdateRow | null;
  onClose: () => void;
}

export function LiveUpdateModal({ articleId, editingUpdate, onClose }: LiveUpdateModalProps) {
  const toast = useToast();
  const isEditing = !!editingUpdate;

  const [headline, setHeadline] = useState(editingUpdate?.headline ?? "");
  const [content, setContent] = useState(editingUpdate?.content ?? "");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result = isEditing
        ? await updateLiveUpdateAction(editingUpdate!.id, { headline, content }, articleId)
        : await createLiveUpdateAction(articleId, { headline, content });

      if (result.success) {
        toast.success(isEditing ? "Update saved." : "Update added.");
        onClose();
      } else {
        toast.error(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    // Overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-update-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-surface rounded-xl shadow-2xl w-full max-w-lg border border-outline-variant overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-container-high">
          <h2
            id="live-update-modal-title"
            className="text-base font-semibold text-on-surface"
          >
            {isEditing ? "Edit Live Update" : "Add Live Update"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface transition-colors p-1 rounded"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Timestamp (read-only in edit) */}
          {isEditing && (
            <div className="flex items-center gap-2 text-xs text-on-surface-variant bg-surface-container px-3 py-2 rounded-md">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
              </svg>
              <span>
                Originally posted: {new Date(editingUpdate!.created_at).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}

          {/* Headline */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lu-headline" className="text-sm font-medium text-on-surface">
              Headline <span className="text-red-500">*</span>
            </label>
            <Input
              id="lu-headline"
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. BJP crosses majority mark"
              required
              disabled={isPending}
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="lu-content" className="text-sm font-medium text-on-surface">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              id="lu-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              disabled={isPending}
              placeholder="Full details of this update..."
              className="flex w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-shadow duration-150 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} isLoading={isPending}>
              {isEditing ? "Save Changes" : "Add Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
