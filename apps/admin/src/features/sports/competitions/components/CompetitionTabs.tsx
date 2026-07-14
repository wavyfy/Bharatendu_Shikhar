"use client";

import { useState } from "react";
import { Settings, ListOrdered, Trophy } from "lucide-react";

interface CompetitionTabsProps {
  detailsForm: React.ReactNode;
  pointsTable: React.ReactNode;
  matchesList: React.ReactNode;
}

type Tab = "details" | "points" | "matches";

export function CompetitionTabs({
  detailsForm,
  pointsTable,
  matchesList,
}: CompetitionTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "details", label: "General Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "points", label: "Points Table", icon: <Trophy className="w-4 h-4" /> },
    { id: "matches", label: "Matches", icon: <ListOrdered className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex border-b border-outline-variant overflow-x-auto custom-scrollbar">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
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
              <h2 className="text-lg font-bold text-on-surface">Competition Details</h2>
              <p className="text-sm text-on-surface-variant">
                Configure basic information, sport, dates, and publish status.
              </p>
            </div>
            <div className="p-6">{detailsForm}</div>
          </section>
        )}

        {activeTab === "points" && (
          <section className="cms-card flex flex-col">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Points Table</h2>
              <p className="text-sm text-on-surface-variant">
                Manage team standings. Use group names (e.g. Group A / Group B) for multi-group competitions.
              </p>
            </div>
            <div className="p-0">{pointsTable}</div>
          </section>
        )}

        {activeTab === "matches" && (
          <section className="cms-card flex flex-col">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Matches</h2>
              <p className="text-sm text-on-surface-variant">
                Matches linked to this competition. Manage individual matches from the Matches section.
              </p>
            </div>
            <div className="p-0">{matchesList}</div>
          </section>
        )}
      </div>
    </div>
  );
}
