"use client";

import { useState } from "react";
import { Settings, Users, Radio } from "lucide-react";

interface ElectionTabsProps {
  electionForm: React.ReactNode;
  groupsList: React.ReactNode;
  liveUpdatesList: React.ReactNode;
}

export function ElectionTabs({ electionForm, groupsList, liveUpdatesList }: ElectionTabsProps) {
  const [activeTab, setActiveTab] = useState<"details" | "groups" | "updates">("details");

  return (
    <div className="space-y-6">
      <div className="flex border-b border-outline-variant overflow-x-auto custom-scrollbar">
        <button 
          onClick={() => setActiveTab("details")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "details" 
              ? "border-primary text-primary" 
              : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <Settings className="w-4 h-4" />
          General Settings
        </button>
        <button 
          onClick={() => setActiveTab("groups")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "groups" 
              ? "border-primary text-primary" 
              : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <Users className="w-4 h-4" />
          Groups & Candidates
        </button>
        <button 
          onClick={() => setActiveTab("updates")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "updates" 
              ? "border-primary text-primary" 
              : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
          }`}
        >
          <Radio className="w-4 h-4" />
          Live Updates
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "details" && (
          <section className="cms-card">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Election Details</h2>
              <p className="text-sm text-on-surface-variant">Configure the basic information and region for this election.</p>
            </div>
            <div className="p-6">
              {electionForm}
            </div>
          </section>
        )}

        {activeTab === "groups" && (
          <section className="cms-card flex flex-col min-h-[400px]">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Groups Management</h2>
              <p className="text-sm text-on-surface-variant">Create constituency groups and assign candidates to them.</p>
            </div>
            <div className="p-0 flex-1">
              {groupsList}
            </div>
          </section>
        )}

        {activeTab === "updates" && (
          <section className="cms-card flex flex-col min-h-[400px]">
            <div className="cms-card-header border-b border-outline-variant">
              <h2 className="text-lg font-bold text-on-surface">Live Updates</h2>
              <p className="text-sm text-on-surface-variant">Post real-time news and progress updates for this election.</p>
            </div>
            <div className="p-0 flex-1">
              {liveUpdatesList}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
