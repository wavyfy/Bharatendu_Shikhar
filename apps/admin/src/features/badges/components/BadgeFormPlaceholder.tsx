"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBadgeAction, updateBadgeAction } from "../actions";
import type { BadgeRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";

interface BadgeFormProps {
  initialData?: BadgeRow;
}

const PRESET_COLORS = [
  "#CC2200", // Breaking News red
  "#DC6803", // Live orange
  "#6941C6", // Exclusive purple
  "#1D4ED8", // Featured blue
  "#059669", // Trending green
  "#B45309", // Opinion amber
  "#0369A1", // Fact Check cyan
  "#374151", // Analysis dark
];

export function BadgeFormPlaceholder({ initialData }: BadgeFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [color, setColor] = useState(initialData?.color ?? "#CC2200");
  const [, startTransition] = useTransition();

  const isEditing = !!initialData;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const payload = { name, color };

    startTransition(async () => {
      const result = isEditing && initialData
        ? await updateBadgeAction(initialData.id, payload)
        : await createBadgeAction(payload);

      if (result.success) {
        toast.success(isEditing ? "Badge updated." : "Badge created.");
        router.push("/badges");
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
        title={isEditing ? "Edit Badge" : "Create Badge"}
        description="Define a label to highlight article types."
      />

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6 max-w-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <fieldset disabled={loading} className="group-disabled:opacity-70 transition-opacity">
          <FormSection title="Badge Details">
            <div className="flex flex-col gap-6">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Badge Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
                  minLength={2}
                  placeholder="e.g. Breaking News"
                  defaultValue={initialData?.name}
                />
              </div>

              {/* Color picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Color <span className="text-red-500">*</span>
                </label>

                {/* Preset swatches */}
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      title={c}
                      className="w-8 h-8 rounded-full border-2 transition-all duration-150 hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: color === c ? "white" : "transparent",
                        outline: color === c ? `2px solid ${c}` : "none",
                        outlineOffset: "2px",
                      }}
                    />
                  ))}
                </div>

                {/* Custom hex + native color picker */}
                <div className="flex items-center gap-3 mt-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-outline-variant bg-transparent"
                    title="Custom color"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="max-w-[140px] font-mono"
                  />
                  {/* Live preview */}
                  <span
                    className="inline-flex items-center px-3 py-1 rounded text-[11px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: color }}
                  >
                    {initialData?.name || "Preview"}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Pick a preset or enter a custom hex color.
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
          <Button type="submit" disabled={loading} isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Badge"}
          </Button>
        </div>
      </motion.form>
    </PageContainer>
  );
}
