"use client";

import * as React from "react";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DropzoneProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  onFileSelect?: (file: File) => void;
  onFileClear?: () => void;
  value?: File | null | string; // Can be a File object or a URL string
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
  helperText?: string;
}

export function Dropzone({
  onFileSelect,
  onFileClear,
  value,
  accept,
  label = "Upload file",
  helperText = "Drag and drop or click to browse",
  className,
  ...props
}: DropzoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        onFileSelect?.(file);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        onFileSelect?.(file);
      }
    },
    [onFileSelect]
  );

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileClear?.();
  };

  const getDisplayName = () => {
    if (!value) return null;
    if (typeof value === "string") {
      const parts = value.split("/");
      return parts[parts.length - 1];
    }
    return value.name;
  };

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-surface-container-lowest dark:bg-surface-container-highest transition-colors duration-200 hover:bg-slate-100 dark:hover:bg-surface-container-high",
        isDragging ? "border-slate-400 bg-slate-100 dark:bg-surface-container-high" : "border-slate-200 dark:border-outline-variant",
        value && "border-slate-300 dark:border-outline-variant bg-surface dark:bg-surface cursor-default hover:bg-surface",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !value && fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
        {...props}
      />

      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
        <AnimatePresence mode="wait">
          {value ? (
            <motion.div
              key="filled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex w-full flex-col items-center gap-2"
            >
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-outline-variant bg-surface px-4 py-2 shadow-sm">
                <span className="max-w-[200px] truncate text-sm font-medium text-slate-900 dark:text-slate-200">
                  {getDisplayName()}
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="rounded-full p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <X className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              <UploadCloud
                className={cn("h-8 w-8 text-slate-400 transition-colors", isDragging && "text-slate-500")}
                strokeWidth={1.5}
              />
              <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{label}</p>
              <p className="text-xs text-slate-500">{helperText}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
