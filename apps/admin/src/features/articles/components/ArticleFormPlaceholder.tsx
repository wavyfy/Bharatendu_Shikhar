"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { CategoryRow } from "@/features/categories/types";
import type { RegionRow } from "@/features/regions/types";
import type { ArticleWithRelations, BadgeRow } from "../types";
import { createArticleAction, updateArticleAction } from "../actions";
import { RichEditor } from "@/components/ui/RichEditor";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { BadgeMultiSelect } from "@/components/ui/BadgeMultiSelect";
import { PageContainer } from "@/components/ui/PageContainer";
import { PageHeader } from "@/components/ui/PageHeader";
import { LiveUpdatesSection } from "./LiveUpdatesSection";
import { motion } from "framer-motion";

interface ArticleFormProps {
  initialData?: ArticleWithRelations;
  categories: CategoryRow[];
  regions: RegionRow[];
  badges: BadgeRow[];
}

export function ArticleFormPlaceholder({ initialData, categories, regions, badges }: ArticleFormProps) {
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
  const [isLive, setIsLive] = useState<boolean>(initialData?.is_live ?? false);
  const [selectedBadgeIds, setSelectedBadgeIds] = useState<number[]>(
    initialData?.article_badges?.map((ab) => ab.badge_id) ?? []
  );

  // Find Live badge from available badges list (by slug)
  const liveBadge = badges.find((b) => b.slug === "live");

  /**
   * When toggling is_live ON: auto-add the Live badge if not already selected.
   * When toggling is_live OFF: do not forcibly remove it (editor's choice).
   */
  function handleIsLiveToggle(checked: boolean) {
    setIsLive(checked);
    if (checked && liveBadge && !selectedBadgeIds.includes(liveBadge.id)) {
      setSelectedBadgeIds((prev) => [...prev, liveBadge.id]);
    }
  }

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
      is_live: isLive,
      excerpt: excerpt || null,
      category_id: categoryId ? parseInt(categoryId, 10) : null,
      region_id: regionId ? parseInt(regionId, 10) : null,
    };

    startTransition(async () => {
      const result = isEditing && initialData
        ? await updateArticleAction(initialData.id, payload, selectedBadgeIds)
        : await createArticleAction(payload, selectedBadgeIds);

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
          
          {/* ─── Content ─────────────────────────────────────────────── */}
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
                rows={3}
                className="flex w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-shadow duration-150"
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

          {/* ─── Organization ────────────────────────────────────────── */}
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

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Badges
                </label>
                <BadgeMultiSelect
                  badges={badges}
                  value={selectedBadgeIds}
                  onChange={setSelectedBadgeIds}
                  placeholder="Attach badges (e.g. Breaking News, Live)"
                />
                <p className="text-xs text-slate-500">
                  Articles can have multiple badges.
                </p>
              </div>
            </div>
          </FormSection>

          {/* ─── Live Article Toggle ──────────────────────────────────── */}
          <FormSection
            title="Live Article"
            description="Enable for continuously updated stories: elections, breaking news, sports events, disasters."
          >
            <label
              htmlFor="is-live-toggle"
              className="flex items-start gap-4 cursor-pointer select-none"
            >
              {/* Toggle switch */}
              <div className="relative mt-0.5 shrink-0">
                <input
                  id="is-live-toggle"
                  type="checkbox"
                  checked={isLive}
                  onChange={(e) => handleIsLiveToggle(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`
                    w-11 h-6 rounded-full transition-colors duration-200
                    ${isLive ? "bg-red-500" : "bg-outline-variant"}
                  `}
                />
                <div
                  className={`
                    absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm
                    transition-transform duration-200
                    ${isLive ? "translate-x-5" : "translate-x-0"}
                  `}
                />
              </div>

              {/* Label text */}
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-on-surface flex items-center gap-2">
                  {isLive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                  )}
                  {isLive ? "Live Article enabled" : "Enable Live Article"}
                </span>
                <span className="text-xs text-slate-400">
                  {isLive
                    ? "Live updates timeline will appear below. The \"Live\" badge has been auto-selected."
                    : "Turning this on enables the live updates timeline and auto-selects the Live badge."}
                </span>
              </div>
            </label>
          </FormSection>

        </fieldset>

        {/* ─── Submit ──────────────────────────────────────────────── */}
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

      {/* ─── Hint: toggle is ON locally but not saved yet ───────────────── */}
      {isEditing && initialData && isLive && !initialData.is_live && (
        <div className="max-w-4xl mx-auto pb-12 -mt-6">
          <div className="cms-card m-4 sm:m-6 shadow-md">
            <div className="p-6 flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest rounded-xl">
              <svg className="w-5 h-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p>
                Click <strong className="text-on-surface">Save Changes</strong> to enable Live Article — you can then manage timeline updates from the articles list.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Hint for create mode ─────────────────────────────────────── */}
      {!isEditing && isLive && (
        <div className="max-w-4xl mx-auto pb-12 -mt-6">
          <div className="cms-card m-4 sm:m-6 shadow-md">
            <div className="p-6 flex items-center gap-3 text-sm text-on-surface-variant bg-surface-container-lowest rounded-xl">
              <svg className="w-5 h-5 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              <p>
                Save the article first — you can then manage the <strong className="text-on-surface">Live Updates</strong> timeline from the articles list.
              </p>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
