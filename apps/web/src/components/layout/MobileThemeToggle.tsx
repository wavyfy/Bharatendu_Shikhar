"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

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
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="flex p-1 bg-gray-100 dark:bg-[#1A1A1A] rounded-full border border-gray-200 dark:border-news-border w-max">
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = theme === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setTheme(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
              isActive
                ? "bg-white dark:bg-news-bg text-black dark:text-news-accent shadow-sm"
                : "text-gray-500 dark:text-news-text-muted hover:text-black dark:hover:text-white"
            }`}
          >
            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
