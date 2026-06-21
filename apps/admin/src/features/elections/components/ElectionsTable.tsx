"use client";

import Link from "next/link";

interface ElectionsTableProps {
  elections: any[];
}

export function ElectionsTable({ elections }: ElectionsTableProps) {
  if (elections.length === 0) {
    return (
      <div className="p-8 text-center text-on-surface-variant flex flex-col items-center justify-center min-h-[200px]">
        <span className="material-symbols-outlined text-4xl mb-3 opacity-50">how_to_vote</span>
        <p className="text-lg font-medium">No elections found</p>
        <p className="text-sm mt-1 mb-4 opacity-75">Get started by creating a new election.</p>
        <Link href="/elections/new" className="btn-cms-primary">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create Election
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-outline-variant mt-4">
      <table className="w-full text-sm text-left">
        <thead className="bg-surface-container-high border-b border-outline-variant text-on-surface-variant uppercase text-xs font-bold tracking-wider">
          <tr>
            <th className="px-6 py-3 w-16 font-medium text-center">S.No.</th>
            <th className="px-6 py-3 font-medium">Title</th>
            <th className="px-6 py-3 font-medium">Region</th>
            <th className="px-6 py-3 font-medium">Status</th>
            <th className="px-6 py-3 font-medium">Voting Date</th>
            <th className="px-6 py-3 font-medium">Created By</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant bg-surface">
        {elections.map((election, index) => {
          const regionName = election.region?.name || "Global";
          const authorName = election.author?.full_name || "Unknown";

          return (
            <tr key={election.id} className="hover:bg-surface-container-low transition-colors">
              <td className="px-6 py-4 text-center text-gray-500 dark:text-slate-400 font-medium">{index + 1}</td>
              <td className="px-6 py-4 font-medium text-on-surface min-w-[200px]">
                {election.title}
                {election.is_published ? (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-primary/10 text-primary uppercase">Published</span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-sm text-[10px] font-medium bg-surface-variant text-on-surface-variant uppercase">Draft</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">{regionName}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${
                  election.status === "upcoming" ? "bg-primary/10 text-primary" :
                  election.status === "live" ? "bg-red-500/10 text-red-500" :
                  "bg-green-500/10 text-green-600"
                }`}>
                  {election.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
                  {election.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">
                {election.voting_date ? new Date(election.voting_date).toLocaleDateString() : "TBD"}
              </td>
              <td className="px-6 py-4 text-sm text-on-surface-variant whitespace-nowrap">{authorName}</td>
              <td className="px-6 py-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1">
                  <Link
                    href={`/elections/${election.id}`}
                    className="p-1.5 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
                    title="Manage Election"
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </Link>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </div>
  );
}
