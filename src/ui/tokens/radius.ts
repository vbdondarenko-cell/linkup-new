/**
 * LinkUp Design System 2026
 * Radius System - Consistent curves throughout
 * Premium, modern, and refined
 */

// ============================================
// RADIUS SCALE
// ============================================

export const radius = {
  // No radius - for special cases
  none: '0px',

  // Subtle - minimal rounding
  subtle: '4px',

  // Small - buttons, inputs
  sm: '8px',

  // Medium - cards, panels
  md: '12px',

  // Large - modals, sheets
  lg: '16px',

  // Extra Large - bottom sheets
  xl: '20px',

  // 2XL - large modals
  '2xl': '24px',

  // 3XL - hero elements
  '3xl': '32px',

  // Full - avatars, badges, chips
  full: '9999px',
} as const;

// ============================================
// COMPONENT RADIUS - Semantic naming
// ============================================

export const componentRadius = {
  // Buttons
  button: {
    sm: radius.sm,
    md: radius.md,
    lg: radius.lg,
  },
  buttonSmall: radius.sm,
  buttonLarge: radius.md,

  // Inputs
  input: radius.md,
  inputLarge: radius.lg,

  // Textarea
  textarea: radius.md,
  textareaLarge: radius.lg,

  // Cards
  card: radius.lg,
  cardSmall: radius.md,
  cardLarge: radius.xl,

  // Avatar
  avatar: radius.full,
  avatarSmall: radius['2xl'],
  avatarLarge: radius.full,

  // Badge
  badge: radius.full,
  badgeSmall: radius.sm,

  // Chip/Tag
  chip: radius.full,
  chipSmall: radius.md,

  // Modal
  modal: radius.xl,
  modalSmall: radius.lg,
  modalLarge: radius['2xl'],

  // Bottom Sheet
  bottomSheet: radius.xl,
  bottomSheetLarge: radius['2xl'],

  // FAB
  fab: radius.lg,
  fabSmall: radius.md,

  // Toast
  toast: radius.lg,

  // Tooltip
  tooltip: radius.md,

  // Popover
  popover: radius.lg,

  // Overlay/Backdrop
  overlay: radius.lg,

  // Image
  image: radius.md,
  imageLarge: radius.lg,

  // List item
  listItem: radius.md,

  // Divider
  divider: radius.none,

  // Progress
  progress: radius.full,
  progressSmall: radius.sm,
} as const;

// ============================================
// INTERACTIVE RADIUS - States
// ============================================

export const interactiveRadius = {
  default: radius.md,
  hover: radius.lg,
  pressed: radius.sm,
  disabled: radius.md,
} as const;

// ============================================
// RESPONSIVE RADIUS - Can increase on larger screens
// ============================================

export const responsiveRadius = {
  mobile: {
    card: radius.md,
    modal: radius.lg,
    bottomSheet: radius.lg,
  },
  tablet: {
    card: radius.lg,
    modal: radius.xl,
    bottomSheet: radius.xl,
  },
  desktop: {
    card: radius.lg,
    modal: radius['2xl'],
    bottomSheet: radius['2xl'],
  },
} as const;

// ============================================
// EXPORTS
// ============================================

export type Radius = keyof typeof radius;
export type ComponentRadius = keyof typeof componentRadius;
