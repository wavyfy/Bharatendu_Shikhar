"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Settings, BarChart2, Radio } from "lucide-react";

interface MatchTabsProps {
  detailsForm: React.ReactNode;
  scorePanel: React.ReactNode;
  updatesList: React.ReactNode;
}

type Tab = "details" | "score" | "updates";

export function MatchTabs({ detailsForm, scorePanel, updatesList }: MatchTabsProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const initialTab = (searchParams.get("tab") as Tab) || "details";
  const [activeTab, setActiveTab] = useState<Tab>(["details", "score", "updates"].includes(initialTab) ? initialTab : "details");

  useEffect(() => {
    const currentTab = searchParams.get("tab") as Tab;
    if (currentTab && ["details", "score", "updates"].includes(currentTab) && currentTab !== activeTab) {
      setActiveTab(currentTab);
    }
  }, [searchParams]);

  const handleTabChange = (id: Tab) => {
    setActiveTab(id);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", id);
    router.replace(`${pathname}?${params.toString()}`);
  };


  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "details", label: "General Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "score", label: "Score & Result", icon: <BarChart2 className="w-4 h-4" /> },
    { id: "updates", label: "Live Updates", icon: <Radio className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-outline-variant overflow-x-auto custom-scrollbar">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? "border-primary text-primary"
                : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "details" && (
          <section className="cms-card">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Match Details</h2>
              <p className="text-sm text-on-surface-variant">
                Configure teams, venue, sport, type, and publish settings.
              </p>
            </div>
            <div className="p-6">{detailsForm}</div>
          </section>
        )}

        {activeTab === "score" && (
          <section className="cms-card">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Score & Result</h2>
              <p className="text-sm text-on-surface-variant">
                Update the live score, result text, toss info, and match notes.
              </p>
            </div>
            <div className="p-6">{scorePanel}</div>
          </section>
        )}

        {activeTab === "updates" && (
          <section className="cms-card flex flex-col">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Live Updates</h2>
              <p className="text-sm text-on-surface-variant">
                Post commentary, wickets, goals, milestones, and status updates.
              </p>
            </div>
            <div className="p-0">{updatesList}</div>
          </section>
        )}
      </div>
    </div>
  );
}
