"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Info, ShieldCheck, FileText, PenTool, FileEdit, Mail } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  about_us: Info,
  privacy_policy: ShieldCheck,
  terms_conditions: FileText,
  editorial_policy: PenTool,
  correction_policy: FileEdit,
  contact: Mail,
};

interface LegalStandalonePageProps {
  title: string;
  field: string;
  children: React.ReactNode;
}

export function LegalStandalonePage({ title, field, children }: LegalStandalonePageProps) {
  const router = useRouter();
  const Icon = iconMap[field] || Info;

  return (
    <motion.div
      className="min-h-screen bg-news-bg dark:bg-news-bg"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        {/* Back button */}
        <motion.button
          onClick={() => router.back()}
          className="group mb-8 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 cursor-pointer"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          aria-label="Go back"
        >
          <span className="p-1.5 rounded-full border border-gray-200 dark:border-news-border group-hover:border-red-200 dark:group-hover:border-red-900/50 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-all duration-200">
            <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
          </span>
          वापस जाएं
        </motion.button>

        {/* Header card */}
        <motion.div
          className="px-6 py-5 mb-8 border border-gray-200 dark:border-news-border rounded-2xl bg-gray-50 dark:bg-news-card flex items-center gap-3 shadow-sm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <div className="p-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl shadow-sm transform transition-transform hover:scale-105 shrink-0">
            <Icon size={24} className="stroke-[2.5]" />
          </div>
          <h1 className="text-xl md:text-2xl font-semibold uppercase tracking-tight text-black dark:text-white">
            {title}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          className="bg-white dark:bg-news-card rounded-2xl shadow-sm border border-gray-100 dark:border-news-border p-6 md:p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <article className="prose prose-lg dark:prose-invert max-w-none prose-a:text-red-600 hover:prose-a:text-red-700 prose-a:transition-colors prose-a:font-medium prose-headings:tracking-tight marker:text-red-600 prose-li:my-1">
            {children}
          </article>
        </motion.div>
      </div>
    </motion.div>
  );
}
