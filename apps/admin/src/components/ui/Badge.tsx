type BadgeVariant = "default" | "accent" | "success" | "muted";

const VARIANTS: Record<BadgeVariant, string> = {
  default: "bg-[#111] text-white",
  accent: "bg-[#CC2200] text-white",
  success: "bg-emerald-100 text-emerald-700",
  muted: "bg-gray-100 text-gray-600",
};

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${VARIANTS[variant]}`}
    >
      {children}
    </span>
  );
}
