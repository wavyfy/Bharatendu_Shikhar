import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "@/components/ui/Spinner";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "btn-primary-gradient text-white hover:text-white disabled:opacity-50 shadow-sm border border-transparent",
  secondary:
    "border border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500 text-[#111] dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600",
  ghost:
    "text-gray-600 dark:text-slate-400 hover:text-[#111] dark:hover:text-slate-100 hover:bg-gray-100 dark:hover:bg-slate-700",
};

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={props.disabled || isLoading}
      className={[
        "font-semibold rounded transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:shadow-sm",
        VARIANTS[variant],
        SIZES[size],
        fullWidth ? "w-full" : "",
        isLoading ? "opacity-70 cursor-not-allowed" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isLoading && <Spinner size="sm" className="text-current" />}
      {children}
    </button>
  );
}
