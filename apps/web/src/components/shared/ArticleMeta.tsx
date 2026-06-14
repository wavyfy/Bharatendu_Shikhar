import { ArticleWithAuthor, getArticleBadges } from "@/utils/mapArticleData";

function calculateReadTime(content: string | undefined | null): string {
  if (!content) return "1 MIN READ";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} MIN READ`;
}

export function ArticleMeta({ article, isArticlePage, alignRight }: { article: ArticleWithAuthor, isArticlePage?: boolean, alignRight?: boolean }) {
  const badges = getArticleBadges(article, isArticlePage);
  const dateStr = new Date(article.published_at || article.created_at || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const readTime = calculateReadTime(article.content);

  return (
    <div className={`flex items-center gap-3 w-full text-[11px] text-gray-500 dark:text-news-text-muted font-bold tracking-widest uppercase whitespace-nowrap overflow-hidden text-ellipsis ${alignRight ? 'justify-end' : 'justify-start'}`}>
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
      
      <div className="flex items-center gap-2 shrink-0">
        <span>{dateStr}</span>
        <span className="text-gray-300 dark:text-news-border">&bull;</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
}
