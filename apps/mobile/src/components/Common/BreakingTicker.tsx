import { ScrollView, Text, View } from 'react-native';

import type { BreakingHeadline } from '@/types/news';

interface BreakingTickerProps {
  headlines: BreakingHeadline[];
}

export function BreakingTicker({ headlines }: BreakingTickerProps) {
  return (
    <View className="flex-row items-center bg-red-600 px-4 py-2.5">
      <Text className="mr-3 text-xs font-bold uppercase text-white">Today&apos;s Headlines</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1">
        <View className="flex-row items-center">
          {headlines.map((headline, index) => (
            <View key={headline.id} className="flex-row items-center">
              {index > 0 && <Text className="mx-3 text-white opacity-80">•</Text>}
              <Text className="text-xs text-white" numberOfLines={1}>
                {headline.text}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
