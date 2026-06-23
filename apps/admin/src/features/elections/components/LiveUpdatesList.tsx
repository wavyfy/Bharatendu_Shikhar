"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { createUpdateAction, deleteUpdateAction } from "../actions";

interface LiveUpdatesListProps {
  electionId: string;
  updates: { id: string; title: string; content: string; created_at: string; }[];
}

export function LiveUpdatesList({ electionId, updates }: LiveUpdatesListProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Title and content are required.");
      return;
    }
    
    const formData = new FormData();
    formData.set("title", newTitle);
    formData.set("content", newContent);

    startTransition(async () => {
      const res = await createUpdateAction(electionId, formData);
      if (res.success) {
        toast.success("Update posted");
        setNewTitle("");
        setNewContent("");
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to post update");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this update?")) return;

    startTransition(async () => {
      const res = await deleteUpdateAction(id, electionId);
      if (res.success) {
        toast.success("Update deleted");
      } else {
        toast.error(res.error || "Failed to delete update");
      }
    });
  };

  return (
    <div className="flex flex-col">
      <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar max-h-[600px]">
        {isAdding && (
          <div className="p-4 border border-primary rounded-lg bg-primary/5 space-y-3 mb-4">
            <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Update Title (e.g., Counting begins)" />
            <Textarea 
              rows={3} 
              value={newContent} 
              onChange={(e) => setNewContent(e.target.value)} 
              placeholder="Content details..." 
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)} disabled={isPending}>Cancel</Button>
              <Button size="sm" onClick={handleCreate} isLoading={isPending}>Post Update</Button>
            </div>
          </div>
        )}

        {updates.length === 0 && !isAdding ? (
          <div className="text-center py-8 text-on-surface-variant">
            <p>No live updates posted yet.</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-outline-variant ml-3 space-y-6">
            {updates.map((update) => (
              <div key={update.id} className="relative pl-6">
                <div className="absolute w-3 h-3 bg-primary rounded-full left-[-7px] top-1.5" />
                <div className="p-3 border border-outline-variant rounded-lg bg-surface-container-low group">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-bold text-on-surface leading-tight">{update.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {new Date(update.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 w-7 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 hover:bg-red-50 shrink-0" onClick={() => handleDelete(update.id)} disabled={isPending}>
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </Button>
                  </div>
                  <p className="text-sm text-on-surface mt-2 whitespace-pre-wrap">{update.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!isAdding && (
        <div className="p-4 border-t border-outline-variant bg-surface-container-lowest">
          <Button className="w-full" variant="secondary" onClick={() => setIsAdding(true)}>
            <span className="material-symbols-outlined text-[18px] mr-1">add</span>
            Post Live Update
          </Button>
        </div>
      )}
    </div>
  );
}
