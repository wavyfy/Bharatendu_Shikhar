import type { Database } from "@repo/api";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export type ArticleWithAuthor = ArticleRow & {
  profiles?: { full_name?: string } | null;
};

export type TopicCategoryData = {
  id: string;
  title: string;
  slug: string;
  links: string[];
  articles: ArticleWithAuthor[];
};
export function mapToTopicCategory(
  id: string,
  title: string,
  slug: string,
  links: string[],
  articles: ArticleWithAuthor[]
): TopicCategoryData | null {
  if (!articles || articles.length === 0) return null;

  return {
    id,
    title,
    slug,
    links,
    articles,
  };
}

export function getArticleBadge(article: ArticleWithAuthor): string | null {
  if (article.is_live) return "LIVE";
  if (article.status && !['published', 'draft', 'archived'].includes(article.status.toLowerCase())) {
    return article.status.toUpperCase();
  }
  return null;
}
