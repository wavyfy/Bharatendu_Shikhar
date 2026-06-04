import { ScrollView, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Advertisement } from '@/components/Common/Advertisement';
import { BreakingTicker } from '@/components/Common/BreakingTicker';
import { Header } from '@/components/Common/Header';
import { MainNewsCard } from '@/components/News/MainNewsCard';
import { PlainNewsCard } from '@/components/News/PlainNewsCard';
import { breakingHeadlines, homeFeed } from '@/constants/mockData';
import { Spacing } from '@/constants/theme';
import type { FeedItem } from '@/types/news';

function renderFeedItem(item: FeedItem, index: number) {
  switch (item.kind) {
    case 'hero':
      return (
        <MainNewsCard
          key={`${item.kind}-${item.article.id}`}
          article={item.article}
          variant="hero"
        />
      );
    case 'standard':
      return (
        <MainNewsCard
          key={`${item.kind}-${item.article.id}`}
          article={item.article}
          variant="standard"
        />
      );
    case 'plain':
      return <PlainNewsCard key={`${item.kind}-${item.article.id}`} article={item.article} />;
    case 'ad':
      return <Advertisement key={`ad-${index}`} />;
    default:
      return null;
  }
}

export default function HomeScreen() {
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + Spacing.three;

  return (
    <SafeAreaView edges={['left', 'right']} className="flex-1 bg-white dark:bg-black">
      <Header />
      <BreakingTicker headlines={breakingHeadlines} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPadding }}>
        <View>{homeFeed.map(renderFeedItem)}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
