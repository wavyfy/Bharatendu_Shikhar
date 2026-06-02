"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteCategoryAction, toggleCategoryActiveAction } from "../actions";
import type { CategoryRow } from "../types";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActionMenu } from "@/components/ui/ActionMenu";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Pencil, Trash2, Ban, CheckCircle } from "lucide-react";

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

  async function handleToggleActive(category: CategoryRow) {
    const action = category.is_active ? "deactivate" : "reactivate";
    const ok = await confirm({
      title: `${category.is_active ? "Deactivate" : "Reactivate"} "${category.name}"?`,
      description: category.is_active
        ? "This category will be hidden from new articles."
        : "This category will be available again.",
      confirmLabel: category.is_active ? "Deactivate" : "Reactivate",
      destructive: category.is_active,
    });
    if (!ok) return;

    startTransition(async () => {
      const res = await toggleCategoryActiveAction(category.id, !category.is_active);
      if (res.success) {
        toast.success(`"${category.name}" ${action}d.`);
        router.refresh();
      } else {
        toast.error(res.error ?? `Failed to ${action} category.`);
      }
    });
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No categories found"
        description="Get started by creating your first category."
        actionLabel="Create Category"
        actionHref="/categories/new"
      />
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm m-4 sm:m-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-200 dark:bg-slate-700/80 border-b border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium">Created Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-slate-50 dark:bg-slate-800/50">
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-150">
              <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100 max-w-xs truncate">
                {category.name}
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {category.slug}
              </td>
              <td className="px-6 py-4">
                <StatusBadge variant={category.is_active ? "active" : "inactive"} />
              </td>
              <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                {new Date(category.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right">
                <ActionMenu
                  items={[
                    {
                      label: "Edit",
                      icon: <Pencil strokeWidth={1.5} />,
                      href: `/categories/${category.id}/edit`,
                      disabled: isPending,
                    },
                    {
                      label: category.is_active ? "Deactivate" : "Reactivate",
                      icon: category.is_active ? <Ban strokeWidth={1.5} /> : <CheckCircle strokeWidth={1.5} />,
                      onClick: () => handleToggleActive(category),
                      variant: category.is_active ? "danger" : "default",
                      disabled: isPending,
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 strokeWidth={1.5} />,
                      onClick: () => handleDelete(category),
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
