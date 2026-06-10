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
    "border border-outline-variant hover:border-primary text-on-surface bg-surface hover:bg-surface-container-low hover:text-primary",
  ghost:
    "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest",
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
