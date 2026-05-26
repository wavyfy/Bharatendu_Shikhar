"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createRegionAction, updateRegionAction } from "../actions";
import type { RegionRow } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

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
    const payload = { name };

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
    <div className="bg-white p-6 border border-neutral-200 rounded-lg max-w-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Region Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            minLength={2}
            className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500"
            placeholder="Enter region name..."
            defaultValue={initialData?.name}
          />
          <p className="mt-1 text-xs text-neutral-500">Slug will be generated automatically.</p>
        </div>

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
      </form>
    </div>
  );
}
