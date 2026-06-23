"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createGroupAction, updateGroupAction, deleteGroupAction } from "../actions";

interface GroupsListProps {
  electionId: string;
  groups: any[];
}

/**
 * Renders a scrollable list of election groups with options to create, edit, delete, and manage candidates within each group.
 */
export function GroupsList({ electionId, groups }: GroupsListProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSortOrder, setEditSortOrder] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newSortOrder, setNewSortOrder] = useState("0");
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    
    const formData = new FormData();
    formData.set("title", newTitle);
    formData.set("sort_order", newSortOrder);

    startTransition(async () => {
      const res = await createGroupAction(electionId, formData);
      if (res.success) {
        toast.success("Group created");
        setNewTitle("");
        setNewSortOrder("0");
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to create group");
      }
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle.trim()) return;

    const formData = new FormData();
    formData.set("title", editTitle);
    formData.set("sort_order", editSortOrder);

    startTransition(async () => {
      const res = await updateGroupAction(id, electionId, formData);
      if (res.success) {
        toast.success("Group updated");
        setEditingId(null);
      } else {
        toast.error(res.error || "Failed to update group");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group? All candidates inside will also be deleted.")) return;

    startTransition(async () => {
      const res = await deleteGroupAction(id, electionId);
      if (res.success) {
        toast.success("Group deleted");
      } else {
        toast.error(res.error || "Failed to delete group");
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[600px]">
        {groups.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-on-surface-variant">
            <p>No groups created yet.</p>
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.id} className="p-3 border border-outline-variant rounded-lg bg-surface-container-low flex flex-col gap-3">
              {editingId === g.id ? (
                <div className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Group Title</label>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} placeholder="Title" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Sort Order</label>
                      <Input type="number" value={editSortOrder} onChange={(e) => setEditSortOrder(e.target.value)} placeholder="Sort Order" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="sm" onClick={() => handleUpdate(g.id)} isLoading={isPending}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-on-surface">{g.title}</h4>
                      <p className="text-xs text-on-surface-variant">Sort: {g.sort_order}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-8 w-8" onClick={() => {
                        setEditingId(g.id);
                        setEditTitle(g.title);
                        setEditSortOrder(g.sort_order.toString());
                      }}>
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-50" onClick={() => handleDelete(g.id)} disabled={isPending}>
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </Button>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-outline-variant mt-1">
                    <Link href={`/elections/${electionId}/groups/${g.id}`} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                      Manage Candidates
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </Link>
                  </div>
                </>
              )}
            </div>
          ))
        )}

        {isAdding && (
          <div className="p-3 border border-primary rounded-lg bg-primary/5 space-y-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Group Title <span className="text-red-500">*</span></label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Haridwar Constituency" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Sort Order</label>
              <Input type="number" value={newSortOrder} onChange={(e) => setNewSortOrder(e.target.value)} placeholder="e.g. 1" />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} disabled={isPending}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} isLoading={isPending}>Add Group</Button>
            </div>
          </div>
        )}
      </div>

      {!isAdding && (
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
          <Button className="w-full" variant="secondary" onClick={() => setIsAdding(true)}>
            <span className="material-symbols-outlined text-[18px] mr-1">add</span>
            Add Group
          </Button>
        </div>
      )}
    </div>
  );
}
