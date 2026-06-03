import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import type { NewsArticle } from '@/types/news';

interface MainNewsCardProps {
  article: NewsArticle;
  variant?: 'hero' | 'standard';
  onPress?: () => void;
}

export function MainNewsCard({ article, variant = 'standard', onPress }: MainNewsCardProps) {
  const isHero = variant === 'hero';

  return (
    <Pressable
      onPress={onPress}
      className="mx-4 my-3 overflow-hidden rounded-lg border border-gray-200 bg-white active:opacity-90 dark:border-gray-700 dark:bg-gray-900">
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          className={isHero ? 'h-56 w-full' : 'h-44 w-full'}
          contentFit="cover"
          accessibilityLabel={article.title}
        />
      ) : null}

      <View className="p-4">
        <Text
          className={
            isHero
              ? 'text-xl font-extrabold leading-7 text-gray-900 dark:text-white'
              : 'text-lg font-bold leading-6 text-gray-900 dark:text-white'
          }>
          {article.title}
        </Text>

        {article.excerpt ? (
          <Text className="mt-2 text-sm leading-5 text-gray-500 dark:text-gray-400">{article.excerpt}</Text>
        ) : null}

        {(article.category || article.readTime) && (
          <View className="mt-3 flex-row items-center">
            {article.category ? (
              <Text className="text-xs font-bold uppercase text-red-600">{article.category}</Text>
            ) : null}

            {article.category && article.readTime ? (
              <Text className="mx-2 text-xs text-gray-400 dark:text-gray-500">•</Text>
            ) : null}

            {article.readTime ? (
              <Text className="text-xs uppercase text-gray-500 dark:text-gray-400">{article.readTime}</Text>
            ) : null}
          </View>
        )}
      </View>
    </Pressable>
  );
}
