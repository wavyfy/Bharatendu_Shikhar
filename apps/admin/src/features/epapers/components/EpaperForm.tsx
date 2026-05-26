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
  const [pdfUrl, setPdfUrl] = useState<string>(initialData?.pdf_url || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pdfUrl) {
      setError("Please upload a PDF file");
      return;
    }
    
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.append("pdf_url", pdfUrl);

    // Default time formatting for the date inputs to send valid timestamps
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File exceeds 50MB limit");
      return;
    }

    setIsUploading(true);
    setError(null);

    // Get a signed URL from the server to bypass Server Action size limits
    const fileName = `${crypto.randomUUID()}.pdf`;
    const res = await getSignedUploadUrlAction("epapers", fileName);
    
    if (res.success && res.signedUrl && res.token && res.path) {
      // Upload directly from the browser to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("epapers")
        .uploadToSignedUrl(res.path, res.token, file);

      if (uploadError) {
        const msg = uploadError.message || "Failed to upload file to storage";
        setError(msg);
        toast.error(msg);
      } else {
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from("epapers")
          .getPublicUrl(res.path);

        // If replacing an existing PDF, try to delete the old one
        if (pdfUrl && pdfUrl !== initialData?.pdf_url) {
          await deleteFileAction(pdfUrl, "epapers");
        }
        setPdfUrl(publicUrl);
      }
    } else {
      const msg = res.error || "Failed to initiate file upload";
      setError(msg);
      toast.error(msg);
    }

    setIsUploading(false);
  };

  const handleDeletePdf = async () => {
    // Only delete from storage if it's not the originally saved URL (to avoid breaking the db state before save)
    // If it is the original URL, we just remove it from state, and let it overwrite on save (garbage collection later)
    if (pdfUrl && pdfUrl !== initialData?.pdf_url) {
      setIsUploading(true);
      await deleteFileAction(pdfUrl, "epapers");
      setIsUploading(false);
    }
    setPdfUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Helper to format date for the native date input (YYYY-MM-DD)
  const formatDateForInput = (isoString?: string | null) => {
    if (!isoString) return "";
    return new Date(isoString).toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                E-Paper Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                defaultValue={initialData?.title}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
                placeholder="e.g. Daily Edition - Jan 1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PDF File *
              </label>
              {pdfUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg className="w-8 h-8 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline truncate">
                      View Uploaded PDF
                    </a>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={handleDeletePdf}
                    disabled={isUploading}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="pdf-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 font-medium">
                        {isUploading ? 'Uploading...' : 'Click to upload PDF'}
                      </p>
                      <p className="text-xs text-gray-500">PDF up to 50MB</p>
                    </div>
                    <input 
                      id="pdf-upload" 
                      type="file" 
                      accept="application/pdf"
                      className="hidden" 
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      disabled={isUploading}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div>
              <label htmlFor="region_id" className="block text-sm font-medium text-gray-700 mb-1">
                Region
              </label>
              <select
                id="region_id"
                name="region_id"
                defaultValue={initialData?.region_id || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="">No Region</option>
                {regions.map((region) => (
                  <option key={region.id} value={region.id}>
                    {region.name}
                  </option>
                ))}
              </select>
            </div>
            
            <hr className="border-gray-100" />
            
            <div>
              <label htmlFor="published_at_date" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                id="published_at_date"
                name="published_at_date"
                defaultValue={formatDateForInput(initialData?.published_at)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">If blank, remains a draft</p>
            </div>
            
            <div>
              <label htmlFor="expiry_date_input" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date_input"
                name="expiry_date_input"
                defaultValue={formatDateForInput(initialData?.expiry_date)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500"
              />
              <p className="text-xs text-gray-500 mt-1">Optional. Auto-unpublish after this date</p>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full text-base py-3" 
            disabled={isPending || isUploading}
          >
            {isPending ? "Saving..." : (initialData ? "Update E-Paper" : "Create E-Paper")}
          </Button>
        </div>
      </div>
    </form>
  );
}
