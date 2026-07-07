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
  0: '0px',
  px: '1px',
  0.5: '2px',
  1: '4px',
  1.5: '6px',
  2: '8px',
  2.5: '10px',
  3: '12px',
  3.5: '14px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '28px',
  8: '32px',
  9: '36px',
  10: '40px',
  11: '44px',
  12: '48px',
  14: '56px',
  16: '64px',
  20: '80px',
  24: '96px',
  28: '112px',
  32: '128px',
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
  containerMaxWidth: '1200px',
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
    xs: '12px',
    sm: '16px',
    md: '20px',
    lg: '24px',
    xl: '32px',
  },
} as const;

// ============================================
// GAP TOKENS
// ============================================

export const gap = {
  none: '0px',
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
  minimum: '44px',
  comfortable: '48px',
  large: '56px',
} as const;

// ============================================
// PADDING PRESETS
// ============================================

export const padding = {
  none: '0px',
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
  0: '0px',
  1: '1px',
  2: '2px',
  4: '4px',
} as const;

// ============================================
// EXPORTS
// ============================================

export type Spacing = keyof typeof spacing;
export type Gap = keyof typeof gap;
