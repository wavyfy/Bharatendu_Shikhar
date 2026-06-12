import Link from "next/link";
import type { ArticleWithAuthor } from "@/utils/mapArticleData";

export function Ticker({ articles = [] }: { articles?: ArticleWithAuthor[] }) {
  return (
    <div className="sticky top-0 z-50 w-full bg-news-bg dark:bg-news-bg py-2 mb-8 shadow-sm">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex items-stretch text-xs">
        <div className="bg-red-600 text-white font-bold px-4 py-2 uppercase tracking-wide z-10 shadow-[2px_0_5px_rgba(0,0,0,0.2)]">
          BREAKING NEWS
        </div>
        <div className="bg-red-600 text-white flex-1 overflow-hidden flex items-center relative">
          <div className="animate-marquee-ltr flex w-max hover:[animation-play-state:paused]">
            <div className="flex shrink-0 gap-10 pr-10 items-center">
              {articles.length > 0 ? (
                articles.map((art, idx) => (
                  <Link href={`/article/${art.slug}`} key={idx} className="flex items-center gap-3 hover:text-gray-200 transition-colors">
                    <span className="flex items-center justify-center bg-white text-red-600 rounded-full w-[18px] h-[18px] text-[10px] font-bold shrink-0">{idx + 1}</span>
                    <span className="font-medium text-[13px] whitespace-nowrap">{art.title}</span>
                  </Link>
                ))
              ) : (
                <span className="font-medium text-[13px] whitespace-nowrap">Stay tuned for the latest news and updates.</span>
              )}
            </div>
            <div className="flex shrink-0 gap-10 pr-10 items-center" aria-hidden="true">
              {articles.length > 0 ? (
                articles.map((art, idx) => (
                  <Link href={`/article/${art.slug}`} key={idx} className="flex items-center gap-3 hover:text-gray-200 transition-colors">
                    <span className="flex items-center justify-center bg-white text-red-600 rounded-full w-[18px] h-[18px] text-[10px] font-bold shrink-0">{idx + 1}</span>
                    <span className="font-medium text-[13px] whitespace-nowrap">{art.title}</span>
                  </Link>
                ))
              ) : (
                <span className="font-medium text-[13px] whitespace-nowrap">Stay tuned for the latest news and updates.</span>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
