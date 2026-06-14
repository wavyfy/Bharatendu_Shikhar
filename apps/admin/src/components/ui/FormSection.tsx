import type { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <div className="cms-card m-4 sm:m-6 shadow-md">
      <div className="cms-card-header bg-surface-container-high px-6 py-4">
        <div>
          <h2 className="text-lg font-bold leading-tight text-on-surface tracking-wide">{title}</h2>
          {description && (
            <p className="mt-1.5 text-sm text-slate-400 font-medium">{description}</p>
          )}
        </div>
      </div>

      <div className="p-6 bg-transparent">
        <div className="flex flex-col gap-y-7">
          {children}
        </div>
      </div>
    </div>
  );
}
