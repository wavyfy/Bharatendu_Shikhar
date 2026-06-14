"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteArticleAction, publishArticleAction } from "../actions";
import type { ArticleWithRelations } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Eye, Trash2, Globe, Archive, Radio } from "lucide-react";

interface ArticlesTableProps {
  articles: ArticleWithRelations[];
}

export function ArticlesTable({ articles }: ArticlesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams?.get("page") || "1", 10);
  const serialStart = (currentPage - 1) * 10;
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
    <div className="w-full min-w-full p-5">
      <div className="overflow-x-auto rounded-xl border border-outline-variant">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-6 py-3 w-16 font-medium">S.No.</th>
              <th className="px-6 py-3 font-medium">Title</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Author</th>
              <th className="px-6 py-3 font-medium">Created Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
          {articles.map((article, index) => (
            <tr key={article.id} className="hover:bg-surface-container-low transition-colors duration-150">
              <td className="px-6 py-4 text-gray-500 dark:text-slate-400 font-medium">{serialStart + index + 1}</td>
              <td className="px-6 py-4 font-medium text-on-surface max-w-xs truncate">
                {article.title}
              </td>
              <td className="px-6 py-4">
                <StatusBadge variant={article.status === 'published' ? 'published' : 'draft'} />
              </td>
              <td className="px-6 py-4 text-outline">
                {article.author?.full_name || "—"}
              </td>
              <td className="px-6 py-4 text-outline">
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
                    ...(article.is_live
                      ? [
                          {
                            label: "Live Timeline",
                            icon: <Radio strokeWidth={1.5} className="text-red-500" />,
                            href: `/articles/${article.id}/live-updates`,
                            disabled: isPending,
                          },
                        ]
                      : []),
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
