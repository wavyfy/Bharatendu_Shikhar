"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createPublisherAction, updatePublisherAction } from "../actions";
import type { PublisherRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";

interface PublisherFormProps {
  initialData?: PublisherRow;
}

export function PublisherForm({ initialData }: PublisherFormProps) {
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
    startTransition(async () => {
      const result = isEditing && initialData
        ? await updatePublisherAction(initialData.id, formData)
        : await createPublisherAction(formData);

      if (result.success) {
        toast.success(isEditing ? "Publisher updated." : "Publisher created.");
        router.push("/publishers");
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
        title={isEditing ? "Edit Publisher" : "Create Publisher"} 
        description="Manage publisher accounts and access."
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
          <FormSection title="Publisher Details">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="full_name" className="text-sm font-medium text-slate-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="e.g. John Doe"
                  defaultValue={initialData?.full_name || ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="publisher@example.com"
                  defaultValue={(initialData as any)?.email || ""}
                />
                <p className="text-xs text-slate-500">They will use this to log in.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password {isEditing ? "(Leave blank to keep current)" : <span className="text-red-500">*</span>}
                </label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  required={!isEditing}
                  minLength={6}
                  placeholder={isEditing ? "••••••••" : "Enter a strong password"}
                />
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
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Create Publisher"}
          </Button>
        </div>
      </motion.form>
    </PageContainer>
  );
}
