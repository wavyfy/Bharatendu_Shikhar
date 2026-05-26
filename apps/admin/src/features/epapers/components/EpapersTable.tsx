"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteEpaperAction } from "../actions";
import type { EpaperWithRelations } from "../types";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { useConfirm } from "@/components/ui/ConfirmDialog";

interface EpapersTableProps {
  epapers: EpaperWithRelations[];
}

export function EpapersTable({ epapers }: EpapersTableProps) {
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();
  const [isPending, startTransition] = useTransition();

  async function handleDelete(epaper: EpaperWithRelations) {
    const ok = await confirm({
      title: `Delete "${epaper.title}"?`,
      description: "This cannot be undone.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    
    startTransition(async () => {
      const res = await deleteEpaperAction(epaper.id);
      
      if (res.success) {
        toast.success(`"${epaper.title}" deleted.`);
        router.refresh();
      } else {
        toast.error(res.error ?? "Failed to delete E-Paper");
      }
    });
  }

  if (epapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-gray-300 rounded-lg bg-gray-50/50 m-4">
        <p className="text-sm text-gray-500 mb-4">No e-papers found.</p>
        <Link href="/epapers/new">
          <Button>Upload your first e-paper</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border-t border-gray-200">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-medium">Title & Region</th>
            <th className="px-6 py-3 font-medium">Published Date</th>
            <th className="px-6 py-3 font-medium">Expiry Date</th>
            <th className="px-6 py-3 font-medium">Author</th>
            <th className="px-6 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {epapers.map((epaper) => {
            const isExpired = epaper.expiry_date && new Date(epaper.expiry_date) < new Date();
            const isPublished = epaper.published_at && new Date(epaper.published_at) <= new Date();

            return (
              <tr key={epaper.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  <div className="truncate max-w-[250px]">{epaper.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {epaper.region?.name || "No Region"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-start gap-1">
                    {epaper.published_at ? (
                      <span className="text-gray-600">
                        {new Date(epaper.published_at).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className="text-gray-400 italic">Not set</span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                      isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isPublished ? 'Published' : 'Scheduled / Draft'}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {epaper.expiry_date ? (
                    <div className="flex flex-col items-start gap-1">
                      <span className={isExpired ? "text-red-500 line-through" : "text-gray-600"}>
                        {new Date(epaper.expiry_date).toLocaleDateString()}
                      </span>
                      {isExpired && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                          Expired
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Never</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {epaper.author?.full_name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                  <a 
                    href={epaper.pdf_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="sm">
                      View PDF
                    </Button>
                  </a>
                  <Link href={`/epapers/${epaper.id}/edit`}>
                    <Button variant="secondary" size="sm" disabled={isPending}>
                      Edit
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDelete(epaper)}
                    disabled={isPending}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
