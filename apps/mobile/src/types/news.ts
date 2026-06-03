export interface NewsArticle {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  readTime?: string;
}

export interface BreakingHeadline {
  id: string;
  text: string;
}

export type FeedItem =
  | { kind: 'hero'; article: NewsArticle }
  | { kind: 'standard'; article: NewsArticle }
  | { kind: 'plain'; article: NewsArticle }
  | { kind: 'ad' };
