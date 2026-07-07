// Theme types and utilities
import { LightTheme, lightTheme } from './light-theme';
import { DarkTheme, darkTheme } from './dark-theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export type Theme = LightTheme | DarkTheme;

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export function getTheme(mode: ThemeMode): Theme {
  if (mode === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? darkTheme
        : lightTheme;
    }
    return lightTheme;
  }
  return themes[mode];
}

export function isDarkTheme(theme: Theme): boolean {
  return theme.mode === 'dark';
}
