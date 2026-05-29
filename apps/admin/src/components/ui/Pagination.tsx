"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildQuery = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
      <span className="text-sm text-gray-700">
        Page {currentPage} of {totalPages}
      </span>
      <div className="space-x-2 flex">
        <Link 
          href={buildQuery(Math.max(1, currentPage - 1))}
          className={currentPage <= 1 ? "pointer-events-none" : ""}
        >
          <Button variant="secondary" size="sm" disabled={currentPage <= 1}>
            Previous
          </Button>
        </Link>
        <Link 
          href={buildQuery(Math.min(totalPages, currentPage + 1))}
          className={currentPage >= totalPages ? "pointer-events-none" : ""}
        >
          <Button variant="secondary" size="sm" disabled={currentPage >= totalPages}>
            Next
          </Button>
        </Link>
      </div>
    </div>
  );
}
