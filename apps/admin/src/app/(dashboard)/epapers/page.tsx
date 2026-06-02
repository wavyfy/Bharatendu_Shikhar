import Link from "next/link";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { getEpapers } from "@/features/epapers/queries";
import { EpapersTable } from "@/features/epapers/components/EpapersTable";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import { AnimatedPage } from "@/components/ui/AnimatedPage";

export const metadata = { title: "E-Papers | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function EPapersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const search = params?.search || "";

  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();

  let role = "publisher";
  if (user) {
    const { supabaseAdmin } = await import("@repo/api");
    const { data } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if ((data as unknown as { role?: string })?.role === "admin") {
      role = "admin";
    }
  }

  const userId = role === "admin" ? undefined : user?.id;

  const { epapers, count, totalPages } = await getEpapers({ page, limit: 10, role, userId, search });

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="page-title">E-Papers</h1>
          <p className="page-subtitle">Upload and manage digital editions for your publication.</p>
        </div>
        <Link href="/epapers/new" className="btn-cms-primary self-start md:self-auto">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Upload E-Paper
        </Link>
      </div>

      {/* Search */}
      <div className="cms-search-wrap">
        <SearchInput placeholder="Search e-papers..." className="cms-search-input" />
      </div>

      {/* Table card */}
      <div className="cms-card">
        <div className="cms-card-header">
          <span className="cms-card-label">All E-Papers ({count})</span>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <EpapersTable epapers={epapers} />
        </div>

        <div className="px-5 py-3 border-t border-surface-variant bg-surface">
          <Pagination currentPage={page} totalPages={totalPages} />
        </div>
      </div>
    </AnimatedPage>
  );
}
