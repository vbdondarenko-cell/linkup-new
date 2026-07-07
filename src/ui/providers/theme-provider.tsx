/**
 * LinkUp Design System 2026
 * Theme Provider - React Context for theming
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Theme, ThemeMode, ThemeContextValue, getTheme } from '../theme/theme';

interface ThemeProviderProps {
  children: ReactNode;
  initialMode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
}

interface ThemeContextValueInternal {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  isDark: boolean;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValueInternal | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialMode = 'system',
  onModeChange,
}) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const [systemDark, setSystemDark] = useState<boolean>(false);

  // Update system dark preference
  useEffect(() => {
    setSystemDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  // Compute current theme
  const theme = useMemo<Theme>(() => {
    if (mode === 'system') {
      return systemDark ? getTheme('dark') : getTheme('light');
    }
    return getTheme(mode);
  }, [mode, systemDark]);

  const isDark = mode === 'dark' || (mode === 'system' && systemDark);
  const isLight = !isDark;

  // Set mode with callback
  const handleSetMode = useCallback((newMode: ThemeMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  }, [onModeChange]);

  // Toggle between light and dark
  const toggle = useCallback(() => {
    const newMode = theme.mode === 'dark' ? 'light' : 'dark';
    handleSetMode(newMode);
  }, [theme.mode, handleSetMode]);

  const value: ThemeContextValueInternal = {
    theme,
    mode,
    setMode: handleSetMode,
    toggle,
    isDark,
    isLight,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for full theme context
export function useThemeContext(): ThemeContextValueInternal {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Backward compatible hook - returns just theme
export const useTheme = (): Theme => {
  const { theme } = useThemeContext();
  return theme;
};

// Backward compatible hook - returns mode context
export const useThemeMode = (): ThemeContextValueInternal => {
  return useThemeContext();
};
