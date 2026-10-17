import type { Database } from "@repo/api";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

export type ArticleWithAuthor = ArticleRow & {
  profiles?: { full_name?: string } | null;
  article_live_updates?: Database["public"]["Tables"]["article_live_updates"]["Row"][];
  article_badges?: { badge?: { name: string; color: string | null } | null }[] | null;
  /** Set by toCardArticle, where `content` is only a short preview. */
  read_time_minutes?: number;
};

export function getReadTimeMinutes(content: string | undefined | null): number {
  if (!content) return 1;
  return Math.ceil(content.trim().split(/\s+/).length / 200);
}

// Card components read `content` only for the excerpt fallback (first <=200 chars of
// tag-stripped text) and the read time, so cards rendered by client components get a
// preview instead of the full HTML body to keep it out of the RSC payload.
const CARD_CONTENT_PREVIEW_LENGTH = 200;

export function toCardArticle(article: ArticleWithAuthor): ArticleWithAuthor {
  if (!article.content) return article;
  return {
    ...article,
    content: article.content.replace(/<[^>]+>/g, "").substring(0, CARD_CONTENT_PREVIEW_LENGTH),
    read_time_minutes: getReadTimeMinutes(article.content),
  };
}

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
