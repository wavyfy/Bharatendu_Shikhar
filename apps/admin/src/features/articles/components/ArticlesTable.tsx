"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteArticleAction, publishArticleAction } from "../actions";
import type { ArticleWithRelations } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Eye, Trash2, Globe, Archive } from "lucide-react";

interface ArticlesTableProps {
  articles: ArticleWithRelations[];
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<number | null>(null);

  async function handleDelete(article: ArticleWithRelations) {
    const ok = await confirm({
      title: `Delete "${article.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteArticleAction(article.id);
      
      if (res.success) {
        toast.success(`"${article.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete article");
      }
    });
  }

  async function handleTogglePublish(id: number, currentStatus: "draft" | "published") {
    const newStatus = currentStatus === "draft" ? "published" : "draft";
    
    setProcessingId(id);
    const res = await publishArticleAction(id, newStatus);
    setProcessingId(null);
    
    if (res.success) {
      router.refresh();
    } else {
      toast.error(res.error ?? "Failed to update article status");
    }
  }

  if (articles.length === 0) {
    return (
      <EmptyState
        title="No articles found"
        description="Get started by creating your first article."
        actionLabel="Create Article"
        actionHref="/articles/new"
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium">Created Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                {article.title}
              </td>
              <td className="px-6 py-4">
                <StatusBadge variant={article.status === 'published' ? 'published' : 'draft'} />
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {article.author?.full_name || "—"}
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {new Date(article.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <ActionMenu
                  items={[
                    {
                      label: "Preview",
                      icon: <Eye strokeWidth={1.5} />,
                      href: `/articles/${article.id}/preview`,
                      disabled: processingId === article.id || isPending,
                    },
                    {
                      label: "Edit",
                      icon: <Pencil strokeWidth={1.5} />,
                      href: `/articles/${article.id}/edit`,
                      disabled: isPending,
                    },
                    {
                      label: article.status === "draft" ? "Publish" : "Unpublish",
                      icon: article.status === "draft" ? <Globe strokeWidth={1.5} /> : <Archive strokeWidth={1.5} />,
                      onClick: () => handleTogglePublish(article.id, article.status),
                      disabled: processingId === article.id || isPending,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 strokeWidth={1.5} />,
                      onClick: () => handleDelete(article),
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
