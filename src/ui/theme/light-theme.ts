/**
 * LinkUp Design System 2026
 * Light Theme - Primary experience
 * Clean, calm, premium
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
import { shadows, elevation, componentShadow, focusRing, glow } from '../tokens/shadows';
import { duration, easing, transitions, motion } from '../tokens/animation';
import { zIndex, overlayZIndex, mapZIndex, navZIndex } from '../tokens/z-index';
import { typography, fontFamily } from '../tokens/typography';

export const lightTheme = {
  mode: 'light' as const,

  // ============================================
  // COLORS
  // ============================================

  colors: {
    // Brand colors
    brand: {
      primary: brand.primary,
      secondary: brand.secondary,
      accent: brand.accent,
    },

    // Semantic status colors
    status: {
      success: semantic.success,
      warning: semantic.warning,
      danger: semantic.danger,
      info: semantic.info,
    },

    // Premium/Business/Organizer colors
    premium: premium.gold,
    business: business.blue,
    organizer: organizer.purple,

    // Surface hierarchy
    surface: {
      background: surface.background.light,
      primary: surface.primary.light,
      secondary: surface.secondary.light,
      elevated: surface.elevated.light,
      tertiary: surface.tertiary.light,
      inverse: surface.inverse.light,
      floating: surface.floating.light,
      overlay: surface.overlay.light,
    },

    // Text colors
    text: {
      primary: text.primary.light,
      secondary: text.secondary.light,
      tertiary: text.tertiary.light,
      disabled: text.disabled.light,
      placeholder: text.placeholder.light,
      inverse: text.inverse.light,
      link: text.link.light,
    },

    // Border colors
    border: {
      default: border.default.light,
      subtle: border.subtle.light,
      strong: border.strong.light,
      inverse: border.inverse.light,
    },

    // Interactive colors
    interactive: {
      primary: interactive.primary.default,
      primaryHover: interactive.primary.hover,
      primaryPressed: interactive.primary.pressed,
      primaryDisabled: interactive.primary.disabled,
      secondary: interactive.secondary.default,
      secondaryHover: interactive.secondary.hover,
      secondaryPressed: interactive.secondary.pressed,
      secondaryDisabled: interactive.secondary.disabled,
      muted: interactive.muted.default,
      mutedHover: interactive.muted.hover,
      mutedPressed: interactive.muted.pressed,
      mutedDisabled: interactive.muted.disabled,
    },

    // Focus/Accessibility
    focus: {
      ring: focus.ring.light,
      indicator: focus.indicator,
    },

    // Map specific
    map: {
      background: surface.map.background.light,
      overlay: surface.map.overlay.light,
      marker: surface.map.marker,
      markerSelected: surface.map.markerSelected,
      userLocation: surface.map.userLocation,
      cluster: surface.map.cluster,
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
  // SHADOWS & ELEVATION
  // ============================================

  shadows: {
    ...shadows,
    elevation,
    component: componentShadow,
    focusRing: focusRing.light,
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

export type LightTheme = typeof lightTheme;
