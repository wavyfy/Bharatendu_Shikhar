import { Suspense } from "react";
import { supabase } from "@repo/api";
import { SafeImage } from "@/components/shared/SafeImage";
import { FileText } from "lucide-react";
import Link from "next/link";
import { EpaperSkeleton } from "@/components/skeletons/EpaperSkeletons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Papers",
  description: "Browse and read our latest digital e-papers online.",
};

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

async function EpaperContent({ page }: { page: number }) {
  const limit = 20;
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
    <div className="animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {epapers && epapers.length > 0 ? (
          epapers.map((paper) => (
            <a 
              key={paper.id} 
              href={getImageUrl(paper.pdf_url) || "#"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:shadow-lg hover:translate-y-0.5 transition-all duration-300 rounded-xl overflow-hidden flex flex-col"
            >
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-news-card overflow-hidden border-b border-gray-200 dark:border-news-border">
                {paper.thumbnail_url ? (
                  <div className="relative w-full h-full">
                    <SafeImage
                      src={getImageUrl(paper.thumbnail_url)!}
                      alt={paper.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 z-10 border border-gray-200 dark:border-news-border rounded-t-xl pointer-events-none" />
                  </div>
                ) : paper.pdf_url ? (
                  <div className="relative w-full h-full overflow-hidden bg-white dark:bg-gray-100 rounded-t-xl">
                    <iframe
                      src={`${getImageUrl(paper.pdf_url)}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="absolute top-0 h-[150%] pointer-events-none"
                      style={{ width: 'calc(100% + 20px)', left: '-2px' }}
                      title={paper.title}
                      scrolling="no"
                      tabIndex={-1}
                    />
                    <div className="absolute inset-0 z-10 bg-transparent border border-gray-200 dark:border-news-border rounded-t-xl pointer-events-none" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-news-card p-8">
                    {settings?.site_logo_url || settings?.site_logo_dark_url ? (
                      <>
                        {settings?.site_logo_url && (
                          <div className={`relative w-full h-1/2 ${settings.site_logo_dark_url ? 'dark:hidden' : ''}`}>
                            <SafeImage
                              src={getImageUrl(settings.site_logo_url)!}
                              alt="Default Cover"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                        {settings?.site_logo_dark_url && (
                          <div className={`relative w-full h-1/2 ${settings.site_logo_url ? 'hidden dark:block' : ''}`}>
                            <SafeImage
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
                        <FileText className="w-10 h-10 mb-2 opacity-80" />
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
                <h3 className="font-medium text-lg leading-relaxed mb-2 group-hover:text-red-600 dark:group-hover:text-news-accent transition-colors dark:text-news-text">
                  {paper.title}
                </h3>
                <div className="text-xs font-semibold text-gray-500 dark:text-news-text-muted mt-auto uppercase tracking-wide">
                  {paper.regions ? `Bhartendu ${(paper.regions as { name: string }).name} Edition` : 'Bhartendu Edition'}
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-500 dark:text-news-text-muted font-medium">
            इस समय कोई ई-पेपर उपलब्ध नहीं है।
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
              पिछला
            </Link>
          ) : (
            <button disabled className="px-4 py-2 border border-gray-200 dark:border-news-border rounded text-gray-400 dark:text-gray-600 cursor-not-allowed">
              पिछला
            </button>
          )}
          
          <span className="text-sm text-gray-600 dark:text-news-text-muted font-medium">
            पेज {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <Link 
              href={`/epaper?page=${page + 1}`}
              className="px-4 py-2 border border-gray-300 dark:border-news-border rounded hover:bg-gray-100 dark:hover:bg-news-card transition-colors dark:text-news-text"
            >
              अगला
            </Link>
          ) : (
            <button disabled className="px-4 py-2 border border-gray-200 dark:border-news-border rounded text-gray-400 dark:text-gray-600 cursor-not-allowed">
              अगला
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default async function EPaperPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page, 10) : 1;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-news-bg py-10">
      <div className="max-w-350 mx-auto px-4">
        <h1 className="text-3xl font-medium mb-8 text-black dark:text-news-text border-b-2 border-red-600 pb-4 inline-block">
          ई-पेपर
        </h1>

        <Suspense fallback={<EpaperSkeleton />} key={page}>
          <EpaperContent page={page} />
        </Suspense>
      </div>
    </main>
  );
}
