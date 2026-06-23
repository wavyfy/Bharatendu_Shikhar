import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full relative">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-outline-variant bg-surface-container-lowest dark:bg-surface-container-highest px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-150 scheme-light dark:scheme-dark",
            error && "border-red-500 focus:ring-red-400 text-red-900 placeholder:text-red-300",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
