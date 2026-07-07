// Light Theme for LinkUp Design System
// High contrast, readable outdoors, Apple-inspired

import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { shadows } from '../tokens/shadows';
import { radius } from '../tokens/radius';

export const lightTheme = {
  mode: 'light' as const,
  
  colors: {
    // Background colors
    background: {
      primary: colors.neutral[0],
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
      inverse: colors.neutral[900],
    },
    
    // Surface colors
    surface: {
      primary: colors.neutral[0],
      secondary: colors.neutral[50],
      tertiary: colors.neutral[100],
      elevated: colors.neutral[0],
      interactive: colors.neutral[50],
      inverse: colors.neutral[900],
    },
    
    // Card
    card: {
      background: colors.neutral[0],
      border: colors.neutral[200],
      shadow: shadows.md,
    },
    
    // Border
    border: {
      default: colors.neutral[200],
      muted: colors.neutral[100],
      strong: colors.neutral[300],
      inverse: colors.neutral[700],
    },
    
    // Divider
    divider: {
      default: colors.neutral[100],
      strong: colors.neutral[200],
    },
    
    // Text colors
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[400],
      disabled: colors.neutral[300],
      inverse: colors.neutral[0],
      link: colors.primary[600],
      linkHover: colors.primary[700],
    },
    
    // Interactive
    interactive: {
      primary: colors.primary[500],
      primaryHover: colors.primary[600],
      primaryPressed: colors.primary[700],
      secondary: colors.secondary[500],
      secondaryHover: colors.secondary[600],
      secondaryPressed: colors.secondary[700],
      muted: colors.neutral[100],
      mutedHover: colors.neutral[200],
      mutedPressed: colors.neutral[300],
      disabled: colors.neutral[200],
    },
    
    // Focus
    focus: {
      ring: 'rgba(99, 102, 241, 0.3)',
      indicator: colors.primary[500],
    },
    
    // Overlay
    overlay: {
      light: 'rgba(0, 0, 0, 0.4)',
      medium: 'rgba(0, 0, 0, 0.5)',
      heavy: 'rgba(0, 0, 0, 0.7)',
      backdrop: 'rgba(0, 0, 0, 0.3)',
    },
    
    // Map specific
    map: {
      background: '#E8E8E8',
      controls: 'rgba(255, 255, 255, 0.95)',
      controlsBorder: colors.neutral[200],
      bottomSheet: colors.neutral[0],
      marker: colors.primary[500],
      userLocation: colors.accent[500],
      cluster: colors.secondary[500],
    },
    
    // Status
    status: {
      success: colors.semantic.success,
      warning: colors.semantic.warning,
      danger: colors.semantic.danger,
      info: colors.semantic.info,
    },
    
    // Premium/Feature
    premium: {
      accent: colors.premium.light,
      background: colors.premium.bg,
    },
    
    business: {
      accent: colors.business.light,
      background: colors.business.bg,
    },
    
    organizer: {
      accent: colors.organizer.light,
      background: colors.organizer.bg,
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
      sm: shadows.sm,
      md: shadows.md,
      lg: shadows.lg,
      xl: shadows.xl,
      card: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
      cardHover: '0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
      modal: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      fab: '0 4px 14px rgba(0, 0, 0, 0.15)',
      bottomSheet: '0 -4px 20px rgba(0, 0, 0, 0.1)',
    },
  },
} as const;

export type LightTheme = typeof lightTheme;
