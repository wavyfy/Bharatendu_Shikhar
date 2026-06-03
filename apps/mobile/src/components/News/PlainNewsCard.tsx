import { Pressable, Text, View } from 'react-native';

import type { NewsArticle } from '@/types/news';

interface PlainNewsCardProps {
  article: NewsArticle;
  onPress?: () => void;
}

export function PlainNewsCard({ article, onPress }: PlainNewsCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-4 my-3 rounded-lg border border-gray-200 bg-white p-4 active:opacity-90 dark:border-gray-700 dark:bg-gray-900">
      <Text className="text-base font-bold leading-6 text-gray-900 dark:text-white">{article.title}</Text>

      {article.readTime ? (
        <Text className="mt-3 text-xs uppercase text-gray-500 dark:text-gray-400">{article.readTime}</Text>
      ) : null}
    </Pressable>
  );
}
