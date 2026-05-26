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
    if (file.size > 5 * 1024 * 1024) throw new Error("File exceeds 5MB limit");
    
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
