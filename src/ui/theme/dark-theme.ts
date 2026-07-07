/**
 * LinkUp Design System 2026
 * Dark Theme - OLED-friendly, comfortable
 * Not an inversion - thoughtfully designed
 */

import {
  brand,
  semantic,
  neutral,
  premium,
  business,
  organizer,
  surface,
  text,
  border,
  interactive,
  focus,
} from '../tokens/colors';

import { spacing, layout, component, touchTarget, gap, padding } from '../tokens/spacing';
import { radius, componentRadius } from '../tokens/radius';
import { darkShadows, elevation, componentShadow, focusRing, glow } from '../tokens/shadows';
import { duration, easing, transitions, motion } from '../tokens/animation';
import { zIndex, overlayZIndex, mapZIndex, navZIndex } from '../tokens/z-index';
import { typography, fontFamily } from '../tokens/typography';

export const darkTheme = {
  mode: 'dark' as const,

  // ============================================
  // COLORS
  // ============================================

  colors: {
    // Brand colors (slightly brighter for dark mode)
    brand: {
      primary: {
        50: '#F0F5FF',
        100: '#E0EAFF',
        200: '#C7D4FF',
        300: '#A3B8FC',
        400: '#7A94F6',
        500: '#5A70ED',
        600: '#4654D9',
        700: '#3840B5',
        800: '#303491',
        900: '#1C1B40',
        950: '#12113A',
      },
      secondary: {
        50: '#FDF4FF',
        100: '#FAE8FF',
        200: '#F5D6FE',
        300: '#F0B4FC',
        400: '#E686F8',
        500: '#D85EEF',
        600: '#C23EDD',
        700: '#A329C0',
        800: '#852299',
        900: '#5E1B6B',
        950: '#451050',
      },
      accent: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
        950: '#022C22',
      },
    },

    // Semantic status colors
    status: {
      success: {
        light: '#34D399',
        DEFAULT: '#10B981',
        dark: '#059669',
        bg: 'rgba(16, 185, 129, 0.15)',
        bgSubtle: 'rgba(16, 185, 129, 0.1)',
        text: '#6EE7B7',
        border: 'rgba(16, 185, 129, 0.3)',
      },
      warning: {
        light: '#FBBF24',
        DEFAULT: '#F59E0B',
        dark: '#D97706',
        bg: 'rgba(245, 158, 11, 0.15)',
        bgSubtle: 'rgba(245, 158, 11, 0.1)',
        text: '#FCD34D',
        border: 'rgba(245, 158, 11, 0.3)',
      },
      danger: {
        light: '#F87171',
        DEFAULT: '#EF4444',
        dark: '#DC2626',
        bg: 'rgba(239, 68, 68, 0.15)',
        bgSubtle: 'rgba(239, 68, 68, 0.1)',
        text: '#FCA5A5',
        border: 'rgba(239, 68, 68, 0.3)',
      },
      info: {
        light: '#60A5FA',
        DEFAULT: '#3B82F6',
        dark: '#2563EB',
        bg: 'rgba(59, 130, 246, 0.15)',
        bgSubtle: 'rgba(59, 130, 246, 0.1)',
        text: '#93C5FD',
        border: 'rgba(59, 130, 246, 0.3)',
      },
    },

    // Premium/Business/Organizer colors (adjusted for dark mode)
    premium: {
      light: '#FBBF24',
      DEFAULT: '#F59E0B',
      dark: '#D97706',
      bg: 'rgba(251, 191, 36, 0.15)',
      bgSubtle: 'rgba(251, 191, 36, 0.1)',
      text: '#FCD34D',
      border: 'rgba(251, 191, 36, 0.3)',
      glow: 'rgba(251, 191, 36, 0.3)',
    },
    business: {
      light: '#60A5FA',
      DEFAULT: '#3B82F6',
      dark: '#2563EB',
      bg: 'rgba(59, 130, 246, 0.15)',
      bgSubtle: 'rgba(59, 130, 246, 0.1)',
      text: '#93C5FD',
      border: 'rgba(59, 130, 246, 0.3)',
      glow: 'rgba(59, 130, 246, 0.3)',
    },
    organizer: {
      light: '#C084FC',
      DEFAULT: '#A855F7',
      dark: '#9333EA',
      bg: 'rgba(168, 85, 247, 0.15)',
      bgSubtle: 'rgba(168, 85, 247, 0.1)',
      text: '#D8B4FE',
      border: 'rgba(168, 85, 247, 0.3)',
      glow: 'rgba(168, 85, 247, 0.3)',
    },

    // Surface hierarchy (dark mode)
    surface: {
      background: surface.background.dark,
      primary: surface.primary.dark,
      secondary: surface.secondary.dark,
      elevated: surface.elevated.dark,
      tertiary: surface.tertiary.dark,
      inverse: surface.inverse.dark,
      floating: surface.floating.dark,
      overlay: surface.overlay.dark,
    },

    // Text colors (dark mode)
    text: {
      primary: text.primary.dark,
      secondary: text.secondary.dark,
      tertiary: text.tertiary.dark,
      disabled: text.disabled.dark,
      placeholder: text.placeholder.dark,
      inverse: text.inverse.dark,
      link: text.link.dark,
    },

    // Border colors (dark mode)
    border: {
      default: border.default.dark,
      subtle: border.subtle.dark,
      strong: border.strong.dark,
      inverse: border.inverse.dark,
    },

    // Interactive colors (dark mode)
    interactive: {
      primary: brand.primary[400],
      primaryHover: brand.primary[300],
      primaryPressed: brand.primary[500],
      primaryDisabled: neutral[700],
      secondary: brand.secondary[400],
      secondaryHover: brand.secondary[300],
      secondaryPressed: brand.secondary[500],
      secondaryDisabled: neutral[700],
      muted: interactive.muted.dark.default,
      mutedHover: interactive.muted.dark.hover,
      mutedPressed: interactive.muted.dark.pressed,
      mutedDisabled: interactive.muted.dark.disabled,
    },

    // Focus/Accessibility
    focus: {
      ring: focus.ring.dark,
      indicator: brand.primary[400],
    },

    // Map specific (dark mode)
    map: {
      background: surface.map.background.dark,
      overlay: surface.map.overlay.dark,
      marker: brand.primary[400],
      markerSelected: brand.accent[400],
      userLocation: brand.accent[400],
      cluster: brand.secondary[400],
    },
  },

  // ============================================
  // TYPOGRAPHY
  // ============================================

  typography: {
    ...typography,
    fontFamily: fontFamily.sans,
  },

  // ============================================
  // SPACING
  // ============================================

  spacing: {
    ...spacing,
    layout,
    component,
    touchTarget,
    gap,
    padding,
  },

  // ============================================
  // RADIUS
  // ============================================

  radius: {
    ...radius,
    component: componentRadius,
  },

  // ============================================
  // SHADOWS & ELEVATION (darker mode)
  // ============================================

  shadows: {
    ...darkShadows,
    elevation,
    component: {
      ...componentShadow,
      card: darkShadows.sm,
      cardHover: darkShadows.md,
    },
    focusRing: focusRing.dark,
    glow,
  },

  // ============================================
  // MOTION
  // ============================================

  motion: {
    duration,
    easing,
    transitions,
    ...motion,
  },

  // ============================================
  // Z-INDEX
  // ============================================

  zIndex: {
    ...zIndex,
    overlay: overlayZIndex,
    map: mapZIndex,
    nav: navZIndex,
  },

  // ============================================
  // ICON SIZES
  // ============================================

  icon: {
    size: {
      xs: '12px',
      sm: '16px',
      md: '20px',
      lg: '24px',
      xl: '32px',
    },
  },
} as const;

export type DarkTheme = typeof darkTheme;
