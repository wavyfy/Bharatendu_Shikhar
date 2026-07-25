"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import type { RegionRow } from "@/features/regions/types";
import type { EpaperWithRelations } from "../types";
import { createEpaperAction, updateEpaperAction } from "../actions";
import { getSignedUploadUrlAction, deleteFileAction } from "@/features/storage/actions";
import { supabase } from "@repo/api/src/supabase/client";
import { FormSection } from "@/components/ui/FormSection";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Dropzone } from "@/components/ui/Dropzone";
import { motion } from "framer-motion";

const PDF_MAX_BYTES = 50 * 1024 * 1024; // 50 MB

interface EpaperFormProps {
  initialData?: EpaperWithRelations;
  regions: RegionRow[];
}

export function EpaperForm({ initialData, regions }: EpaperFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [pdfUrlState, setPdfUrlState] = useState<string>(initialData?.pdf_url || "");
  const pdfUrlRef = useRef(initialData?.pdf_url || "");
  const setPdfUrl = (url: string) => {
    pdfUrlRef.current = url;
    setPdfUrlState(url);
  };
  const pdfUrl = pdfUrlState;

  const [thumbnailUrlState, setThumbnailUrlState] = useState<string>(initialData?.thumbnail_url || "");
  const thumbnailUrlRef = useRef(initialData?.thumbnail_url || "");
  const setThumbnailUrl = (url: string) => {
    thumbnailUrlRef.current = url;
    setThumbnailUrlState(url);
  };
  const thumbnailUrl = thumbnailUrlState;
  const [regionId, setRegionId] = useState(initialData?.region_id?.toString() || "");
  const [isGeneratingThumb, setIsGeneratingThumb] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfUrl) {
      setError("Please upload a PDF file");
      return;
    }
    
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("pdf_url", pdfUrl);
    if (thumbnailUrl) {
      formData.append("thumbnail_url", thumbnailUrl);
    }

    const publishedAtStr = formData.get("published_at_date") as string;
    if (publishedAtStr) {
      formData.set("published_at", new Date(publishedAtStr).toISOString());
    }
    
    const expiryDateStr = formData.get("expiry_date_input") as string;
    if (expiryDateStr) {
      formData.set("expiry_date", new Date(expiryDateStr).toISOString());
    }

    startTransition(async () => {
      let result;
      if (initialData?.id) {
        result = await updateEpaperAction(initialData.id, formData);
      } else {
        result = await createEpaperAction(formData);
      }

      if (result.success) {
        toast.success(initialData ? "E-Paper updated." : "E-Paper created.");
        router.push("/epapers");
        router.refresh();
      } else {
        const msg = result.error || "Something went wrong";
        setError(msg);
        toast.error(msg);
      }
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (file.size > PDF_MAX_BYTES) {
      setError("File exceeds 50 MB limit.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const fileName = `${crypto.randomUUID()}.pdf`;
    const res = await getSignedUploadUrlAction("epapers", fileName);
    
    if (res.success && res.signedUrl && res.token && res.path) {
      const { error: uploadError } = await supabase.storage
        .from("epapers")
        .uploadToSignedUrl(res.path, res.token, file);

      if (uploadError) {
        const msg = uploadError.message || "Failed to upload file to storage";
        setError(msg);
        toast.error(msg);
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("epapers")
          .getPublicUrl(res.path);

        const currentPdf = pdfUrlRef.current;
        if (currentPdf && currentPdf !== initialData?.pdf_url) {
          await deleteFileAction(currentPdf, "epapers");
        }
        setPdfUrl(publicUrl);
        
        toast.success("PDF uploaded. Generating thumbnail...");
        const thumbFile = await generateThumbnail(file);
        if (thumbFile) {
           await handleThumbnailUpload(thumbFile);
        }
      }
    } else {
      const msg = res.error || "Failed to initiate file upload";
      setError(msg);
      toast.error(msg);
    }

    setIsUploading(false);
  };

  const generateThumbnail = async (file: File) => {
    try {
      setIsGeneratingThumb(true);
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.width = viewport.width;
      canvas.height = viewport.height * 0.4; // Crop to top half to save storage
      
      // Some versions of pdfjs-dist require canvas element in render params
      await page.render({ canvasContext: context, viewport, canvas } as unknown as Parameters<typeof page.render>[0]).promise;
      
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.8));
      if (!blob) throw new Error("Could not create image blob");
      
      const thumbFile = new File([blob], file.name.replace('.pdf', '-thumb.jpg'), { type: 'image/jpeg' });
      return thumbFile;
    } catch (err) {
      console.error("Thumbnail generation failed:", err);
      toast.error("Auto-thumbnail failed. You can upload one manually.");
      return null;
    } finally {
      setIsGeneratingThumb(false);
    }
  };

  const handleGenerateMissingThumbnail = async () => {
    if (!pdfUrl) return;
    try {
      setIsGeneratingThumb(true);
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const blob = await response.blob();
      const fileName = pdfUrl.split('/').pop() || "document.pdf";
      const file = new File([blob], fileName, { type: "application/pdf" });
      
      const thumbFile = await generateThumbnail(file);
      if (thumbFile) {
        await handleThumbnailUpload(thumbFile);
      }
    } catch (err) {
      console.error("Fetch PDF failed:", err);
      toast.error("Failed to fetch PDF for thumbnail generation.");
      setIsGeneratingThumb(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed for thumbnail");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Thumbnail exceeds 5 MB limit.");
      return;
    }

    setIsUploadingThumb(true);

    const fileName = `thumb-${crypto.randomUUID()}.${file.name.split('.').pop() || 'jpg'}`;
    const res = await getSignedUploadUrlAction("epaper_thumbnails", fileName);
    
    if (res.success && res.signedUrl && res.token && res.path) {
      const { error: uploadError } = await supabase.storage
        .from("epaper_thumbnails")
        .uploadToSignedUrl(res.path, res.token, file);

      if (uploadError) {
        toast.error(uploadError.message || "Failed to upload thumbnail");
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from("epaper_thumbnails")
          .getPublicUrl(res.path);

        const currentThumb = thumbnailUrlRef.current;
        if (currentThumb && currentThumb !== initialData?.thumbnail_url) {
          await deleteFileAction(currentThumb, "epaper_thumbnails").catch(console.error);
        }
        setThumbnailUrl(publicUrl);
        toast.success("Thumbnail uploaded successfully");
      }
    } else {
      toast.error(res.error || "Failed to initiate thumbnail upload");
    }

    setIsUploadingThumb(false);
  };

  const handleDeleteThumbnail = async () => {
    const currentThumb = thumbnailUrlRef.current;
    if (currentThumb && currentThumb !== initialData?.thumbnail_url) {
      setIsUploadingThumb(true);
      await deleteFileAction(currentThumb, "epaper_thumbnails").catch(console.error);
      setIsUploadingThumb(false);
    }
    setThumbnailUrl("");
  };

  const handleDeletePdf = async () => {
    const currentPdf = pdfUrlRef.current;
    if (currentPdf && currentPdf !== initialData?.pdf_url) {
      setIsUploading(true);
      await deleteFileAction(currentPdf, "epapers");
      setIsUploading(false);
    }
    setPdfUrl("");
    await handleDeleteThumbnail();
  };
  
  const formatDateForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split('T')[0];
  };

  return (
    <>

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

        <fieldset disabled={isPending || isUploading} className="group-disabled:opacity-70 transition-opacity">
          
          <FormSection 
            title="E-Paper Document" 
            description="The PDF file and basic details."
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                E-Paper Title <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                placeholder="e.g. Daily Edition - Jan 1"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                PDF File <span className="text-red-500">*</span>
              </label>
              {pdfUrl ? (
                <div className="flex items-center justify-between p-4 bg-surface-container-low border border-gray-200 dark:border-outline-variant rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate">
                      View Uploaded PDF
                    </a>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={handleDeletePdf}
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full mt-2 relative">
                  {isUploading && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        <svg className="animate-spin h-5 w-5 text-slate-500 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Uploading...
                      </div>
                    </div>
                  )}
                  <Dropzone
                    label="Click or drag to upload PDF"
                    helperText="PDF only · Max 50 MB"
                    accept="application/pdf"
                    disabled={isUploading}
                    onFileSelect={handleFileUpload}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5 mt-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Thumbnail Image (Optional)
              </label>
              <p className="text-xs text-slate-500 mb-2">
                Auto-generated when you upload a PDF, but you can manually override it here.
              </p>
              {thumbnailUrl ? (
                <div className="flex items-center justify-between p-4 bg-surface-container-low border border-gray-200 dark:border-outline-variant rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbnailUrl} alt="Thumbnail" className="w-24 aspect-video object-cover object-top rounded shadow-sm" />
                    <a href={thumbnailUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline truncate">
                      View Uploaded Thumbnail
                    </a>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                    onClick={handleDeleteThumbnail}
                    disabled={isUploadingThumb || isGeneratingThumb}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full relative">
                  {(isUploadingThumb || isGeneratingThumb) && (
                    <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-900 dark:text-slate-100">
                        <svg className="animate-spin h-5 w-5 text-slate-500 dark:text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isGeneratingThumb ? "Generating..." : "Uploading..."}
                      </div>
                    </div>
                  )}
                  <Dropzone
                    label="Click or drag to upload manual thumbnail"
                    helperText="Image only · Max 5 MB"
                    accept="image/*"
                    disabled={isUploadingThumb || isGeneratingThumb || isUploading}
                    onFileSelect={handleThumbnailUpload}
                  />
                  {!thumbnailUrl && pdfUrl && (
                    <div className="mt-4 w-full">
                      <div className="relative flex items-center py-2">
                        <div className="grow border-t border-gray-200 dark:border-outline-variant"></div>
                        <span className="shrink-0 mx-4 text-xs text-gray-400 font-medium uppercase tracking-wider">OR</span>
                        <div className="grow border-t border-gray-200 dark:border-outline-variant"></div>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleGenerateMissingThumbnail}
                        disabled={isGeneratingThumb || isUploadingThumb || isUploading}
                        className="w-full mt-2"
                      >
                        <span className="material-symbols-outlined text-[18px] mr-2">magic_button</span>
                        Auto-generate from PDF
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormSection>

          <FormSection
            title="Publishing Settings"
            description="Control when and where this e-paper appears."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Region
                </label>
                <input type="hidden" name="region_id" value={regionId} />
                <Select
                  value={regionId}
                  onChange={setRegionId}
                  placeholder="No Region"
                  options={[
                    { label: "No Region", value: "" },
                    ...regions.map(r => ({ label: r.name, value: r.id.toString() }))
                  ]}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="published_at_date" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Publish Date
                </label>
                <Input
                  type="date"
                  id="published_at_date"
                  name="published_at_date"
                  defaultValue={formatDateForInput(initialData?.published_at)}
                />
                <p className="text-xs text-slate-500">If blank, remains a draft.</p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="expiry_date_input" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Expiry Date
                </label>
                <Input
                  type="date"
                  id="expiry_date_input"
                  name="expiry_date_input"
                  defaultValue={formatDateForInput(initialData?.expiry_date)}
                />
                <p className="text-xs text-slate-500">Optional. Auto-unpublish after this date.</p>
              </div>
            </div>
          </FormSection>

        </fieldset>

        <div className="mt-6 flex items-center justify-end gap-x-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.push("/epapers")}
            disabled={isPending || isUploading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            isLoading={isPending}
            disabled={isUploading}
          >
            {initialData ? "Update E-Paper" : "Create E-Paper"}
          </Button>
        </div>
      </motion.form>
    </>
  );
}
