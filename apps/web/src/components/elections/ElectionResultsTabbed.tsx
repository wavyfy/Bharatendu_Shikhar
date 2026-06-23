"use client";

import { useState } from "react";
import { Info } from "lucide-react";

interface Candidate {
  id: string;
  candidate_name: string;
  party_name?: string | null;
  party_symbol_url?: string | null;
  photo_url?: string | null;
  votes?: number;
  is_winner?: boolean;
}

interface Group {
  id: string;
  title: string;
  candidates: Candidate[];
}

interface ElectionResultsTabbedProps {
  groups: Group[];
}

export function ElectionResultsTabbed({ groups }: ElectionResultsTabbedProps) {
  const [activeTab, setActiveTab] = useState(groups.length > 0 ? groups[0].id : null);

  if (groups.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
        No groups or candidates have been added yet.
      </div>
    );
  }

  const activeGroup = groups.find(g => g.id === activeTab) || groups[0];

  return (
    <div className="bg-card border-2 border-gray-200 dark:border-news-border rounded-sm h-full flex flex-col">
      {/* Tabs */}
      <div className="flex overflow-x-auto custom-scrollbar px-2 pt-2 pb-1 items-center gap-2 border-b border-gray-200 dark:border-news-border">
        {groups.map((group) => {
          const isActive = activeTab === group.id;
          return (
            <button
              key={group.id}
              onClick={() => setActiveTab(group.id)}
              className={`text-[11px] whitespace-nowrap transition-colors px-3 py-1.5 rounded-full ${
                isActive
                  ? "bg-red-600 text-white font-bold"
                  : "text-foreground font-medium hover:bg-muted"
              }`}
            >
              {group.title}
            </button>
          );
        })}
      </div>

      {/* Table Content */}
      <div className="p-0 flex-1 flex flex-col mt-2">
        {activeGroup.candidates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic">
            No candidates available in this group.
          </div>
        ) : (
          <div className="overflow-x-auto h-full">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-gray-200 dark:border-news-border">
                <tr className="text-xs font-bold uppercase tracking-wider text-foreground bg-muted/20">
                  <th className="px-6 py-3">Party</th>
                  <th className="px-6 py-3">Candidate</th>
                  <th className="px-6 py-3 text-center">Votes</th>
                  <th className="px-6 py-3 text-center">Vote %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeGroup.candidates.map((candidate: Candidate, index: number) => {
                  const totalVotes = activeGroup.candidates.reduce((sum: number, c: Candidate) => sum + (c.votes || 0), 0);
                  const percentage = totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0;
                  const isLeading = index === 0 && candidate.votes! > 0; // Assuming sorted by votes

                  return (
                    <tr key={candidate.id} className="hover:bg-muted/10 transition-colors">
                      {/* Party */}
                      <td className="px-6 py-3">
                        <span className="font-medium text-xs text-foreground">
                          {candidate.party_name || "Independent"}
                        </span>
                      </td>
                      
                      {/* Candidate Name */}
                      <td className="px-6 py-3">
                        <div className="font-medium text-xs text-foreground">
                          {candidate.candidate_name}
                        </div>
                      </td>

                      {/* Votes */}
                      <td className="px-6 py-3 text-center">
                        <span className={`font-mono text-xs ${isLeading ? "text-red-600 font-bold" : "text-foreground font-medium"}`}>
                          {(candidate.votes || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-6 py-3 text-center">
                        <span className="font-mono text-xs text-foreground font-medium">{percentage.toFixed(1)}%</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="mt-auto border-t border-gray-200 dark:border-news-border p-3 bg-muted/10">
        <p className="text-xs text-muted-foreground flex items-center gap-2 px-2">
          <Info className="w-4 h-4" />
          Figures indicate vote counts in the election results based on current counting
        </p>
      </div>
    </div>
  );
}
