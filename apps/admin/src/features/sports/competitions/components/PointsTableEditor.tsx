"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { upsertPointsRowAction, deletePointsRowAction } from "../actions";
import { Trash2, Plus, ChevronDown } from "lucide-react";

interface PointsTableEditorProps {
  competitionId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teams: any[];
}

const BLANK_ROW = {
  team_name: "",
  group_name: "",
  played: 0,
  won: 0,
  drawn: 0,
  lost: 0,
  goals_for: 0,
  goals_against: 0,
  runs_for: 0,
  runs_against: 0,
  net_run_rate: "",
  points: 0,
  sort_order: 0,
};

function groupBy<T>(arr: T[], key: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = key(item);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}

export function PointsTableEditor({
  competitionId,
  entries,
  teams,
}: PointsTableEditorProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRow, setNewRow] = useState({ ...BLANK_ROW });
  const [activeGroup, setActiveGroup] = useState<string>("");

  const grouped = groupBy(entries, (e) => e.group_name || "");
  const groups = Object.keys(grouped).sort();
  const displayGroups = groups.length > 0 ? groups : [""];

  if (activeGroup === "" && groups.length > 0 && !groups.includes("")) {
    // auto-select first real group
  }

  async function handleDelete(id: string) {
    const ok = await confirm({
      title: "Remove row?",
      description: "This cannot be undone.",
      confirmLabel: "Remove",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deletePointsRowAction(id, competitionId);
      if (res.success) {
        toast.success("Row removed.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(rowData: any, id?: string) {
    startTransition(async () => {
      const payload = { ...rowData, id: id || undefined };
      const res = await upsertPointsRowAction(competitionId, payload);
      if (res.success) {
        toast.success(id ? "Row updated." : "Row added.");
        setEditingRow(null);
        setShowAddForm(false);
        setNewRow({ ...BLANK_ROW });
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  const teamOptions = teams.map((t) => ({ value: t.id, label: t.name }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function RowForm({ row, onSave, onCancel }: { row: any; onSave: (r: any) => void; onCancel: () => void }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [form, setForm] = useState<any>(row);
    const set = (k: string, v: string | number) => setForm((p: typeof form) => ({ ...p, [k]: v }));

    return (
      <tr className="bg-surface-container-low">
        <td className="px-3 py-2" colSpan={12}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-on-surface-variant mb-1 block">Team Name *</label>
              <div className="flex gap-2">
                <Input value={form.team_name} onChange={(e) => set("team_name", e.target.value)} placeholder="Team name" />
                {teamOptions.length > 0 && (
                  <div className="relative">
                    <select
                      className="h-full px-2 py-1.5 text-sm rounded-lg border border-outline-variant bg-surface text-on-surface appearance-none pr-6"
                      onChange={(e) => {
                        const t = teams.find((x) => x.id === e.target.value);
                        if (t) set("team_name", t.name);
                        set("team_id", e.target.value);
                      }}
                    >
                      <option value="">Pick team</option>
                      {teamOptions.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none text-on-surface-variant" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant mb-1 block">Group</label>
              <Input value={form.group_name || ""} onChange={(e) => set("group_name", e.target.value)} placeholder="e.g. Group A" />
            </div>
            <div>
              <label className="text-xs font-medium text-on-surface-variant mb-1 block">Sort Order</label>
              <Input type="number" value={form.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-3">
            {(["played", "won", "drawn", "lost", "goals_for", "goals_against", "points"] as const).map((k) => (
              <div key={k}>
                <label className="text-[10px] font-medium text-on-surface-variant mb-1 block uppercase">{k.replace("_", " ")}</label>
                <Input type="number" value={form[k]} onChange={(e) => set(k, Number(e.target.value))} />
              </div>
            ))}
            <div>
              <label className="text-[10px] font-medium text-on-surface-variant mb-1 block uppercase">NRR</label>
              <Input value={form.net_run_rate || ""} onChange={(e) => set("net_run_rate", e.target.value)} placeholder="e.g. +0.45" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={isPending}>Cancel</Button>
            <Button type="button" size="sm" isLoading={isPending} onClick={() => onSave(form)}>Save</Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="p-5">
      {/* Group Tabs */}
      {groups.length > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {displayGroups.map((g) => (
            <button
              key={g}
              onClick={() => setActiveGroup(g)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeGroup === g
                  ? "bg-primary text-white"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              {g || "No Group"}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-outline-variant mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium">Team</th>
              {groups.length > 1 && <th className="px-4 py-3 font-medium">Group</th>}
              <th className="px-4 py-3 font-medium text-center">P</th>
              <th className="px-4 py-3 font-medium text-center">W</th>
              <th className="px-4 py-3 font-medium text-center">D</th>
              <th className="px-4 py-3 font-medium text-center">L</th>
              <th className="px-4 py-3 font-medium text-center">GF</th>
              <th className="px-4 py-3 font-medium text-center">GA</th>
              <th className="px-4 py-3 font-medium text-center">NRR</th>
              <th className="px-4 py-3 font-medium text-center">Pts</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface">
            {entries
              .filter((e) => groups.length <= 1 || (e.group_name || "") === activeGroup)
              .map((entry) =>
                editingRow?.id === entry.id ? (
                  <RowForm
                    key={entry.id}
                    row={editingRow}
                    onSave={(r) => handleSave(r, entry.id)}
                    onCancel={() => setEditingRow(null)}
                  />
                ) : (
                  <tr key={entry.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-medium text-on-surface">
                      <div className="flex items-center gap-2">
                        {(entry.team?.logo_url || entry.team_logo_url) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={entry.team?.logo_url || entry.team_logo_url}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        {entry.team_name}
                      </div>
                    </td>
                    {groups.length > 1 && (
                      <td className="px-4 py-3 text-on-surface-variant text-xs">{entry.group_name || "—"}</td>
                    )}
                    <td className="px-4 py-3 text-center">{entry.played}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-medium">{entry.won}</td>
                    <td className="px-4 py-3 text-center">{entry.drawn}</td>
                    <td className="px-4 py-3 text-center text-red-500">{entry.lost}</td>
                    <td className="px-4 py-3 text-center">{entry.goals_for}</td>
                    <td className="px-4 py-3 text-center">{entry.goals_against}</td>
                    <td className="px-4 py-3 text-center text-xs font-mono">
                      {entry.net_run_rate != null ? Number(entry.net_run_rate).toFixed(3) : "—"}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-primary">{entry.points}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingRow(entry)}
                          className="p-1.5 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                          title="Delete"
                          disabled={isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            {showAddForm && (
              <RowForm
                row={{ ...BLANK_ROW, group_name: activeGroup }}
                onSave={(r) => handleSave(r)}
                onCancel={() => { setShowAddForm(false); setNewRow({ ...BLANK_ROW }); }}
              />
            )}
            {entries.filter((e) => groups.length <= 1 || (e.group_name || "") === activeGroup).length === 0 && !showAddForm && (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-on-surface-variant text-sm">
                  No entries yet. Add a team row.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {!showAddForm && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => { setShowAddForm(true); setNewRow({ ...BLANK_ROW, group_name: activeGroup }); }}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Row
        </Button>
      )}
    </div>
  );
}
