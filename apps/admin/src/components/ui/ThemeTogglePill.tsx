"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";

export function ThemeTogglePill() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className="w-20 h-8 rounded-full bg-slate-100 dark:bg-slate-800" />;
  }

  const toggleTheme = (event: React.MouseEvent) => {
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
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
          duration: 800,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });

    transition.finished.finally(() => {
      document.head.removeChild(style);
    });
  };

  const isDark = theme === "dark" || (theme === "system" && mounted && window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <button
      onClick={toggleTheme}
      className="group bg-white dark:bg-[#1A1A1A] hover:bg-gray-100 dark:hover:bg-[#2A2A2A] rounded-full flex items-center justify-center w-10 h-10 transition-colors text-slate-700 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-800"
      aria-label="Toggle theme"
    >
      {!isDark && <Sun size={18} className="transition-transform duration-500 group-hover:rotate-90" />}
      {isDark && <Moon size={18} className="transition-transform duration-500 group-hover:-rotate-90" />}
    </button>
  );
}
