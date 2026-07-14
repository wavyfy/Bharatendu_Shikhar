"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createCompetitionAction, updateCompetitionAction } from "../actions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import type { RegionRow } from "@/features/regions/types";
import { motion } from "framer-motion";

interface CompetitionFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  regions: RegionRow[];
}

export function CompetitionForm({ initialData, regions }: CompetitionFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sport, setSport] = useState(initialData?.sport || "cricket");
  const [competitionType, setCompetitionType] = useState(
    initialData?.competition_type || "tournament"
  );
  const [status, setStatus] = useState(initialData?.status || "upcoming");
  const [regionId, setRegionId] = useState(
    initialData?.region_id?.toString() || ""
  );

  const fmt = (iso?: string | null) =>
    iso ? new Date(iso).toISOString().split("T")[0] : "";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("sport", sport);
    formData.set("competition_type", competitionType);
    formData.set("status", status);
    formData.set("region_id", regionId);

    startTransition(async () => {
      const result = initialData?.id
        ? await updateCompetitionAction(initialData.id, formData)
        : await createCompetitionAction(formData);

      if (result.success) {
        toast.success(initialData ? "Competition updated." : "Competition created.");
        if (!initialData && (result as unknown as { data?: { id: string } }).data?.id) {
          router.push(`/sports/competitions/${(result as unknown as { data: { id: string } }).data.id}`);
        } else {
          router.push("/sports/competitions");
        }
        router.refresh();
      } else {
        const msg = result.error || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 pb-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <fieldset disabled={isPending} className="group-disabled:opacity-70 transition-opacity">
        <FormSection title="Competition Details" description="Basic information about this competition.">
          <div className="flex flex-col gap-1.5 mb-6">
            <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={initialData?.title}
              placeholder="e.g. IPL 2026, Women's T20 World Cup 2026"
            />
          </div>



          <div className="flex flex-col gap-1.5 mb-6">
            <label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description}
              placeholder="Brief description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="logo_url" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Logo URL
              </label>
              <Input
                type="url"
                id="logo_url"
                name="logo_url"
                defaultValue={initialData?.logo_url}
                placeholder="https://..."
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="banner_url" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Banner URL
              </label>
              <Input
                type="url"
                id="banner_url"
                name="banner_url"
                defaultValue={initialData?.banner_url}
                placeholder="https://..."
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Configuration" description="Sport, type, season, and dates.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Sport <span className="text-red-500">*</span>
              </label>
              <Select
                value={sport}
                onChange={setSport}
                options={[
                  { label: "Cricket", value: "cricket" },
                  { label: "Football", value: "football" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={competitionType}
                onChange={setCompetitionType}
                options={[
                  { label: "Tournament", value: "tournament" },
                  { label: "Series", value: "series" },
                  { label: "League", value: "league" },
                  { label: "Cup", value: "cup" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</label>
              <Select
                value={status}
                onChange={setStatus}
                options={[
                  { label: "Upcoming", value: "upcoming" },
                  { label: "Live", value: "live" },
                  { label: "Completed", value: "completed" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="season" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Season
              </label>
              <Input
                type="text"
                id="season"
                name="season"
                defaultValue={initialData?.season}
                placeholder="2026 / 2025-26"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="start_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Start Date
              </label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                defaultValue={fmt(initialData?.start_date)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="end_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                End Date
              </label>
              <Input
                type="date"
                id="end_date"
                name="end_date"
                defaultValue={fmt(initialData?.end_date)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Region</label>
              <Select
                value={regionId}
                onChange={setRegionId}
                placeholder="Global / All Regions"
                options={[
                  { label: "Global / All Regions", value: "" },
                  ...regions.map((r) => ({
                    label: r.is_active ? r.name : `${r.name} (Inactive)`,
                    value: r.id.toString(),
                  })),
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="display_order" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Display Order
              </label>
              <Input
                type="number"
                id="display_order"
                name="display_order"
                defaultValue={initialData?.display_order || 0}
              />
              <p className="text-xs text-slate-500">Higher numbers appear first.</p>
            </div>

            <div className="flex items-center gap-3 mt-6 md:col-span-2">
              <Switch
                id="is_published"
                name="is_published"
                defaultChecked={initialData?.is_published}
              />
              <label
                htmlFor="is_published"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Published to public website
              </label>
            </div>
          </div>
        </FormSection>
      </fieldset>

      <div className="mt-6 flex items-center justify-end gap-x-4">
        <Button type="button" variant="ghost" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {initialData ? "Save Changes" : "Create Competition"}
        </Button>
      </div>
    </motion.form>
  );
}
