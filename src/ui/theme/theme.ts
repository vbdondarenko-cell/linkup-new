/**
 * LinkUp Design System 2026
 * Theme Types and Utilities
 */

import { LightTheme, lightTheme } from './light-theme';
import { DarkTheme, darkTheme } from './dark-theme';

// ============================================
// THEME TYPES
// ============================================

export type ThemeMode = 'light' | 'dark' | 'system';

export type Theme = LightTheme | DarkTheme;

// ============================================
// THEME MAP
// ============================================

export const themes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

// ============================================
// THEME CONTEXT VALUE
// ============================================

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}

// ============================================
// THEME UTILITIES
// ============================================

/**
 * Get the appropriate theme based on mode
 */
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

/**
 * Check if theme is dark mode
 */
export function isDarkTheme(theme: Theme): boolean {
  return theme.mode === 'dark';
}

/**
 * Check if theme is light mode
 */
export function isLightTheme(theme: Theme): boolean {
  return theme.mode === 'light';
}

/**
 * Get CSS variable name for dynamic theming
 */
export function getCSSVariable(name: string): string {
  return `var(--${name})`;
}

/**
 * Generate CSS custom properties from theme
 */
export function generateCSSVariables(theme: Theme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Colors
  Object.entries(theme.colors).forEach(([category, value]) => {
    if (typeof value === 'object' && value !== null) {
      Object.entries(value).forEach(([key, val]) => {
        if (typeof val === 'string') {
          vars[`--color-${category}-${key}`] = val;
        } else if (typeof val === 'object') {
          Object.entries(val).forEach(([subKey, subVal]) => {
            vars[`--color-${category}-${key}-${subKey}`] = subVal as string;
          });
        }
      });
    }
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--spacing-${key}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subVal]) => {
        if (typeof subVal === 'string') {
          vars[`--spacing-${key}-${subKey}`] = subVal;
        } else if (typeof subVal === 'object') {
          Object.entries(subVal as Record<string, string>).forEach(([deepKey, deepVal]) => {
            vars[`--spacing-${key}-${subKey}-${deepKey}`] = deepVal;
          });
        }
      });
    }
  });

  // Radius
  Object.entries(theme.radius).forEach(([key, value]) => {
    if (typeof value === 'string') {
      vars[`--radius-${key}`] = value;
    } else if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subVal]) => {
        if (typeof subVal === 'string') {
          vars[`--radius-${key}-${subKey}`] = subVal;
        }
      });
    }
  });

  // Typography
  vars['--font-family'] = theme.typography.fontFamily;
  Object.entries(theme.typography).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([prop, val]) => {
        if (typeof val === 'string') {
          vars[`--font-${key}-${prop}`] = val;
        }
      });
    }
  });

  return vars;
}

/**
 * Subscribe to system theme changes
 */
export function subscribeToSystemTheme(callback: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches);
  };

  mediaQuery.addEventListener('change', handler);

  return () => {
    mediaQuery.removeEventListener('change', handler);
  };
}
