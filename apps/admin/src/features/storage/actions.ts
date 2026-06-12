"use server";

import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { randomUUID } from "crypto";

async function getAuth() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: (name, value, options) => cookieStore.set(name, value, options),
    remove: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  return { supabase, user };
}

export async function uploadImageAction(formData: FormData) {
  try {
    const { supabase } = await getAuth();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "articles";
    
    if (!file) throw new Error("No file provided");
    if (file.size > 2 * 1024 * 1024) throw new Error("File exceeds 2MB limit");
    
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Invalid file type. Only JPG, PNG, WEBP and GIF are allowed.");
    }

    const ext = file.name.split('.').pop() || "jpg";
    const fileName = `${randomUUID()}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upload file" 
    };
  }
}

export async function deleteImageAction(url: string, bucket = "articles") {
  return deleteFileAction(url, bucket);
}

export async function deleteFileAction(url: string, bucket = "articles") {
  try {
    const { supabase } = await getAuth();
    if (!url) return { success: true }; // Nothing to delete
    
    // Extract filename from the standard Supabase public URL
    const parts = url.split("/");
    const fileName = parts.pop();
    
    if (!fileName) throw new Error("Invalid URL format");

    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) throw error;

    return { success: true };
  } catch (error: unknown) {
    console.error("Delete error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete file" 
    };
  }
}

export async function uploadPdfAction(formData: FormData) {
  try {
    const { supabase } = await getAuth();
    const file = formData.get("file") as File;
    const bucket = formData.get("bucket") as string || "epapers";
    
    if (!file) throw new Error("No file provided");
    if (file.size > 50 * 1024 * 1024) throw new Error("File exceeds 50MB limit");
    
    if (file.type !== "application/pdf") {
      throw new Error("Invalid file type. Only PDF is allowed.");
    }

    const fileName = `${randomUUID()}.pdf`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return { success: true, url: publicUrl };
  } catch (error: unknown) {
    console.error("Upload error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to upload file" 
    };
  }
}

export async function getSignedUploadUrlAction(bucket: string, fileName: string) {
  try {
    const { supabase } = await getAuth();
    const { data, error } = await supabase.storage.from(bucket).createSignedUploadUrl(fileName);
    if (error) throw error;
    
    return { success: true, signedUrl: data.signedUrl, token: data.token, path: data.path };
  } catch (error: unknown) {
    console.error("Signed URL error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to generate upload URL" 
    };
  }
}

export async function cleanupOrphanedFilesAction(bucket = "articles") {
  try {
    const { supabase, user } = await getAuth();
    
    // Require admin
    const { supabaseAdmin } = await import("@repo/api");
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
      
    if ((profile as unknown as { role?: string })?.role !== "admin") {
      throw new Error("Admin access required for cleanup");
    }

    // 1. Get all files in bucket
    const { data: files, error: listError } = await supabase.storage.from(bucket).list();
    if (listError) throw listError;
    if (!files || files.length === 0) return { success: true, deletedCount: 0 };

    const fileNames = files.map(f => f.name).filter(n => n !== ".emptyFolderPlaceholder");

    // 2. Get all used files from DB
    let usedFileNames: string[] = [];
    
    if (bucket === "articles") {
      const { data: articles } = await supabase.from("articles").select("featured_image").not("featured_image", "is", null);
      usedFileNames = (articles || []).map(a => {
        const parts = ((a as { featured_image: string }).featured_image).split("/");
        return parts.pop() || "";
      });
    } else if (bucket === "epapers") {
      const { data: epapers } = await supabase.from("epapers").select("pdf_url, thumbnail_url");
      const pdfs = (epapers || []).filter(e => (e as { pdf_url?: string }).pdf_url).map(e => ((e as { pdf_url: string }).pdf_url).split("/").pop() || "");
      const thumbs = (epapers || []).filter(e => (e as { thumbnail_url?: string }).thumbnail_url).map(e => ((e as { thumbnail_url: string }).thumbnail_url).split("/").pop() || "");
      usedFileNames = [...pdfs, ...thumbs];
    } else {
      throw new Error("Unsupported bucket for automated cleanup");
    }

    // 3. Find orphans
    const usedSet = new Set(usedFileNames);
    const orphans = fileNames.filter(name => !usedSet.has(name));

    if (orphans.length === 0) return { success: true, deletedCount: 0 };

    // 4. Delete orphans
    const { error: deleteError } = await supabase.storage.from(bucket).remove(orphans);
    if (deleteError) throw deleteError;

    return { success: true, deletedCount: orphans.length };
  } catch (error: unknown) {
    console.error("Cleanup error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to cleanup files" 
    };
  }
}

