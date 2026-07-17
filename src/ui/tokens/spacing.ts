/**
 * LinkUp Design System 2026
 * Spacing System - 4px base unit
 * Never use random spacing - always use tokens
 */

// ============================================
// SPACING SCALE
// ============================================

export const spacing = {
  // Base unit: 4px
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// ============================================
// LAYOUT SPACING
// ============================================

export const layout = {
  // Screen edge padding
  screenPadding: spacing[4],
  screenPaddingHorizontal: spacing[4],
  screenPaddingVertical: spacing[4],

  // Safe area insets
  safeAreaTop: 'env(safe-area-inset-top)',
  safeAreaBottom: 'env(safe-area-inset-bottom)',
  safeAreaLeft: 'env(safe-area-inset-left)',
  safeAreaRight: 'env(safe-area-inset-right)',

  // Container
  containerMaxWidth: 1200,
  containerPadding: spacing[6],

  // Grid
  gridGap: spacing[4],
  gridGapLarge: spacing[6],
} as const;

// ============================================
// COMPONENT SPACING
// ============================================

export const component = {
  // Card
  cardPadding: spacing[4],
  cardPaddingLarge: spacing[6],
  cardGap: spacing[3],

  // Button
  buttonPadding: {
    horizontal: spacing[4],
    vertical: spacing[3],
  },
  buttonPaddingLarge: {
    horizontal: spacing[6],
    vertical: spacing[4],
  },
  buttonPaddingSmall: {
    horizontal: spacing[3],
    vertical: spacing[2],
  },

  // Input
  inputPadding: {
    horizontal: spacing[4],
    vertical: spacing[3],
  },
  inputPaddingLarge: {
    horizontal: spacing[4],
    vertical: spacing[4],
  },

  // List
  listItemPadding: spacing[4],
  listItemGap: spacing[3],
  listSectionGap: spacing[6],

  // Section
  sectionGap: spacing[6],
  sectionPadding: spacing[4],
  sectionGapLarge: spacing[8],

  // Stack (gap between stacked elements)
  stackGap: spacing[2],
  stackGapLarge: spacing[4],

  // Inline (gap between inline elements)
  inlineGap: spacing[2],
  inlineGapLarge: spacing[3],

  // Icon
  iconGap: spacing[2],
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
} as const;

// ============================================
// GAP TOKENS
// ============================================

export const gap = {
  none: 0,
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[3],
  lg: spacing[4],
  xl: spacing[6],
  '2xl': spacing[8],
  '3xl': spacing[12],
} as const;

// ============================================
// TOUCH TARGETS - Minimum 44px for accessibility
// ============================================

export const touchTarget = {
  minimum: 44,
  comfortable: 48,
  large: 56,
} as const;

// ============================================
// PADDING PRESETS
// ============================================

export const padding = {
  none: 0,
  xs: spacing[1],
  sm: spacing[2],
  md: spacing[3],
  lg: spacing[4],
  xl: spacing[6],
  '2xl': spacing[8],
  '3xl': spacing[12],
} as const;

// ============================================
// INSET (for shadows, strokes)
// ============================================

export const inset = {
  0: 0,
  1: 1,
  2: 2,
  4: 4,
} as const;

// ============================================
// EXPORTS
// ============================================

export type Spacing = keyof typeof spacing;
export type Gap = keyof typeof gap;
