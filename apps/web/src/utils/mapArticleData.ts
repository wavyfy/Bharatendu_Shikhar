import type { TopicCategoryData } from "@/components/home/TopicSection";
import type { Database } from "@repo/api";

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"];

// We expect the article to have joined profiles if available
export type ArticleWithAuthor = ArticleRow & {
  profiles?: { full_name?: string } | null;
};

function calculateReadTime(content: string): string {
  if (!content) return "1 MIN READ";
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} MIN READ`;
}

function getImageUrl(path: string | null, fallbackId: number): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
}

/**
 * Maps an array of articles into the TopicCategoryData structure for UI layout.
 * The layout expects at least 1 feature, 2 split, 1 live update (or standard article),
 * and the rest into related articles. If not enough articles, we pad with empty/fallback data.
 */
export function mapToTopicCategory(
  id: string,
  title: string,
  links: string[],
  articles: ArticleWithAuthor[],
  fallbackStartId: number = 1000
): TopicCategoryData | null {
  if (!articles || articles.length === 0) return null;

  const feature = articles[0];
  const split1 = articles[1];
  const split2 = articles[2];
  const live = articles[3];
  const related = articles.slice(4);

  return {
    id,
    title,
    links,
    featureArticle: {
      title: feature.title,
      description: feature.excerpt || feature.content.substring(0, 150) + "...",
      readTime: calculateReadTime(feature.content),
      imageSrc: getImageUrl(feature.featured_image, fallbackStartId),
      source: feature.profiles?.full_name || "Editorial Team",
    },
    splitArticles: [
      {
        title: split1 ? split1.title : "More Updates Coming Soon",
        readTime: split1 ? calculateReadTime(split1.content) : "1 MIN READ",
      },
      {
        title: split2 ? split2.title : "Stay Tuned",
        readTime: split2 ? calculateReadTime(split2.content) : "1 MIN READ",
      },
    ],
    liveUpdate: {
      date: live
        ? new Date(live.published_at || live.created_at || new Date()).toLocaleDateString("en-US", { month: "short", day: "numeric" })
        : "Latest",
      title: live ? live.title : "Breaking News Updates",
      imageSrc: live ? getImageUrl(live.featured_image, fallbackStartId + 1) : `https://picsum.photos/id/${fallbackStartId + 1}/600/350`,
    },
    relatedArticles: related.map((art, idx) => ({
      id: art.id.toString(),
      source: art.profiles?.full_name || "Editorial Team",
      title: art.title,
      readTime: calculateReadTime(art.content),
      imageSrc: getImageUrl(art.featured_image, fallbackStartId + 2 + idx),
    })),
  };
}
