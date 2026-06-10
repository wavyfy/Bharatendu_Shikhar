import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, icon, ...props }, ref) => {
    return (
      <div className="w-full relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:cursor-not-allowed disabled:opacity-50 transition-shadow duration-150",
            icon && "pl-10",
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
Input.displayName = "Input";
