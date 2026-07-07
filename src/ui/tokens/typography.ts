/**
 * LinkUp Design System 2026
 * Typography System - Typography is the primary visual element
 * Font sizes, weights, line heights, and letter spacing
 */

// ============================================
// FONT FAMILIES
// ============================================

export const fontFamily = {
  // Primary: System font stack for optimal performance
  sans: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, sans-serif)',
  
  // Secondary: System font for UI elements
  ui: 'var(--font-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, sans-serif)',
  
  // Monospace: For code and technical content
  mono: 'var(--font-mono, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace)',
  
  // Numbers: Rounded variant for friendly numeric display
  numeric: 'var(--font-numeric, "SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif)',
} as const;

// ============================================
// FONT SIZES - Modular scale based on 4px
// ============================================

export const fontSize = {
  // Display - For hero sections, large announcements
  display: {
    lg: '48px',
    md: '40px',
    sm: '32px',
  },

  // Large Title - Screen headers
  largeTitle: '34px',

  // Title - Section headers
  title: {
    lg: '28px',
    md: '24px',
    sm: '20px',
  },

  // Headline - Card titles, important labels
  headline: '17px',

  // Body - Primary content
  body: {
    lg: '17px',
    md: '15px',
    sm: '13px',
  },

  // Caption - Secondary info, timestamps
  caption: {
    lg: '12px',
    md: '11px',
    sm: '10px',
  },

  // Button - Button labels
  button: {
    lg: '17px',
    md: '15px',
    sm: '13px',
  },

  // Tab - Tab labels
  tab: '13px',

  // Badge - Badge text
  badge: '11px',

  // Overline - Small caps for categories
  overline: '10px',
} as const;

// ============================================
// FONT WEIGHTS
// ============================================

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

// ============================================
// LINE HEIGHTS - Generous for readability
// ============================================

export const lineHeight = {
  none: 1,
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
  loose: 2,
} as const;

// ============================================
// LETTER SPACING - Subtle adjustments
// ============================================

export const letterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: 0,
  wide: '0.01em',
  wider: '0.02em',
  widest: '0.04em',
} as const;

// ============================================
// TYPOGRAPHY SCALE - Complete preset styles
// ============================================

export const typography = {
  // Display styles
  displayLG: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.display.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tighter,
  },
  displayMD: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.display.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  displaySM: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.display.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Large Title
  largeTitle: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Title styles
  titleLG: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.title.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  titleMD: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.title.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
  titleSM: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.title.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },

  // Headline
  headline: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.headline,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Body styles
  bodyLG: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodyMD: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySM: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.body.sm,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Caption styles
  captionLG: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption.lg,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  captionMD: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  captionSM: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.caption.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  // Button
  buttonLG: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.button.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  buttonMD: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.button.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
  buttonSM: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.button.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },

  // Tab
  tab: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.tab,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },

  // Badge
  badge: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.badge,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.wider,
  },

  // Overline
  overline: {
    fontFamily: fontFamily.ui,
    fontSize: fontSize.overline,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },

  // Numeric (for prices, dates)
  numeric: {
    fontFamily: fontFamily.numeric,
    fontSize: fontSize.body.md,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  numericLarge: {
    fontFamily: fontFamily.numeric,
    fontSize: fontSize.title.lg,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
} as const;

// ============================================
// EXPORTS
// ============================================

export type TypographyVariant = keyof typeof typography;
export type FontFamily = keyof typeof fontFamily;
export type FontWeight = keyof typeof fontWeight;
