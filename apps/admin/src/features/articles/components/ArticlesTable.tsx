"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteArticleAction, publishArticleAction } from "../actions";
import type { ArticleWithRelations } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

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
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500 mb-4">No articles found.</p>
        <Link href="/articles/new">
          <Button>Create your first article</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-medium">Title</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Author</th>
            <th className="px-6 py-3 font-medium">Created Date</th>
            <th className="px-6 py-3 font-medium">Updated At</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {articles.map((article) => (
            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                {article.title}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  article.status === 'published' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {article.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">
                {article.author?.full_name || "Unknown"}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(article.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(article.updated_at || article.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => handleTogglePublish(article.id, article.status)}
                  disabled={processingId === article.id || isPending}
                >
                  {article.status === "draft" ? "Publish" : "Unpublish"}
                </Button>
                <Link href={`/articles/${article.id}/preview`}>
                  <Button variant="secondary" size="sm" disabled={processingId === article.id || isPending}>
                    Preview
                  </Button>
                </Link>
                <Link href={`/articles/${article.id}/edit`}>
                  <Button variant="secondary" size="sm" disabled={isPending}>
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(article)}
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
