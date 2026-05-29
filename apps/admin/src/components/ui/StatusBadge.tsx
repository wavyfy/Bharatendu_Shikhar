import { cn } from "@/lib/utils";

type StatusVariant = "draft" | "published" | "expired";

interface StatusBadgeProps {
  variant: StatusVariant;
  className?: string;
}

export function StatusBadge({ variant, className }: StatusBadgeProps) {
  const styles = {
    draft: "bg-slate-100 text-slate-700 border-slate-200",
    published: "bg-green-50 text-green-700 border-green-200",
    expired: "bg-red-50 text-red-700 border-red-200",
  };

  const labels = {
    draft: "Draft",
    published: "Published",
    expired: "Expired",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border",
        styles[variant],
        className
      )}
    >
      {labels[variant]}
    </span>
  );
}
