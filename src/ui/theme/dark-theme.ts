// Dark Theme for LinkUp Design System
// Designed independently, OLED-friendly, comfortable

import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { radius } from '../tokens/radius';

export const darkTheme = {
  mode: 'dark' as const,
  
  colors: {
    // Background colors
    background: {
      primary: colors.neutral[950],
      secondary: colors.neutral[900],
      tertiary: colors.neutral[800],
      inverse: colors.neutral[0],
    },
    
    // Surface colors
    surface: {
      primary: colors.neutral[900],
      secondary: colors.neutral[800],
      tertiary: colors.neutral[700],
      elevated: colors.neutral[800],
      interactive: colors.neutral[800],
      inverse: colors.neutral[0],
    },
    
    // Card
    card: {
      background: colors.neutral[900],
      border: colors.neutral[700],
      shadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
    },
    
    // Border
    border: {
      default: colors.neutral[700],
      muted: colors.neutral[800],
      strong: colors.neutral[600],
      inverse: colors.neutral[300],
    },
    
    // Divider
    divider: {
      default: colors.neutral[800],
      strong: colors.neutral[700],
    },
    
    // Text colors
    text: {
      primary: colors.neutral[0],
      secondary: colors.neutral[400],
      tertiary: colors.neutral[500],
      disabled: colors.neutral[600],
      inverse: colors.neutral[900],
      link: colors.primary[400],
      linkHover: colors.primary[300],
    },
    
    // Interactive
    interactive: {
      primary: colors.primary[400],
      primaryHover: colors.primary[300],
      primaryPressed: colors.primary[500],
      secondary: colors.secondary[400],
      secondaryHover: colors.secondary[300],
      secondaryPressed: colors.secondary[500],
      muted: colors.neutral[800],
      mutedHover: colors.neutral[700],
      mutedPressed: colors.neutral[600],
      disabled: colors.neutral[800],
    },
    
    // Focus
    focus: {
      ring: 'rgba(165, 180, 252, 0.4)',
      indicator: colors.primary[400],
    },
    
    // Overlay
    overlay: {
      light: 'rgba(0, 0, 0, 0.6)',
      medium: 'rgba(0, 0, 0, 0.7)',
      heavy: 'rgba(0, 0, 0, 0.85)',
      backdrop: 'rgba(0, 0, 0, 0.5)',
    },
    
    // Map specific
    map: {
      background: '#1A1A1A',
      controls: 'rgba(30, 30, 30, 0.95)',
      controlsBorder: colors.neutral[700],
      bottomSheet: colors.neutral[900],
      marker: colors.primary[400],
      userLocation: colors.accent[400],
      cluster: colors.secondary[400],
    },
    
    // Status
    status: {
      success: {
        light: colors.semantic.success.light,
        dark: colors.semantic.success.dark,
        bg: 'rgba(34, 197, 94, 0.15)',
        text: colors.accent[300],
      },
      warning: {
        light: colors.semantic.warning.light,
        dark: colors.semantic.warning.dark,
        bg: 'rgba(245, 158, 11, 0.15)',
        text: '#FCD34D',
      },
      danger: {
        light: colors.semantic.danger.light,
        dark: colors.semantic.danger.dark,
        bg: 'rgba(239, 68, 68, 0.15)',
        text: colors.semantic.danger.light,
      },
      info: {
        light: colors.semantic.info.light,
        dark: colors.semantic.info.dark,
        bg: 'rgba(59, 130, 246, 0.15)',
        text: colors.semantic.info.light,
      },
    },
    
    // Premium/Feature
    premium: {
      accent: colors.premium.dark,
      background: 'rgba(251, 191, 36, 0.15)',
    },
    
    business: {
      accent: colors.business.dark,
      background: 'rgba(59, 130, 246, 0.15)',
    },
    
    organizer: {
      accent: colors.organizer.dark,
      background: 'rgba(168, 85, 247, 0.15)',
    },
  },
  
  // Spacing
  spacing: spacing,
  
  // Border radius
  radius: {
    ...radius,
    component: {
      button: '8px',
      buttonSmall: '6px',
      buttonLarge: '10px',
      input: '10px',
      card: '16px',
      modal: '20px',
      bottomSheet: '20px',
      avatar: '9999px',
      badge: '9999px',
      chip: '9999px',
      fab: '16px',
    },
  },
  
  // Shadows
  shadows: {
    ...shadows,
    component: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 2px 8px rgba(0, 0, 0, 0.3)',
      lg: '0 4px 16px rgba(0, 0, 0, 0.4)',
      xl: '0 8px 24px rgba(0, 0, 0, 0.5)',
      card: '0 2px 8px rgba(0, 0, 0, 0.25)',
      cardHover: '0 8px 16px rgba(0, 0, 0, 0.35)',
      modal: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
      fab: '0 4px 14px rgba(0, 0, 0, 0.4)',
      bottomSheet: '0 -4px 20px rgba(0, 0, 0, 0.3)',
    },
  },
} as const;

export type DarkTheme = typeof darkTheme;
