"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createMatchAction, updateMatchAction } from "../actions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import type { RegionRow } from "@/features/regions/types";
import { motion } from "framer-motion";

interface MatchFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  teams: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  competitions: any[];
  regions: RegionRow[];
}

export function MatchForm({
  initialData,
  teams,
  competitions,
  regions,
}: MatchFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sport, setSport] = useState(initialData?.sport || "cricket");
  const [matchType, setMatchType] = useState(initialData?.match_type || "");
  const [competitionId, setCompetitionId] = useState(
    initialData?.competition_id || ""
  );
  const [status, setStatus] = useState(initialData?.status || "upcoming");
  const [regionId, setRegionId] = useState(
    initialData?.region_id?.toString() || ""
  );
  const [homeTeamId, setHomeTeamId] = useState(
    initialData?.home_team_id || ""
  );
  const [awayTeamId, setAwayTeamId] = useState(
    initialData?.away_team_id || ""
  );

  const fmt = (iso?: string | null) =>
    iso ? new Date(iso).toISOString().slice(0, 16) : "";

  const teamOptions = [
    { label: "— Select team —", value: "" },
    ...teams.map((t) => ({
      label: t.name + (t.short_name ? ` (${t.short_name})` : ""),
      value: t.id,
    })),
  ];

  const cricketMatchTypes = [
    { label: "Test", value: "test" },
    { label: "ODI", value: "odi" },
    { label: "T20", value: "t20" },
  ];
  const footballMatchTypes = [
    { label: "League", value: "league" },
    { label: "Cup", value: "cup" },
    { label: "Friendly", value: "friendly" },
  ];
  const matchTypeOptions = [
    { label: "— Select type —", value: "" },
    ...(sport === "cricket" ? cricketMatchTypes : footballMatchTypes),
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("sport", sport);
    formData.set("match_type", matchType);
    formData.set("competition_id", competitionId);
    formData.set("status", status);
    formData.set("region_id", regionId);
    formData.set("home_team_id", homeTeamId);
    formData.set("away_team_id", awayTeamId);

    startTransition(async () => {
      const result = initialData?.id
        ? await updateMatchAction(initialData.id, formData)
        : await createMatchAction(formData);

      if (result.success) {
        toast.success(initialData ? "Match updated." : "Match created.");
        if (!initialData && (result as unknown as { data?: { id: string } }).data?.id) {
          router.push(
            `/sports/matches/${(result as unknown as { data: { id: string } }).data.id}`
          );
        } else {
          router.push("/sports/matches");
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
        <FormSection title="Match Details" description="Teams, title, and basic info.">
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
              placeholder="e.g. IND vs AUS — 1st Test"
            />
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Home Team
              </label>
              <Select
                value={homeTeamId}
                onChange={setHomeTeamId}
                options={teamOptions}
              />
              <Input
                type="text"
                name="home_team_name"
                defaultValue={initialData?.home_team_name}
                placeholder="Override display name (optional)"
                className="mt-2"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Away Team
              </label>
              <Select
                value={awayTeamId}
                onChange={setAwayTeamId}
                options={teamOptions}
              />
              <Input
                type="text"
                name="away_team_name"
                defaultValue={initialData?.away_team_name}
                placeholder="Override display name (optional)"
                className="mt-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="venue" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Venue
              </label>
              <Input
                type="text"
                id="venue"
                name="venue"
                defaultValue={initialData?.venue}
                placeholder="e.g. Eden Gardens, Kolkata"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="country" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Country
              </label>
              <Input
                type="text"
                id="country"
                name="country"
                defaultValue={initialData?.country}
                placeholder="India"
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Configuration" description="Sport, type, competition, dates, and settings.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Sport <span className="text-red-500">*</span>
              </label>
              <Select
                value={sport}
                onChange={(v) => { setSport(v); setMatchType(""); }}
                options={[
                  { label: "Cricket", value: "cricket" },
                  { label: "Football", value: "football" },
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Match Type
              </label>
              <Select
                value={matchType}
                onChange={setMatchType}
                options={matchTypeOptions}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Competition
              </label>
              <Select
                value={competitionId}
                onChange={setCompetitionId}
                placeholder="Standalone / No competition"
                options={[
                  { label: "Standalone / No competition", value: "" },
                  ...competitions.map((c) => ({
                    label: `${c.title}${c.season ? ` (${c.season})` : ""}`,
                    value: c.id,
                  })),
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Status
              </label>
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
              <label htmlFor="match_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Match Date & Time
              </label>
              <Input
                type="datetime-local"
                id="match_date"
                name="match_date"
                defaultValue={fmt(initialData?.match_date)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="stage" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Stage
              </label>
              <Input
                type="text"
                id="stage"
                name="stage"
                defaultValue={initialData?.stage}
                placeholder="Group Stage, Semi Final, Final..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="match_number" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Match Number
              </label>
              <Input
                type="text"
                id="match_number"
                name="match_number"
                defaultValue={initialData?.match_number}
                placeholder="Match 14, Game 3..."
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Region
              </label>
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
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Switch
                id="is_international"
                name="is_international"
                defaultChecked={initialData?.is_international}
              />
              <label
                htmlFor="is_international"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                International match
              </label>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Switch
                id="is_featured"
                name="is_featured"
                defaultChecked={initialData?.is_featured}
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer"
              >
                Featured (pinned on sports hub)
              </label>
            </div>

            <div className="flex items-center gap-3 mt-4 md:col-span-2">
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
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isPending}>
          {initialData ? "Save Changes" : "Create Match"}
        </Button>
      </div>
    </motion.form>
  );
}
