import Link from "next/link";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
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

  // Get user and role to determine authorId for fetching
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get: (name) => cookieStore.get(name)?.value,
    set: () => {},
    remove: () => {},
  });

  const { data: { user } } = await supabase.auth.getUser();
  
  let role = "publisher"; // default
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

  const { epapers, count, totalPages } = await getEpapers({
    page,
    limit: 10,
    role,
    userId,
    search,
  });

  return (
    <AnimatedPage className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111] dark:text-slate-100">E-Papers</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">Upload and manage digital editions</p>
        </div>
        <Link href="/epapers/new">
          <Button>+ Upload E-Paper</Button>
        </Link>
      </div>
      
      <Card>
        <div className="p-4 bg-gray-50/50 dark:bg-slate-700/30 border-b border-gray-200 dark:border-slate-700 rounded-t-lg">
          <div className="w-full sm:max-w-md">
            <SearchInput placeholder="Search e-papers..." />
          </div>
        </div>
        
        <CardHeader>All E-Papers ({count})</CardHeader>
        <div className="p-0">
          <EpapersTable epapers={epapers} />
        </div>
        
        <Pagination currentPage={page} totalPages={totalPages} />
      </Card>
    </AnimatedPage>
  );
}
