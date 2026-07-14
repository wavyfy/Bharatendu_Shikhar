"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { createMatchUpdateAction, deleteMatchUpdateAction } from "../actions";
import { Trash2, Zap, Target, TrendingUp, Radio } from "lucide-react";

interface MatchUpdatesListProps {
  matchId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updates: any[];
  sport: "cricket" | "football";
}

const UPDATE_TYPE_STYLES: Record<
  string,
  { label: string; style: string; icon: React.ReactNode }
> = {
  commentary: {
    label: "Commentary",
    style: "bg-surface-container text-on-surface-variant",
    icon: <Radio className="w-3 h-3" />,
  },
  wicket: {
    label: "Wicket",
    style: "bg-red-500/10 text-red-500",
    icon: <Target className="w-3 h-3" />,
  },
  goal: {
    label: "Goal",
    style: "bg-green-500/10 text-green-600",
    icon: <Target className="w-3 h-3" />,
  },
  milestone: {
    label: "Milestone",
    style: "bg-purple-500/10 text-purple-600",
    icon: <TrendingUp className="w-3 h-3" />,
  },
  status: {
    label: "Status",
    style: "bg-blue-500/10 text-blue-600",
    icon: <Zap className="w-3 h-3" />,
  },
};

export function MatchUpdatesList({
  matchId,
  updates,
  sport,
}: MatchUpdatesListProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [updateType, setUpdateType] = useState("commentary");

  const typeOptions = [
    { label: "Commentary", value: "commentary" },
    ...(sport === "cricket"
      ? [
          { label: "Wicket", value: "wicket" },
          { label: "Milestone", value: "milestone" },
        ]
      : [{ label: "Goal", value: "goal" }]),
    { label: "Status Update", value: "status" },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleDelete(update: any) {
    const ok = await confirm({
      title: "Delete update?",
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    startTransition(async () => {
      const res = await deleteMatchUpdateAction(update.id, matchId);
      if (res.success) {
        toast.success("Deleted.");
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("update_type", updateType);
    startTransition(async () => {
      const res = await createMatchUpdateAction(matchId, formData);
      if (res.success) {
        toast.success("Update posted.");
        setShowForm(false);
        setUpdateType("commentary");
        (e.target as HTMLFormElement).reset();
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed");
      }
    });
  }

  return (
    <div className="p-5">
      {/* Add form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="cms-card mb-6 p-5 space-y-4 border border-primary/30"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wider">
                Type
              </label>
              <Select
                value={updateType}
                onChange={setUpdateType}
                options={typeOptions}
              />
            </div>

            {sport === "cricket" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="over_ball"
                  className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                >
                  Over.Ball
                </label>
                <Input
                  type="text"
                  id="over_ball"
                  name="over_ball"
                  placeholder="e.g. 12.4"
                />
              </div>
            )}

            {sport === "football" && (
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="minute"
                  className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
                >
                  Minute
                </label>
                <Input
                  type="number"
                  id="minute"
                  name="minute"
                  placeholder="e.g. 45"
                  min={1}
                  max={120}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
              >
                Headline (optional)
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                placeholder="WICKET! / GOAL!"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="content"
              className="text-xs font-medium text-on-surface-variant uppercase tracking-wider"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              name="content"
              required
              rows={3}
              placeholder="Commentary text..."
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="is_key_moment" name="is_key_moment" />
            <label
              htmlFor="is_key_moment"
              className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              Key moment (highlighted in timeline)
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowForm(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isPending}>
              Post Update
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex justify-end mb-4">
          <Button type="button" onClick={() => setShowForm(true)}>
            <span className="material-symbols-outlined text-[18px] mr-1">add</span>
            Add Update
          </Button>
        </div>
      )}

      {/* Timeline */}
      {updates.length === 0 && !showForm ? (
        <div className="text-center py-12 text-on-surface-variant">
          <Radio className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No updates yet. Post the first update above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((u) => {
            const typeInfo =
              UPDATE_TYPE_STYLES[u.update_type] ||
              UPDATE_TYPE_STYLES["commentary"];
            return (
              <div
                key={u.id}
                className={`relative flex gap-4 p-4 rounded-xl border ${
                  u.is_key_moment
                    ? "border-primary/30 bg-primary/5"
                    : "border-outline-variant bg-surface"
                }`}
              >
                {u.is_key_moment && (
                  <div className="absolute top-3 right-3">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div className="flex flex-col items-center gap-1 shrink-0 w-12 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${typeInfo.style}`}
                  >
                    {typeInfo.icon}
                  </span>
                  {(u.over_ball || u.minute) && (
                    <span className="text-[10px] font-mono text-on-surface-variant">
                      {u.over_ball || `${u.minute}'`}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  {u.title && (
                    <p className="text-sm font-bold text-on-surface mb-1">
                      {u.title}
                    </p>
                  )}
                  <p className="text-sm text-on-surface leading-relaxed">
                    {u.content}
                  </p>
                  <p className="text-[10px] text-on-surface-variant mt-1.5">
                    {new Date(u.created_at).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(u)}
                  className="shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-on-surface-variant hover:text-red-500 transition-colors"
                  disabled={isPending}
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
