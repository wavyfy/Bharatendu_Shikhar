import Link from "next/link";
import { getPublishers } from "@/features/publishers/queries";
import { PublishersTable } from "@/features/publishers/components/PublishersTable";

export const metadata = {
  title: "Publishers | Admin",
};

export default async function PublishersPage() {
  const publishers = await getPublishers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-playfair tracking-tight">Publishers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage publisher accounts and permissions</p>
        </div>
        <Link 
          href="/publishers/new"
          className="inline-flex items-center gap-2 bg-[#111] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Publisher
        </Link>
      </div>

      <PublishersTable publishers={publishers} />
    </div>
  );
}
