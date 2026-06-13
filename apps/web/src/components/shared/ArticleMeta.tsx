import { ArticleWithAuthor, getArticleBadge } from "@/utils/mapArticleData";

function calculateReadTime(content: string | undefined | null): string {
  if (!content) return "1 MIN READ";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} MIN READ`;
}

export function ArticleMeta({ article }: { article: ArticleWithAuthor }) {
  const badge = getArticleBadge(article);
  const dateStr = new Date(article.published_at || article.created_at || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const readTime = calculateReadTime(article.content);

  return (
    <div className="flex items-center justify-start gap-3 w-full text-[11px] text-gray-500 dark:text-news-text-muted font-bold tracking-widest uppercase whitespace-nowrap">
      {badge && <span className="text-white dark:text-news-accent font-black border px-1 rounded bg-red-500">{badge}</span>}
      
      <div className="flex items-center gap-2 shrink-0">
        <span>{dateStr}</span>
        <span className="text-gray-300 dark:text-news-border">&bull;</span>
        <span>{readTime}</span>
      </div>
    </div>
  );
}
