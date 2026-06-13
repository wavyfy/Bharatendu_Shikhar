"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";

export function DarkModeToggleItem() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="group flex w-full items-center justify-between px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low transition-colors opacity-0">
        <span className="flex items-center gap-3">Loading...</span>
      </div>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;
  const isDark = currentTheme === "dark";

  const toggle = (event: React.MouseEvent) => {
    const nextTheme = isDark ? "light" : "dark";
    const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void>; finished: Promise<void> } };
    if (!doc.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
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
        setTheme(nextTheme);
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
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="group flex w-full items-center justify-between px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-container-low transition-colors"
    >
      <span className="flex items-center gap-3">
        <span className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {isDark ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
        </span>
        {isDark ? "Light Mode" : "Dark Mode"}
      </span>
      {/* Toggle pill */}
      <span className={`inline-flex items-center h-4 w-7 rounded-full transition-colors duration-300 ${isDark ? "bg-[#CC2200]" : "bg-slate-200"}`}>
        <span className={`h-3 w-3 rounded-full bg-surface shadow-sm transition-transform duration-300 ${isDark ? "translate-x-3.5" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
