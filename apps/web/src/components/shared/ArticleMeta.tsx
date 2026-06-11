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
  const source = article.profiles?.full_name;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 text-[9px] text-gray-500 dark:text-news-text-muted font-bold tracking-widest uppercase">
      {badge && <span className="text-red-600 dark:text-news-accent font-black">{badge}</span>}
      {badge && <span className="text-gray-300 dark:text-news-border">&bull;</span>}
      
      <span>{dateStr}</span>
      <span className="text-gray-300 dark:text-news-border">&bull;</span>
      
      <span>{readTime}</span>
      
      {source && (
        <>
          <span className="text-gray-300 dark:text-news-border">&bull;</span>
          <span>{source}</span>
        </>
      )}
    </div>
  );
}
