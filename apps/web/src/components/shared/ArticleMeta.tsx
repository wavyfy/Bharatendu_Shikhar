import { ArticleWithAuthor, getArticleBadges } from "@/utils/mapArticleData";

function calculateReadTime(content: string | undefined | null): string {
  if (!content) return "1 मिनट पढ़ें";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} मिनट पढ़ें`;
}

export function ArticleMeta({ article, isArticlePage, alignRight }: { article: ArticleWithAuthor, isArticlePage?: boolean, alignRight?: boolean }) {
  const badges = getArticleBadges(article, isArticlePage);
  const dateStr = new Date(article.published_at || article.created_at || new Date()).toLocaleDateString("hi-IN", { month: "short", day: "numeric", year: "numeric" });
  const readTime = calculateReadTime(article.content);
  const authorName = article.profiles?.full_name;

  return (
    <div className={`flex flex-wrap items-center gap-2 md:gap-3 w-full text-[11px] text-gray-500 dark:text-news-text-muted font-bold tracking-widest uppercase ${alignRight ? 'justify-end' : 'justify-start'}`}>
      {authorName && (
        <>
          <span className="text-gray-700 dark:text-gray-300 font-semibold">{authorName}</span>
          <span className="text-gray-300 dark:text-news-border">&bull;</span>
        </>
      )}

      {badges.length > 0 && (
        <>
          <div className="flex items-center gap-2">
            {badges.map((b, i) => (
              <span 
                key={i} 
                className="text-white font-black border px-1 rounded shadow-sm"
                style={{ backgroundColor: b.color || '#EF4444', borderColor: b.color || '#EF4444' }}
              >
                {b.name}
              </span>
            ))}
          </div>
          <span className="text-gray-300 dark:text-news-border">&bull;</span>
        </>
      )}
      
      <div className="flex items-center gap-2 shrink-0">
        <span>{dateStr}</span>
        <span className="text-gray-300 dark:text-news-border">&bull;</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
}
