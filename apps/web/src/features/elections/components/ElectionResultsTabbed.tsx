"use client";

import { useState } from "react";
import Image from "next/image";

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
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* Tabs */}
      <div className="flex overflow-x-auto border-b border-border custom-scrollbar">
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setActiveTab(group.id)}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative ${
              activeTab === group.id
                ? "text-white bg-red-600"
                : "text-foreground hover:bg-muted"
            }`}
          >
            {group.title}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <div className="p-0">
        {activeGroup.candidates.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground italic">
            No candidates available in this group.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-muted/30">
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-4 font-bold">Party</th>
                  <th className="px-6 py-4 font-bold">Candidate</th>
                  <th className="px-6 py-4 font-bold text-right">Votes</th>
                  <th className="px-6 py-4 font-bold text-right">Vote %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeGroup.candidates.map((candidate: Candidate, index: number) => {
                  const totalVotes = activeGroup.candidates.reduce((sum: number, c: Candidate) => sum + (c.votes || 0), 0);
                  const percentage = totalVotes > 0 ? ((candidate.votes || 0) / totalVotes) * 100 : 0;
                  const isLeading = index === 0 && candidate.votes! > 0; // Assuming sorted by votes

                  return (
                    <tr key={candidate.id} className="hover:bg-muted/20 transition-colors">
                      {/* Party */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {candidate.party_symbol_url && (
                            <Image 
                              src={candidate.party_symbol_url} 
                              alt="" 
                              width={24} 
                              height={24} 
                              className="object-contain" 
                              unoptimized 
                            />
                          )}
                          <span className="font-bold text-foreground">
                            {candidate.party_name || "Independent"}
                          </span>
                        </div>
                      </td>
                      
                      {/* Candidate Name */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">
                          {candidate.candidate_name}
                          {candidate.is_winner && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700">WON</span>
                          )}
                        </div>
                      </td>

                      {/* Votes */}
                      <td className="px-6 py-4 text-right">
                        <span className={`font-mono font-bold ${isLeading ? "text-red-600" : "text-foreground"}`}>
                          {(candidate.votes || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Percentage */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <span className="font-mono text-sm text-muted-foreground w-12">{percentage.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
