import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ReactNode;
}

const DEFAULT_ICON = (
  <svg
    className="w-10 h-10 text-gray-300"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
    />
  </svg>
);

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon = DEFAULT_ICON,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-dashed border-gray-300 rounded-lg bg-white">
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-semibold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 max-w-xs">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-5 inline-flex items-center gap-1.5 bg-[#111] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
