import { createSupabaseServerClient } from "@repo/api";
import { cookies } from "next/headers";
import Image from "next/image";

function getImageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

export default async function EPaperPage() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    get(name) {
      return cookieStore.get(name)?.value;
    },
    set() {},
    remove() {},
  });

  const { data: epapers } = await supabase
    .from("epapers")
    .select("*, regions(name)")
    .order("published_at", { ascending: false });

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
                className="group bg-white dark:bg-news-card border border-gray-200 dark:border-news-border shadow-sm hover:shadow-xl transition-shadow duration-300 rounded overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-3/4 bg-gray-100 dark:bg-news-bg overflow-hidden border-b border-gray-200 dark:border-news-border">
                  {paper.thumbnail_url ? (
                    <Image
                      src={getImageUrl(paper.thumbnail_url)!}
                      alt={paper.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Preview
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
      </div>
    </main>
  );
}
