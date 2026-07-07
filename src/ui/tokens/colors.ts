// Color tokens for LinkUp Design System
// Semantic colors only - never hardcode colors

export const colors = {
  // Primary palette
  primary: {
    50: '#EEF2FF',
    100: '#E0E7FF',
    200: '#C7D2FE',
    300: '#A5B4FC',
    400: '#818CF8',
    500: '#6366F1', // Main primary
    600: '#4F46E5',
    700: '#4338CA',
    800: '#3730A3',
    900: '#312E81',
  },

  // Secondary palette
  secondary: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Main secondary
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Accent palette
  accent: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main accent
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },

  // Semantic colors
  semantic: {
    success: {
      light: '#22C55E',
      dark: '#16A34A',
      bg: '#F0FDF4',
      text: '#166534',
    },
    warning: {
      light: '#F59E0B',
      dark: '#D97706',
      bg: '#FFFBEB',
      text: '#92400E',
    },
    danger: {
      light: '#EF4444',
      dark: '#DC2626',
      bg: '#FEF2F2',
      text: '#991B1B',
    },
    info: {
      light: '#3B82F6',
      dark: '#2563EB',
      bg: '#EFF6FF',
      text: '#1E40AF',
    },
  },

  // Neutral/Gray palette
  neutral: {
    0: '#FFFFFF',
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0A0A0A',
  },

  // Premium accent (gold)
  premium: {
    light: '#FBBF24',
    dark: '#F59E0B',
    bg: '#FFFBEB',
    text: '#92400E',
  },

  // Business accent (blue)
  business: {
    light: '#3B82F6',
    dark: '#2563EB',
    bg: '#EFF6FF',
    text: '#1E40AF',
  },

  // Organizer accent (purple)
  organizer: {
    light: '#A855F7',
    dark: '#9333EA',
    bg: '#FAF5FF',
    text: '#6B21A8',
  },

  // Shadows
  shadow: {
    sm: 'rgba(0, 0, 0, 0.05)',
    md: 'rgba(0, 0, 0, 0.1)',
    lg: 'rgba(0, 0, 0, 0.15)',
    xl: 'rgba(0, 0, 0, 0.2)',
  },

  // Map specific
  map: {
    overlay: 'rgba(255, 255, 255, 0.95)',
    marker: '#6366F1',
    userLocation: '#22C55E',
    cluster: '#8B5CF6',
  },
} as const;

export type ColorPalette = typeof colors;
export type SemanticColor = keyof typeof colors.semantic;