"use client";

export function CurrentDate() {
  const d = new Date();
  const dateStr = d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Use suppressHydrationWarning so React ignores timezone mismatches
  // between the server SSR date and the user's local browser date.
  return (
    <span suppressHydrationWarning>
      {dateStr}
    </span>
  );
}
