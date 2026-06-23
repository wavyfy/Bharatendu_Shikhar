"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, ShieldCheck, FileText, PenTool, FileEdit, Mail } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  about_us: Info,
  privacy_policy: ShieldCheck,
  terms_conditions: FileText,
  editorial_policy: PenTool,
  correction_policy: FileEdit,
  contact: Mail,
};

interface LegalDialogProps {
  title: string;
  field: string;
  children: React.ReactNode;
}

export function LegalDialog({ title, field, children }: LegalDialogProps) {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  
  const Icon = iconMap[field] || Info;

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAnimationComplete = () => {
    // Only go back if the dialog is fully closed
    if (!isOpen) {
      // Small timeout to ensure DOM is clean before routing
      setTimeout(() => router.back(), 10);
    }
  };

  return (
    <AnimatePresence onExitComplete={handleAnimationComplete}>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-6 lg:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Dialog Box */}
          <motion.div 
            className="relative w-full max-w-4xl bg-white dark:bg-news-card rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-100 dark:border-news-border"
            initial={{ scale: 0.96, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-200 dark:border-news-border flex justify-between items-center bg-gray-50 dark:bg-news-bg/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl shadow-sm transform transition-transform hover:scale-105">
                  <Icon size={24} className="stroke-[2.5]" />
                </div>
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
                  {title}
                </h1>
              </div>
              <button 
                onClick={handleClose}
                className="group p-2.5 bg-white dark:bg-news-card border border-gray-200 dark:border-news-border hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-900/50 rounded-full transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md" 
                aria-label="Close"
              >
                <X size={18} className="transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-6 md:p-8 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
