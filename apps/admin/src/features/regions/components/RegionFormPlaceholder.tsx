"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRegionAction, updateRegionAction } from "../actions";
import type { RegionRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";

interface RegionFormProps {
  initialData?: RegionRow;
}

export function RegionFormPlaceholder({ initialData }: RegionFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const is_active = formData.get("is_active") === "on";
    const payload = { name, is_active };

    startTransition(async () => {
      const result = isEditing && initialData
        ? await updateRegionAction(initialData.id, payload)
        : await createRegionAction(payload);

      if (result.success) {
        toast.success(isEditing ? "Region updated." : "Region created.");
        router.push("/regions");
      } else {
        const msg = result.error ?? "Something went wrong.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
      }
    });
  }

  return (
    <PageContainer>
      <PageHeader 
        title={isEditing ? "Edit Region" : "Create Region"} 
        description="Manage geographical regions for e-papers."
      />

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm max-w-4xl font-medium">
            {error}
          </div>
        )}

        <fieldset disabled={loading} className="group-disabled:opacity-70 transition-opacity">
          <FormSection title="Region Details">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Region Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  placeholder="Enter region name..."
                  defaultValue={initialData?.name}
                />
                <p className="text-xs text-slate-500">Slug will be generated automatically.</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked={isEditing ? initialData.is_active : true}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary bg-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
                  Active
                </label>
                <p className="text-xs text-slate-500 ml-2">
                  (Inactive regions are hidden from content creation)
                </p>
              </div>
            </div>
          </FormSection>
        </fieldset>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Region"}
          </Button>
        </div>
      </motion.form>
    </PageContainer>
  );
}
