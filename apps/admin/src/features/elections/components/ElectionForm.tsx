"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { RegionRow } from "@/features/regions/types";
import { createElectionAction, updateElectionAction } from "../actions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { motion } from "framer-motion";

interface ElectionFormProps {
  initialData?: any;
  regions: RegionRow[];
}

export function ElectionForm({ initialData, regions }: ElectionFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [regionId, setRegionId] = useState(initialData?.region_id?.toString() || "");
  const [status, setStatus] = useState(initialData?.status || "upcoming");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("region_id", regionId);
    formData.set("status", status);

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateElectionAction(initialData.id, formData);
      } else {
        result = await createElectionAction(formData);
      }

      if (result.success) {
        toast.success(initialData ? "Election updated." : "Election created.");
        if (!initialData && (result as any).data?.id) {
          router.push(`/elections/${(result as any).data.id}`);
        } else {
          router.push("/elections");
        }
        router.refresh();
      } else {
        const msg = result.error || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  const formatDateForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split('T')[0];
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
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm max-w-4xl font-medium">
          {error}
        </div>
      )}

      <fieldset disabled={isPending} className="group-disabled:opacity-70 transition-opacity">
        <FormSection title="Election Details" description="Basic information about the election.">
          <div className="flex flex-col gap-1.5 mb-6">
            <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Election Title <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={initialData?.title}
              placeholder="e.g. Uttarakhand Assembly Election 2027"
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
              placeholder="Brief description about the election..."
            />
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            <label htmlFor="featured_image_url" className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Featured Image URL
            </label>
            <Input
              type="url"
              id="featured_image_url"
              name="featured_image_url"
              defaultValue={initialData?.featured_image_url}
              placeholder="https://..."
            />
          </div>
        </FormSection>

        <FormSection title="Configuration" description="Status, region, and dates.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Region</label>
              <Select
                value={regionId}
                onChange={setRegionId}
                placeholder="Global / All Regions"
                options={[
                  { label: "Global / All Regions", value: "" },
                  ...regions.map(r => ({ label: r.name, value: r.id.toString() }))
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
                  { label: "Completed", value: "completed" }
                ]}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="voting_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">Voting Date</label>
              <Input
                type="date"
                id="voting_date"
                name="voting_date"
                defaultValue={formatDateForInput(initialData?.voting_date)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="result_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">Result Date</label>
              <Input
                type="date"
                id="result_date"
                name="result_date"
                defaultValue={formatDateForInput(initialData?.result_date)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="display_order" className="text-sm font-medium text-slate-700 dark:text-slate-200">Display Order</label>
              <Input
                type="number"
                id="display_order"
                name="display_order"
                defaultValue={initialData?.display_order || 0}
              />
              <p className="text-xs text-slate-500">Higher numbers appear first.</p>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <Switch
                id="is_published"
                name="is_published"
                defaultChecked={initialData?.is_published}
              />
              <label htmlFor="is_published" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
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
        <Button 
          type="submit" 
          isLoading={isPending}
        >
          {initialData ? "Save Changes" : "Create Election"}
        </Button>
      </div>
    </motion.form>
  );
}
