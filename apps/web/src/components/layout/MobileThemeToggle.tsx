"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";

export function MobileThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-[180px] bg-gray-100 rounded-full animate-pulse"></div>;
  }

  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-[#1A1A1A] rounded-full border border-gray-200 dark:border-news-border w-max">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-white dark:bg-news-bg text-black dark:text-news-accent shadow-sm"
                : "text-gray-500 dark:text-news-text-muted hover:text-black dark:hover:text-white"
            }`}
            onClick={(event) => {
              const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
              if (!doc.startViewTransition) {
                setTheme(opt.value);
                return;
              }

              const rect = event.currentTarget.getBoundingClientRect();
              const x = event.clientX || rect.left + rect.width / 2;
              const y = event.clientY || rect.top + rect.height / 2;
              const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
              );

              const style = document.createElement("style");
              style.textContent = `
                ::view-transition-old(root),
                ::view-transition-new(root) {
                  animation: none;
                  mix-blend-mode: normal;
                }
                ::view-transition-old(root) {
                  z-index: 1;
                }
                ::view-transition-new(root) {
                  z-index: 2147483646;
                }
              `;
              document.head.appendChild(style);

              const transition = doc.startViewTransition(() => {
                flushSync(() => {
                  setTheme(opt.value);
                });
              });

              transition.ready.then(() => {
                document.documentElement.animate(
                  {
                    clipPath: [
                      `circle(0px at ${x}px ${y}px)`,
                      `circle(${endRadius}px at ${x}px ${y}px)`,
                    ],
                  },
                  {
                    duration: 600,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    pseudoElement: "::view-transition-new(root)",
                  }
                );
              });

              transition.finished.finally(() => {
                document.head.removeChild(style);
              });
            }}

          >
            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} className="transition-transform duration-500 group-hover:rotate-180" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
