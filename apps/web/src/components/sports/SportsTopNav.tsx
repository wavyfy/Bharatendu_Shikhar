"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Trophy, Calendar, Home } from "lucide-react";

export function SportsTopNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "होम", href: "/sports", icon: Home },
    { label: "लाइव स्कोर", href: "/sports/live", icon: Activity },
    { label: "शेड्यूल", href: "/sports/schedule", icon: Calendar },
    { label: "प्रतियोगिताएं", href: "/sports/competitions", icon: Trophy },
  ];

  return (
    <>
      <div className="h-2 md:h-6 w-full pointer-events-none shrink-0" />
      <div className="sticky top-2 md:top-4 z-50 w-full flex justify-center pointer-events-none">
        <div className="px-1 md:px-4 pointer-events-auto max-w-full w-full md:w-auto md:max-w-fit flex justify-center">
          <nav className="flex items-center justify-start md:justify-center gap-1 md:gap-10 overflow-x-auto bg-news-card shadow-md border-[1.5px] border-news-border rounded-full max-w-full relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none md:custom-scrollbar px-2 md:px-8">
            {navItems.map((item) => {
              let isActive = false;
              
              if (item.href === "/sports/live") {
                isActive = pathname.startsWith("/sports/live") || pathname.startsWith("/sports/match");
              } else if (item.href === "/sports/schedule") {
                isActive = pathname.startsWith("/sports/schedule");
              } else if (item.href === "/sports/competitions") {
                isActive = pathname.startsWith("/sports/competitions");
              } else if (item.href === "/sports") {
                const parts = pathname.split('/').filter(Boolean);
                const isSpecificCompetition = parts.length === 3 && parts[0] === 'sports' && !['match', 'live', 'schedule', 'competitions'].includes(parts[1]);
                isActive = pathname === "/sports" || isSpecificCompetition;
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-2.5 md:py-4 whitespace-nowrap transition-colors duration-300 text-[12px] md:text-[14px] font-bold ${
                    isActive
                      ? "text-red-600 dark:text-red-500"
                      : "text-news-text hover:text-red-600 dark:hover:text-red-500"
                  }`}
                >
                  <item.icon className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                  {item.label}
                  <span className={`absolute bottom-1.5 md:bottom-2 left-1/2 -translate-x-1/2 h-[3px] bg-red-600 transition-all duration-300 ease-out rounded-full ${isActive ? "w-[calc(100%-12px)] opacity-100" : "w-0 opacity-0 group-hover:w-[calc(100%-12px)] group-hover:opacity-100"}`}></span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
