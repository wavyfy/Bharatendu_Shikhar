"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { createTeamAction, updateTeamAction } from "../actions";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { motion } from "framer-motion";

interface TeamFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
}

export function TeamForm({ initialData }: TeamFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sport, setSport] = useState(initialData?.sport || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("sport", sport);

    startTransition(async () => {
      const result = initialData?.id
        ? await updateTeamAction(initialData.id, formData)
        : await createTeamAction(formData);

      if (result.success) {
        toast.success(initialData ? "Team updated." : "Team created.");
        router.push("/sports/teams");
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
      className="space-y-6 pb-12 max-w-2xl mx-auto"
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
        <FormSection title="Team Details" description="Basic information about this team.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Team Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                required
                defaultValue={initialData?.name}
                placeholder="e.g. India, Manchester City"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="short_name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Short Name
              </label>
              <Input
                type="text"
                id="short_name"
                name="short_name"
                defaultValue={initialData?.short_name}
                placeholder="e.g. IND, MCI"
                maxLength={10}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">Sport</label>
              <Select
                value={sport}
                onChange={setSport}
                placeholder="Multi-sport / Any"
                options={[
                  { label: "Multi-sport / Any", value: "" },
                  { label: "Cricket", value: "cricket" },
                  { label: "Football", value: "football" },
                ]}
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
                placeholder="e.g. India, England"
              />
            </div>

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
          {initialData ? "Save Changes" : "Create Team"}
        </Button>
      </div>
    </motion.form>
  );
}
