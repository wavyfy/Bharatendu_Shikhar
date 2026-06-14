import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-variant dark:bg-surface-container-highest", className)}
      {...props}
    />
  )
}

export { Skeleton }
