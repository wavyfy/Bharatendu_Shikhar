"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createRegionAction, updateRegionAction } from "../actions";
import type { RegionRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Switch } from "@/components/ui/Switch";
import { Select } from "@/components/ui/Select";
import { motion } from "framer-motion";

interface RegionFormProps {
  initialData?: RegionRow;
  parentRegions?: RegionRow[];
}

export function RegionFormPlaceholder({ initialData, parentRegions = [] }: RegionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const defaultParentId = initialData?.parent_id?.toString() || searchParams?.get("parent_id") || "";
  const [parentId, setParentId] = useState<string>(defaultParentId);
  const [, startTransition] = useTransition();

  const isEditing = !!initialData;

  const getHierarchicalOptions = (
    regions: RegionRow[], 
    currentParentId: number | null = null, 
    depth: number = 0
  ): { label: string, value: string }[] => {
    // Cities are at depth 2, and they cannot be parents.
    if (depth >= 2) return [];

    let options: { label: string, value: string }[] = [];
    const children = regions.filter(r => r.parent_id === currentParentId);
    
    children.forEach((child, index) => {
      let prefixStr = "";
      if (depth === 0) {
        prefixStr = `${index + 1}. `;
      } else if (depth === 1) {
        const letter = String.fromCharCode(97 + index);
        prefixStr = `\u00A0\u00A0\u00A0\u00A0${letter}. `;
      }
      
      const displayLabel = prefixStr + child.name;
      options.push({ label: displayLabel, value: child.id.toString() });
      options = options.concat(getHierarchicalOptions(regions, child.id, depth + 1));
    });
    
    return options;
  };

  const formattedOptions = [
    { label: "None (Top-level region)", value: "" },
    ...getHierarchicalOptions(parentRegions)
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const is_active = formData.get("is_active") === "on";
    const seo_description = formData.get("seo_description") as string | null;
    const parent_id_str = formData.get("parent_id") as string;
    const parent_id = parent_id_str ? parseInt(parent_id_str, 10) : null;
    const payload = { name, is_active, seo_description: seo_description || null, parent_id };

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
    <>

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
                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-200">
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

              <div className="flex flex-col gap-1.5">
                <label htmlFor="parent_id" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Parent Region
                </label>
                <input type="hidden" name="parent_id" value={parentId} />
                <Select
                  value={parentId}
                  onChange={setParentId}
                  options={formattedOptions}
                  placeholder="Select a parent region..."
                  disabled={loading}
                />
                <p className="text-xs text-slate-500">Optional. Select a country for a state, or a state for a city.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="seo_description" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  SEO Description
                </label>
                <Textarea
                  id="seo_description"
                  name="seo_description"
                  rows={3}
                  placeholder="Enter SEO description for this region..."
                  defaultValue={initialData?.seo_description || ""}
                />
                <p className="text-xs text-slate-500">Optional. Visible below the region title and used for search engines.</p>
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  name="is_active"
                  defaultChecked={isEditing ? initialData.is_active : true}
                />
                <div>
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-200 cursor-pointer">
                    Active
                  </label>
                  <p className="text-xs text-slate-500">
                    Inactive regions are hidden from content creation.
                  </p>
                </div>
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
    </>
  );
}
