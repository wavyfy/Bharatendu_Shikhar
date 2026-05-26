import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { getCategories } from "@/features/categories/queries";
import { CategoriesTable } from "@/features/categories/components/CategoriesTable";

export const metadata = { title: "Categories | Bharatendu Shikhar Admin" };

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;

  const { categories, count, totalPages } = await getCategories({
    page,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#111]">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage article categories</p>
        </div>
        <Link href="/categories/new">
          <Button>+ New Category</Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader>All Categories ({count})</CardHeader>
        <div className="p-0">
          <CategoriesTable categories={categories} />
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <div className="space-x-2">
              <Link href={`/categories?page=${Math.max(1, page - 1)}`}>
                <Button variant="secondary" size="sm" disabled={page <= 1}>
                  Previous
                </Button>
              </Link>
              <Link href={`/categories?page=${Math.min(totalPages, page + 1)}`}>
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
