"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { CategoryRow } from "@/features/categories/types";
import type { RegionRow } from "@/features/regions/types";
import type { ArticleWithRelations } from "../types";
import { createArticleAction, updateArticleAction } from "../actions";
import { RichEditor } from "@/components/ui/RichEditor";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { motion } from "framer-motion";

interface ArticleFormProps {
  initialData?: ArticleWithRelations;
  categories: CategoryRow[];
  regions: RegionRow[];
}

export function ArticleFormPlaceholder({ initialData, categories, regions }: ArticleFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const isEditing = !!initialData;
  const [content, setContent] = useState(initialData?.content || "");
  const [status, setStatus] = useState<string>(initialData?.status || "draft");
  const [categoryId, setCategoryId] = useState<string>(initialData?.category_id?.toString() || "");
  const [regionId, setRegionId] = useState<string>(initialData?.region_id?.toString() || "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;

    const payload = {
      title,
      content,
      status: status as "draft" | "published",
      excerpt: excerpt || null,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      region_id: regionId ? parseInt(regionId, 10) : null,
    };

    startTransition(async () => {
      const result = isEditing && initialData
        ? await updateArticleAction(initialData.id, payload)
        : await createArticleAction(payload);

      if (result.success) {
        toast.success(isEditing ? "Article updated." : "Article created.");
        router.push("/articles");
        router.refresh();
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
        title={isEditing ? "Edit Article" : "Create Article"} 
        description="Write and publish a new article."
      />

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-6 max-w-4xl mx-auto pb-12"
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
          
          <FormSection title="Content" description="The main content of the article.">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                required
                placeholder="Enter article title..."
                defaultValue={initialData?.title}
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-6">
              <label htmlFor="excerpt" className="text-sm font-medium text-slate-700">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                className="w-full px-3 py-2 border border-slate-200 rounded-md bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-shadow duration-150"
                placeholder="Brief summary of the article..."
                defaultValue={initialData?.excerpt || ""}
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-6">
              <label className="text-sm font-medium text-slate-700">
                Body Content <span className="text-red-500">*</span>
              </label>
              <RichEditor value={content} onChange={setContent} />
            </div>
          </FormSection>

          <FormSection title="Organization" description="Categorize and set visibility.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Status <span className="text-red-500">*</span>
                </label>
                <input type="hidden" name="status" value={status} />
                <Select
                  value={status}
                  onChange={setStatus}
                  options={[
                    { label: "Draft", value: "draft" },
                    { label: "Published", value: "published" },
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <input type="hidden" name="category_id" value={categoryId} />
                <Select
                  value={categoryId}
                  onChange={setCategoryId}
                  placeholder="Select a category"
                  options={[
                    { label: "None", value: "" },
                    ...categories.map(c => ({ label: c.name, value: c.id.toString() }))
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Region
                </label>
                <input type="hidden" name="region_id" value={regionId} />
                <Select
                  value={regionId}
                  onChange={setRegionId}
                  placeholder="Select a region"
                  options={[
                    { label: "Global (No Region)", value: "" },
                    ...regions.map(r => ({ label: r.name, value: r.id.toString() }))
                  ]}
                />
              </div>
            </div>
          </FormSection>

        </fieldset>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-8">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} isLoading={loading}>
            {isEditing ? "Save Changes" : "Create Article"}
          </Button>
        </div>
      </motion.form>
    </PageContainer>
  );
}
