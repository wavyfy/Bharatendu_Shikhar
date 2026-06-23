import { cn } from "@/lib/utils";

export type StatusVariant = "draft" | "published" | "expired" | "active" | "inactive" | "scheduled" | "globally_disabled";

interface StatusBadgeProps {
  variant: StatusVariant;
  className?: string;
}

/**
 * Renders a styled status badge displaying the current status.
 *
 * @returns A span element with variant-specific styling and label.
 */
export function StatusBadge({ variant, className }: StatusBadgeProps) {
  const styles = {
    published: "bg-[#0284c7] text-white",
    active: "bg-emerald-700 text-white",
    draft: "bg-on-surface-variant text-white",
    inactive: "bg-on-surface-variant text-white",
    expired: "bg-red-700 text-white",
    scheduled: "bg-amber-600 text-white",
    globally_disabled: "bg-slate-700 text-white",
  };

  const labels = {
    published: "Published",
    active: "Active",
    draft: "Draft",
    inactive: "Inactive",
    expired: "Expired",
    scheduled: "Scheduled",
    globally_disabled: "Globally Hidden",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {labels[variant]}
    </span>
  );
}
