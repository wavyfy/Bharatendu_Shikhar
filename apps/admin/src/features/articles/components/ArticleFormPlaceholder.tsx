"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticleAction, updateArticleAction } from "../actions";
import { uploadImageAction } from "@/features/storage/actions";
import { RichEditor } from "@/components/ui/RichEditor";
import type { ArticleWithRelations } from "../types";
import type { CategoryRow } from "@/features/categories/types";
import type { RegionRow } from "@/features/regions/types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface ArticleFormProps {
  initialData?: ArticleWithRelations;
  categories: CategoryRow[];
  regions: RegionRow[];
}

export function ArticleFormPlaceholder({ initialData, categories, regions }: ArticleFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  
  // Content state
  const [content, setContent] = useState(initialData?.content || "");
  
  // Image preview state
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.featured_image || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const isEditing = !!initialData;

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File must be smaller than 5MB");
        e.target.value = "";
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(initialData?.featured_image || null);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const status = formData.get("status") as "draft" | "published";
    
    const category_id_raw = formData.get("category_id") as string;
    const region_id_raw = formData.get("region_id") as string;
    
    const category_id = category_id_raw ? parseInt(category_id_raw, 10) : null;
    const region_id = region_id_raw ? parseInt(region_id_raw, 10) : null;

    let finalImageUrl = initialData?.featured_image || "";

    if (imageFile) {
      const uploadForm = new FormData();
      uploadForm.append("file", imageFile);
      uploadForm.append("bucket", "articles");
      
      const uploadRes = await uploadImageAction(uploadForm);
      if (!uploadRes.success || !uploadRes.url) {
        toast.error(uploadRes.error || "Failed to upload image");
        setLoading(false);
        return;
      }
      finalImageUrl = uploadRes.url;
    }

    const payload = {
      title,
      excerpt,
      content,
      featured_image: finalImageUrl,
      status,
      category_id,
      region_id,
    };

    const result = isEditing && initialData 
      ? await updateArticleAction(initialData.id, payload)
      : await createArticleAction(payload);

    if (result.success) {
      toast.success(isEditing ? "Article updated." : "Article created.");
      router.push("/articles");
    } else {
      toast.error(result.error || "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 border border-neutral-200 rounded-lg max-w-4xl">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Title
            </label>
            <input 
              type="text" 
              id="title"
              name="title" 
              required 
              minLength={5}
              className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500" 
              placeholder="Enter article title..."
              defaultValue={initialData?.title}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="excerpt" className="block text-sm font-medium text-neutral-700 mb-1">
              Excerpt
            </label>
            <textarea 
              id="excerpt"
              name="excerpt" 
              rows={2}
              className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500" 
              placeholder="Brief summary..."
              defaultValue={initialData?.excerpt || ""}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="content" className="block text-sm font-medium text-neutral-700 mb-1">
              Content
            </label>
            <input type="hidden" name="content" value={content} />
            <RichEditor value={content} onChange={setContent} />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="featured_image" className="block text-sm font-medium text-neutral-700 mb-1">
              Featured Image
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-1">
                <input 
                  type="file" 
                  id="featured_image"
                  name="featured_image" 
                  accept="image/jpeg, image/png, image/webp, image/gif"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500" 
                />
                <p className="mt-1 text-xs text-neutral-500">Max 5MB. JPG, PNG, WEBP, GIF allowed.</p>
              </div>
              {imagePreview && (
                <div className="w-32 h-24 relative rounded border border-gray-200 overflow-hidden shrink-0 bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <select 
              id="category_id"
              name="category_id" 
              className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500"
              defaultValue={initialData?.category_id || ""}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region_id" className="block text-sm font-medium text-neutral-700 mb-1">
              Region
            </label>
            <select 
              id="region_id"
              name="region_id" 
              className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500"
              defaultValue={initialData?.region_id || ""}
            >
              <option value="">None</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select 
              id="status"
              name="status" 
              className="w-full px-3 py-2 border border-neutral-300 rounded focus:ring-red-500 focus:border-red-500"
              defaultValue={initialData?.status || "draft"}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : (isEditing ? "Update Article" : "Save Article")}
          </Button>
        </div>
      </form>
    </div>
  );
}
