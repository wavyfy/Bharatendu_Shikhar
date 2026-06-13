"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { flushSync } from "react-dom";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <button className="bg-gray-200 dark:bg-[#1A1A1A] hover:bg-gray-300 dark:hover:bg-[#2A2A2A] rounded-full p-1.5 transition-colors">
        <Sun size={14} className="opacity-0" />
      </button>
    );
  }

  const toggleTheme = (event: React.MouseEvent) => {
    const nextTheme = theme === "light" ? "dark" : "light";
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

  return (
    <button
      onClick={toggleTheme}
      className="group bg-gray-300 dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-[#2A2A2A] rounded-full flex items-center justify-center w-8 h-8 transition-colors text-black dark:text-news-text"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun size={16} className="transition-transform duration-500 group-hover:rotate-90" />}
      {theme === "dark" && <Moon size={16} className="transition-transform duration-500 group-hover:-rotate-90" />}
    </button>
  );
}
