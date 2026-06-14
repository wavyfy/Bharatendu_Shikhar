import type { Database } from "@repo/api";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export type ArticleWithAuthor = ArticleRow & {
  profiles?: { full_name?: string } | null;
  article_live_updates?: Database["public"]["Tables"]["article_live_updates"]["Row"][];
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

export function getArticleBadges(article: ArticleWithAuthor, isArticlePage: boolean = false): { name: string, color?: string }[] {
  const badges: { name: string, color?: string }[] = [];

  if (article.is_live) {
    badges.push({ name: "LIVE", color: "#EF4444" });
  }

  if (article.article_badges && Array.isArray(article.article_badges)) {
    for (const ab of article.article_badges) {
      if (ab.badge && ab.badge.name) {
        if (!isArticlePage && ab.badge.name.toLowerCase() !== "breaking" && ab.badge.name.toLowerCase() !== "breaking news") {
          continue;
        }
        badges.push({ name: ab.badge.name.toUpperCase(), color: ab.badge.color || undefined });
      }
    }
  }

  if (badges.length === 0 && article.status && !['published', 'draft', 'archived'].includes(article.status.toLowerCase())) {
    badges.push({ name: article.status.toUpperCase(), color: "#6B7280" });
  }

  return badges;
}
