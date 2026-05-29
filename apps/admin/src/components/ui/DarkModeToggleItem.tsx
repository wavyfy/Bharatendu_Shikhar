"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function DarkModeToggleItem() {
  const { theme, toggle } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      className="group flex w-full items-center justify-between px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <span className="flex items-center gap-3">
        <span className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {theme === "dark" ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
        </span>
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </span>
      {/* Toggle pill */}
      <span className={`inline-flex items-center h-4 w-7 rounded-full transition-colors duration-300 ${theme === "dark" ? "bg-[#CC2200]" : "bg-slate-200"}`}>
        <span className={`h-3 w-3 rounded-full bg-white shadow-sm transition-transform duration-300 ${theme === "dark" ? "translate-x-3.5" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}
