import { supabase } from "@repo/api";
import Image from "next/image";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

import Link from "next/link";

export default async function EPaperPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;
  const limit = 12;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: settings } = await supabase.from("settings").select("site_logo_url, site_logo_dark_url").eq("id", 1).single();
  const { data: epapers, count } = await supabase
    .from("epapers")
    .select("*, regions(name)", { count: 'exact' })
    .order("published_at", { ascending: false })
    .range(from, to);

  const totalPages = count ? Math.ceil(count / limit) : 0;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg py-10">
      <div className="max-w-[1400px] mx-auto px-4">
        <h1 className="text-3xl font-playfair font-bold mb-8 text-black dark:text-news-text border-b-2 border-red-600 pb-4 inline-block">
          E-Papers
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {epapers && epapers.length > 0 ? (
            epapers.map((paper) => (
              <a 
                key={paper.id} 
                href={getImageUrl(paper.pdf_url) || "#"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 rounded overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card overflow-hidden border-b border-gray-200 dark:border-news-border">
                  {paper.thumbnail_url ? (
                    <Image
                      src={getImageUrl(paper.thumbnail_url)!}
                      alt={paper.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-news-card p-8">
                      {settings?.site_logo_url || settings?.site_logo_dark_url ? (
                        <>
                          {settings?.site_logo_url && (
                            <div className={`relative w-full h-1/2 ${settings.site_logo_dark_url ? 'dark:hidden' : ''}`}>
                              <Image
                                src={getImageUrl(settings.site_logo_url)!}
                                alt="Default Cover"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          {settings?.site_logo_dark_url && (
                            <div className={`relative w-full h-1/2 ${settings.site_logo_url ? 'hidden dark:block' : ''}`}>
                              <Image
                                src={getImageUrl(settings.site_logo_dark_url)!}
                                alt="Default Cover (Dark)"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex flex-col items-center text-gray-400">
                          <span className="material-symbols-outlined text-4xl mb-2">picture_as_pdf</span>
                          <span className="text-sm font-medium">No Preview</span>
                        </div>
                      )}
                    </div>
                  )}
                  {paper.regions && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded">
                      {(paper.regions as { name: string }).name}
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-playfair font-bold text-lg leading-tight mb-2 group-hover:text-red-600 dark:group-hover:text-news-accent transition-colors dark:text-news-text">
                    {paper.title}
                  </h3>
                  <div className="text-xs text-gray-500 dark:text-news-text-muted mt-auto">
                    {paper.published_at ? new Date(paper.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : ''}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500 dark:text-news-text-muted font-medium">
              No E-Papers available at the moment.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            {page > 1 ? (
              <Link 
                href={`/epaper?page=${page - 1}`}
                className="px-4 py-2 border border-gray-300 dark:border-news-border rounded hover:bg-gray-100 dark:hover:bg-news-card transition-colors dark:text-news-text"
              >
                Previous
              </Link>
            ) : (
              <button disabled className="px-4 py-2 border border-gray-200 dark:border-news-border rounded text-gray-400 dark:text-gray-600 cursor-not-allowed">
                Previous
              </button>
            )}
            
            <span className="text-sm text-gray-600 dark:text-news-text-muted font-medium">
              Page {page} of {totalPages}
            </span>

            {page < totalPages ? (
              <Link 
                href={`/epaper?page=${page + 1}`}
                className="px-4 py-2 border border-gray-300 dark:border-news-border rounded hover:bg-gray-100 dark:hover:bg-news-card transition-colors dark:text-news-text"
              >
                Next
              </Link>
            ) : (
              <button disabled className="px-4 py-2 border border-gray-200 dark:border-news-border rounded text-gray-400 dark:text-gray-600 cursor-not-allowed">
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
