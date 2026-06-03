import type { BreakingHeadline, FeedItem } from '@/types/news';

export const breakingHeadlines: BreakingHeadline[] = [
  {
    id: 'bh-1',
    text: 'Parliament passes landmark infrastructure bill with bipartisan support',
  },
  {
    id: 'bh-2',
    text: 'Central bank holds rates steady amid global economic uncertainty',
  },
  {
    id: 'bh-3',
    text: 'National team captain ruled out of upcoming test series',
  },
];

export const homeFeed: FeedItem[] = [
  {
    kind: 'hero',
    article: {
      id: 'article-1',
      title: 'Historic Derby Day Draws Record Crowds as Underdog Claims Victory',
      excerpt:
        'In a stunning upset at the annual championship, the long-shot contender crossed the finish line ahead of seasoned favorites, marking one of the most memorable races in recent history.',
      imageUrl:
        'https://images.unsplash.com/photo-1553284965-83fd3ddf82d5?w=800&h=450&fit=crop',
      category: 'Politics',
      readTime: '5 MIN READ',
    },
  },
  {
    kind: 'standard',
    article: {
      id: 'article-2',
      title: 'Opposition Leader Calls for Emergency Session on Economic Reform Package',
      excerpt:
        'Addressing a packed press conference, the senior politician outlined a five-point plan aimed at stabilizing markets and protecting middle-class households.',
      imageUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=450&fit=crop',
      category: 'Politics',
      readTime: '4 MIN READ',
    },
  },
  {
    kind: 'plain',
    article: {
      id: 'article-3',
      title: 'Supreme Court to Hear Arguments on Digital Privacy Rights Next Month',
      readTime: '3 MIN READ',
    },
  },
  { kind: 'ad' },
  {
    kind: 'standard',
    article: {
      id: 'article-4',
      title: 'Star All-Rounder Returns to Squad After Injury Layoff Ahead of World Cup',
      excerpt:
        'The comeback has boosted team morale as selectors finalize the playing eleven for the opening match of the international tournament.',
      imageUrl:
        'https://images.unsplash.com/photo-1531418841129-489b986cf783?w=800&h=450&fit=crop',
      category: 'Sports',
      readTime: '5 MIN READ',
    },
  },
  {
    kind: 'plain',
    article: {
      id: 'article-5',
      title: 'New Trade Agreement Expected to Boost Exports in Key Manufacturing Sectors',
      readTime: '4 MIN READ',
    },
  },
  {
    kind: 'plain',
    article: {
      id: 'article-6',
      title: 'Urban Transit Authority Announces Expanded Night Service Across Metro Lines',
      readTime: '2 MIN READ',
    },
  },
];
