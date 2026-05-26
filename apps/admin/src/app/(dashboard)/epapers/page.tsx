import Link from "next/link";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@repo/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { getEpapers } from "@/features/epapers/queries";
import { EpapersTable } from "@/features/epapers/components/EpapersTable";

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

  const buildQuery = (newPage: number) => {
    const q = new URLSearchParams();
    q.set("page", newPage.toString());
    if (search) q.set("search", search);
    return `?${q.toString()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111]">E-Papers</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload and manage digital editions</p>
        </div>
        <Link href="/epapers/new">
          <Button>+ Upload E-Paper</Button>
        </Link>
      </div>
      
      <Card>
        <div className="p-4 bg-white border-b border-gray-200 rounded-t-lg">
          <form method="GET" action="/epapers">
            <input
              type="search"
              name="search"
              placeholder="Search e-papers..."
              defaultValue={search}
              className="w-full sm:max-w-xs px-3 py-2 border border-gray-300 rounded focus:ring-red-500 focus:border-red-500 text-sm"
            />
          </form>
        </div>
        
        <CardHeader>All E-Papers ({count})</CardHeader>
        <div className="p-0">
          <EpapersTable epapers={epapers} />
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <Link href={`/epapers${buildQuery(Math.max(1, page - 1))}`}>
                <Button variant="secondary" size="sm" disabled={page <= 1}>
                  Previous
                </Button>
              </Link>
              <Link href={`/epapers${buildQuery(Math.min(totalPages, page + 1))}`}>
                <Button variant="secondary" size="sm" disabled={page >= totalPages}>
                  Next
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
