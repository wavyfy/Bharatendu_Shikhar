import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm overflow-hidden m-4 sm:m-6">
      <div className="border-b border-slate-300 dark:border-slate-600 bg-slate-200 dark:bg-slate-700/80 px-6 py-5">
        <h2 className="text-base font-semibold leading-tight text-slate-900 dark:text-slate-100">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>

      <div className="px-6 py-6 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex flex-col gap-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
