import { Image } from 'expo-image';
import { Languages, Menu, Moon, Sun } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';

const appLogo = require('@/assets/app.png');

interface HeaderProps {
  onMenuPress?: () => void;
  onLanguagePress?: () => void;
  onEpaperPress?: () => void;
}

function HeaderIconButton({
  onPress,
  label,
  children,
}: {
  onPress: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 active:opacity-80 dark:bg-gray-800"
      accessibilityRole="button"
      accessibilityLabel={label}>
      {children}
    </Pressable>
  );
}

export function Header({
  onMenuPress = () => {},
  onLanguagePress = () => {},
  onEpaperPress = () => {},
}: HeaderProps) {
  const { colorScheme, isDark, toggleColorScheme } = useColorScheme();

  const iconColor = isDark ? '#F9FAFB' : '#111827';
  const menuIconColor = isDark ? '#9CA3AF' : '#7F7F7F';

  return (
    <SafeAreaView
      edges={['top']}
      className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <View className="min-h-[52px] flex-row items-center gap-2 px-3 py-2">
        {/* Left: menu */}
        <View className="w-10 shrink-0 items-center justify-center">
          <Pressable
            onPress={onMenuPress}
            className="h-10 w-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel="Open menu">
            <Menu size={22} color={menuIconColor} strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Center: logo + title (flexible, no overlap) */}
        <View className="min-w-0 flex-1 flex-row items-center justify-center gap-1.5">
          <Image
            source={appLogo}
            style={{ width: 36, height: 24 }}
            contentFit="contain"
            accessibilityLabel="Bharatendu Shikhar logo"
          />
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.7}
            className="shrink text-[11px] font-bold tracking-wide text-gray-900 dark:text-white">
            BHARATENDU SHIKHAR
          </Text>
        </View>

        {/* Right: actions (fixed cluster) */}
        <View className="shrink-0 flex-row items-center gap-1">
          <HeaderIconButton onPress={onLanguagePress} label="Change language">
            <Languages size={16} color={iconColor} strokeWidth={2} />
          </HeaderIconButton>

          <HeaderIconButton onPress={toggleColorScheme} label="Toggle theme">
            {colorScheme === 'light' ? (
              <Sun size={16} color={iconColor} strokeWidth={2} />
            ) : (
              <Moon size={16} color={iconColor} strokeWidth={2} />
            )}
          </HeaderIconButton>

          <Pressable
            onPress={onEpaperPress}
            className="shrink-0 rounded-full border border-red-600 bg-white px-2 py-1 active:opacity-80 dark:bg-gray-900"
            accessibilityRole="button"
            accessibilityLabel="Read ePaper">
            <Text
              numberOfLines={1}
              className="text-[10px] font-semibold leading-tight text-red-600">
              Read ePaper
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
