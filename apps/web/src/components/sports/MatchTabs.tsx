"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface MatchData {
  id: string;
  slug: string;
  status: string;
  home_team?: { name: string; logo_url?: string };
  home_team_name?: string;
  away_team?: { name: string; logo_url?: string };
  away_team_name?: string;
  match_number?: string | number;
  match_date?: string;
  venue?: string;
  home_score?: string | number;
  away_score?: string | number;
  stage?: string;
}

export function MatchTabs({ matches }: { matches: MatchData[] }) {
  const [activeTab, setActiveTab] = useState("Latest");

  const tabs = [
    { id: "Latest", label: "नवीनतम" },
    { id: "Upcoming", label: "आगामी" },
    { id: "Past", label: "पिछले" },
    { id: "Live", label: "लाइव" },
  ];

  const getFilteredMatches = () => {
    switch (activeTab) {
      case "Live":
        return matches.filter((m) => m.status === "live" || m.status === "in_progress");
      case "Upcoming":
        return matches.filter((m) => m.status === "upcoming" || m.status === "scheduled");
      case "Past":
        return matches.filter((m) => m.status === "completed" || m.status === "finished");
      case "Latest":
      default:
        return matches.slice(0, 5);
    }
  };

  const displayMatches = getFilteredMatches();

  return (
    <div className="w-full bg-news-card mt-2 rounded-3xl p-6 shadow-sm border border-news-border">
      <div className="flex items-center gap-6 border-b-2 border-news-border overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap py-3 text-[15px] font-medium transition-colors border-b-[3px] ${
              activeTab === tab.id
                ? "border-indigo-600 text-news-text font-semibold mb-[-2px]"
                : "border-transparent text-news-text-secondary hover:text-news-text mb-[-2px]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-6 max-h-[500px] overflow-y-auto pr-2">
        {displayMatches.map((match) => {
          const homeName = match.home_team?.name || "घरेलू टीम";
          const awayName = match.away_team?.name || "विपक्षी टीम";
          const homeLogo = match.home_team?.logo_url;
          const awayLogo = match.away_team?.logo_url;
          
          return (
            <Link href={`/sports/match/${match.slug}`} key={match.id} className="flex flex-col md:flex-row items-center md:justify-between px-4 md:px-6 py-4 bg-news-card rounded-xl hover:shadow-sm transition-all group border border-news-border gap-4 md:gap-0 cursor-pointer">
              <div className="flex items-center justify-between md:gap-12 w-full">
                {/* Home Team */}
                <div className="flex flex-col md:flex-row items-center md:justify-start gap-1 md:gap-3 w-[35%] md:w-1/3 text-center md:text-left">
                  {homeLogo ? (
                    <Image src={homeLogo} alt={homeName} width={28} height={28} className="rounded-full shrink-0" unoptimized />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-news-card shrink-0" />
                  )}
                  <span className="text-[13px] md:text-[15px] font-semibold line-clamp-2 md:line-clamp-1 leading-tight">{homeName}</span>
                </div>
                
                {/* Score / Time */}
                <div className="flex flex-col items-center justify-center w-[30%] md:w-1/3 px-1">
                  {match.status === "scheduled" ? (
                    <span className="text-sm font-medium text-news-text-secondary bg-news-card px-4 py-1.5 rounded-full shadow-sm">
                      {match.match_date ? new Date(match.match_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "टीबीए"}
                    </span>
                  ) : (
                    <div className="text-[11px] md:text-sm font-bold text-indigo-900 dark:text-indigo-200 bg-[#F0EEFA] dark:bg-indigo-900/30 px-3 md:px-5 py-1.5 rounded-xl md:rounded-full whitespace-nowrap flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5">
                      <span>{match.home_score ?? "-"}</span>
                      <span className="hidden md:inline">-</span>
                      <span className="md:hidden text-[9px] opacity-60 font-semibold tracking-widest leading-none">VS</span>
                      <span>{match.away_score ?? "-"}</span>
                    </div>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col-reverse md:flex-row items-center justify-center md:justify-end gap-1 md:gap-3 w-[35%] md:w-1/3 text-center md:text-right">
                  <span className="text-[13px] md:text-[15px] font-semibold line-clamp-2 md:line-clamp-1 leading-tight">{awayName}</span>
                  {awayLogo ? (
                    <Image src={awayLogo} alt={awayName} width={28} height={28} className="rounded-full shrink-0" unoptimized />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-news-card shrink-0" />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto ml-0 md:ml-6 mt-3 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-news-border pl-0 md:pl-6 justify-center md:justify-start">
                {match.status === "finished" && (
                  <span className="text-[13px] font-medium text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full whitespace-nowrap">
                    पूर्ण समय
                  </span>
                )}
                {match.status === "in_progress" && (
                  <span className="text-[13px] font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full whitespace-nowrap">
                    लाइव
                  </span>
                )}
                <span className="text-[12px] md:text-[14px] text-news-text-secondary whitespace-nowrap">
                  {match.match_date ? new Date(match.match_date).toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : "टीबीए"}
                </span>
              </div>
            </Link>
          );
        })}
        {displayMatches.length === 0 && (
          <div className="py-12 text-center text-news-text-secondary">
            इस श्रेणी के लिए कोई मैच नहीं मिला।
          </div>
        )}
      </div>
    </div>
  );
}
