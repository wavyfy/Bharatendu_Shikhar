"use client";

import { useState, useTransition } from "react";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createCandidateAction, updateCandidateAction, deleteCandidateAction } from "../actions";

interface CandidatesListProps {
  groupId: string;
  electionId: string;
  candidates: any[];
}

export function CandidatesList({ groupId, electionId, candidates }: CandidatesListProps) {
  const [isPending, startTransition] = useTransition();
  const toast = useToast();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const [isAdding, setIsAdding] = useState(false);
  const [newData, setNewData] = useState({
    candidate_name: "",
    party_name: "",
    party_symbol_url: "",
    photo_url: "",
    votes: "0",
    is_winner: false,
    sort_order: "0"
  });

  const handleCreate = async () => {
    if (!newData.candidate_name.trim()) return;
    
    const formData = new FormData();
    formData.set("candidate_name", newData.candidate_name);
    formData.set("party_name", newData.party_name);
    formData.set("party_symbol_url", newData.party_symbol_url);
    formData.set("photo_url", newData.photo_url);
    formData.set("votes", newData.votes);
    formData.set("is_winner", newData.is_winner.toString());
    formData.set("sort_order", newData.sort_order);

    startTransition(async () => {
      const res = await createCandidateAction(groupId, electionId, formData);
      if (res.success) {
        toast.success("Candidate added");
        setNewData({
          candidate_name: "",
          party_name: "",
          party_symbol_url: "",
          photo_url: "",
          votes: "0",
          is_winner: false,
          sort_order: "0"
        });
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to add candidate");
      }
    });
  };

  const handleUpdate = async (id: string) => {
    if (!editData.candidate_name?.trim()) return;

    const formData = new FormData();
    formData.set("candidate_name", editData.candidate_name);
    formData.set("party_name", editData.party_name || "");
    formData.set("party_symbol_url", editData.party_symbol_url || "");
    formData.set("photo_url", editData.photo_url || "");
    formData.set("votes", editData.votes?.toString() || "0");
    formData.set("is_winner", editData.is_winner?.toString() || "false");
    formData.set("sort_order", editData.sort_order?.toString() || "0");

    startTransition(async () => {
      const res = await updateCandidateAction(id, electionId, formData);
      if (res.success) {
        toast.success("Candidate updated");
        setEditingId(null);
      } else {
        toast.error(res.error || "Failed to update candidate");
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this candidate?")) return;

    startTransition(async () => {
      const res = await deleteCandidateAction(id, electionId);
      if (res.success) {
        toast.success("Candidate deleted");
      } else {
        toast.error(res.error || "Failed to delete candidate");
      }
    });
  };

  const startEdit = (c: any) => {
    setEditingId(c.id);
    setEditData({
      candidate_name: c.candidate_name,
      party_name: c.party_name || "",
      party_symbol_url: c.party_symbol_url || "",
      photo_url: c.photo_url || "",
      votes: c.votes.toString(),
      is_winner: c.is_winner,
      sort_order: c.sort_order.toString()
    });
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      
      {isAdding && (
        <div className="p-4 border border-primary rounded-xl bg-primary/5 space-y-4">
          <h3 className="font-bold text-primary">Add Candidate</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Candidate Name <span className="text-red-500">*</span></label>
              <Input value={newData.candidate_name} onChange={(e) => setNewData({...newData, candidate_name: e.target.value})} placeholder="e.g. John Doe" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Party Name</label>
              <Input value={newData.party_name} onChange={(e) => setNewData({...newData, party_name: e.target.value})} placeholder="e.g. BJP" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Photo URL</label>
              <Input value={newData.photo_url} onChange={(e) => setNewData({...newData, photo_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Party Symbol URL</label>
              <Input value={newData.party_symbol_url} onChange={(e) => setNewData({...newData, party_symbol_url: e.target.value})} placeholder="https://..." />
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Votes</label>
                <Input type="number" value={newData.votes} onChange={(e) => setNewData({...newData, votes: e.target.value})} placeholder="e.g. 1500" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-200">Sort Order</label>
                <Input type="number" value={newData.sort_order} onChange={(e) => setNewData({...newData, sort_order: e.target.value})} placeholder="e.g. 1" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="new_is_winner" checked={newData.is_winner} onChange={(e) => setNewData({...newData, is_winner: e.target.checked})} className="w-4 h-4 rounded" />
              <label htmlFor="new_is_winner" className="text-sm font-medium">Mark as Winner</label>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setIsAdding(false)} disabled={isPending}>Cancel</Button>
            <Button onClick={handleCreate} isLoading={isPending}>Save Candidate</Button>
          </div>
        </div>
      )}

      {!isAdding && (
        <div>
          <Button onClick={() => setIsAdding(true)}>
            <span className="material-symbols-outlined text-[18px] mr-1">add</span>
            Add Candidate
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {candidates.length === 0 ? (
          <div className="col-span-full py-8 text-center text-on-surface-variant bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
            No candidates added to this group yet.
          </div>
        ) : (
          candidates.map((c) => (
            <div key={c.id} className={`p-4 border rounded-xl flex flex-col gap-3 ${c.is_winner ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-low'}`}>
              {editingId === c.id ? (
                <div className="space-y-3">
                  <div className="flex flex-col gap-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Candidate Name</label><Input value={editData.candidate_name} onChange={(e) => setEditData({...editData, candidate_name: e.target.value})} placeholder="Name" /></div>
                  <div className="flex flex-col gap-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Party Name</label><Input value={editData.party_name} onChange={(e) => setEditData({...editData, party_name: e.target.value})} placeholder="Party" /></div>
                  <div className="flex flex-col gap-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Photo URL</label><Input value={editData.photo_url} onChange={(e) => setEditData({...editData, photo_url: e.target.value})} placeholder="Photo URL" /></div>
                  <div className="flex flex-col gap-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Party Symbol URL</label><Input value={editData.party_symbol_url} onChange={(e) => setEditData({...editData, party_symbol_url: e.target.value})} placeholder="Symbol URL" /></div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 flex-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Votes</label><Input type="number" value={editData.votes} onChange={(e) => setEditData({...editData, votes: e.target.value})} placeholder="Votes" /></div>
                    <div className="flex flex-col gap-1 flex-1"><label className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Sort Order</label><Input type="number" value={editData.sort_order} onChange={(e) => setEditData({...editData, sort_order: e.target.value})} placeholder="Sort" /></div>
                  </div>
                  <div className="flex items-center gap-2 pb-1">
                    <input type="checkbox" id={`edit_winner_${c.id}`} checked={editData.is_winner} onChange={(e) => setEditData({...editData, is_winner: e.target.checked})} className="w-4 h-4 rounded" />
                    <label htmlFor={`edit_winner_${c.id}`} className="text-sm font-medium">Winner</label>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1" onClick={() => handleUpdate(c.id)} isLoading={isPending}>Save</Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={isPending}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex gap-3">
                    {c.photo_url ? (
                      <img src={c.photo_url} alt="" className="w-12 h-12 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant">person</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-on-surface truncate" title={c.candidate_name}>{c.candidate_name}</h4>
                        {c.is_winner && (
                          <span className="material-symbols-outlined text-primary text-[18px] shrink-0" title="Winner">verified</span>
                        )}
                      </div>
                      <p className="text-sm text-on-surface-variant truncate">{c.party_name || "Independent"}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-outline-variant">
                    <div className="bg-surface px-2 py-1.5 rounded-md text-center">
                      <p className="text-xs text-on-surface-variant mb-0.5">Votes</p>
                      <p className="font-semibold text-on-surface">{c.votes.toLocaleString()}</p>
                    </div>
                    <div className="bg-surface px-2 py-1.5 rounded-md text-center">
                      <p className="text-xs text-on-surface-variant mb-0.5">Sort</p>
                      <p className="font-semibold text-on-surface">{c.sort_order}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 justify-end mt-1">
                    <Button size="sm" variant="ghost" onClick={() => startEdit(c)}>Edit</Button>
                    <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" onClick={() => handleDelete(c.id)}>Delete</Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
