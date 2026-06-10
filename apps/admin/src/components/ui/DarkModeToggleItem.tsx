"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DarkModeToggleItem() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
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
