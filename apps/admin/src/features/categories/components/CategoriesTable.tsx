"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCategoryAction } from "../actions";
import type { CategoryRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface CategoriesTableProps {
  categories: CategoryRow[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(category: CategoryRow) {
    const ok = await confirm({
      title: `Delete "${category.name}"?`,
      description: "This may fail if articles are attached.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteCategoryAction(category.id);
      if (res.success) {
        toast.success(`"${category.name}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete category");
      }
    });
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-sm text-gray-500 mb-4">No categories found.</p>
        <Link href="/categories/new">
          <Button>Create your first category</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-medium">Name</th>
            <th className="px-6 py-3 font-medium">Slug</th>
            <th className="px-6 py-3 font-medium">Created Date</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900 max-w-xs truncate">
                {category.name}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {category.slug}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(category.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <Link href={`/categories/${category.id}/edit`}>
                  <Button variant="secondary" size="sm" disabled={isPending}>
                    Edit
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(category)}
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
