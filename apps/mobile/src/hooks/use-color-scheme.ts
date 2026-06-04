import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useCallback, useEffect } from 'react';

const THEME_STORAGE_KEY = 'user-theme';

export type ThemePreference = 'light' | 'dark' | 'system';

let hasRestoredTheme = false;

export function useColorScheme() {
  const { colorScheme, setColorScheme: setNativeWindColorScheme } = useNativeWindColorScheme();

  useEffect(() => {
    if (hasRestoredTheme) return;
    hasRestoredTheme = true;

    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setNativeWindColorScheme(saved);
      } else {
        setNativeWindColorScheme('system');
      }
    });
  }, [setNativeWindColorScheme]);

  const setColorScheme = useCallback(
    async (scheme: ThemePreference) => {
      setNativeWindColorScheme(scheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    },
    [setNativeWindColorScheme],
  );

  const toggleColorScheme = useCallback(async () => {
    const next = colorScheme === 'light' ? 'dark' : 'light';
    setNativeWindColorScheme(next);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, next);
  }, [colorScheme, setNativeWindColorScheme]);

  const resolvedScheme = colorScheme ?? 'light';

  return {
    colorScheme: resolvedScheme,
    isDark: resolvedScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}
