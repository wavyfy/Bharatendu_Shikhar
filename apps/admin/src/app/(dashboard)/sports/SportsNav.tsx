"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SportsNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/sports/competitions", label: "Competitions" },
    { href: "/sports/matches", label: "Matches" },
    { href: "/sports/teams", label: "Teams" },
  ];

  return (
    <div className="flex border-b border-outline-variant overflow-x-auto custom-scrollbar">
      {tabs.map((tab) => {
        const isActive = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
