"use client";

export function CurrentDate() {
  const d = new Date();
  const hiDateStr = d.toLocaleDateString("hi-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).replace(/अक्तू(बर|°)?/g, "अक्टूबर");

  const enDateStr = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <span suppressHydrationWarning>
      <span className="show-in-hi" suppressHydrationWarning>{hiDateStr}</span>
      <span className="show-in-en" translate="no" suppressHydrationWarning>{enDateStr}</span>
    </span>
  );
}
