"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

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

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="bg-gray-200 dark:bg-[#1A1A1A] hover:bg-gray-300 dark:hover:bg-[#2A2A2A] rounded-full p-1.5 transition-colors text-black dark:text-news-text"
      aria-label="Toggle theme"
    >
      {theme === "light" && <Sun size={14} />}
      {theme === "dark" && <Moon size={14} />}
    </button>
  );
}
