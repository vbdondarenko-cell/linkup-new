/**
 * LinkUp Design System 2026
 * Shadow & Elevation System
 * Subtle, natural depth - never heavy or noisy
 */

// ============================================
// SHADOW PRESETS - iOS-inspired, refined
// ============================================

export const shadows = {
  // No shadow
  none: 'none',

  // Level 1: Subtle lift
  xs: '0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.02)',

  // Level 2: Surface elevation
  sm: '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',

  // Level 3: Raised elements
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',

  // Level 4: Floating elements
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',

  // Level 5: Modal
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Level 6: Heavy modal
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',

  // Inner shadows
  inner: {
    sm: 'inset 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
    lg: 'inset 0 4px 8px rgba(0, 0, 0, 0.08)',
  },
} as const;

// ============================================
// ELEVATION SYSTEM - Semantic naming
// ============================================

export const elevation = {
  // Base level - same as background
  base: shadows.none,

  // Surface - cards, list items
  surface: shadows.sm,

  // Raised - elevated cards, dropdowns
  raised: shadows.md,

  // Floating - FABs, floating buttons
  floating: shadows.lg,

  // Modal - modals, dialogs
  modal: shadows.xl,

  // Popover - tooltips, popovers
  popover: shadows.lg,

  // Bottom sheet
  bottomSheet: shadows.xl,

  // Toast
  toast: shadows['2xl'],
} as const;

// ============================================
// COMPONENT SHADOWS - Semantic for specific components
// ============================================

export const componentShadow = {
  // Card shadows
  card: shadows.sm,
  cardHover: shadows.md,
  cardActive: shadows.xs,

  // Button shadows
  button: shadows.none,
  buttonHover: shadows.sm,
  buttonPressed: shadows.inner.sm,

  // FAB shadows
  fab: shadows.lg,
  fabHover: shadows.xl,

  // Input shadows
  input: shadows.none,
  inputFocus: `0 0 0 3px rgba(90, 112, 237, 0.15)`,
  inputError: `0 0 0 3px rgba(239, 68, 68, 0.15)`,

  // Modal shadows
  modal: shadows['2xl'],
  modalSmall: shadows.xl,

  // Bottom sheet
  bottomSheet: shadows.xl,

  // Dropdown
  dropdown: shadows.lg,

  // Tooltip
  tooltip: shadows.md,

  // Navigation
  nav: shadows.sm,
  navFloating: shadows.lg,
} as const;

// ============================================
// FOCUS RINGS - Accessibility
// ============================================

export const focusRing = {
  light: {
    default: '0 0 0 2px rgba(90, 112, 237, 0.4)',
    inset: 'inset 0 0 0 2px rgba(90, 112, 237, 0.4)',
  },
  dark: {
    default: '0 0 0 2px rgba(122, 148, 246, 0.5)',
    inset: 'inset 0 0 0 2px rgba(122, 148, 246, 0.5)',
  },
} as const;

// ============================================
// GLOW EFFECTS - For premium/premium indicators
// ============================================

export const glow = {
  // Primary glow
  primary: {
    sm: '0 0 8px rgba(90, 112, 237, 0.25)',
    md: '0 0 16px rgba(90, 112, 237, 0.35)',
    lg: '0 0 24px rgba(90, 112, 237, 0.45)',
  },

  // Premium glow (gold)
  premium: {
    sm: '0 0 8px rgba(251, 191, 36, 0.3)',
    md: '0 0 16px rgba(251, 191, 36, 0.4)',
    lg: '0 0 24px rgba(251, 191, 36, 0.5)',
  },

  // Success glow
  success: {
    sm: '0 0 8px rgba(16, 185, 129, 0.3)',
    md: '0 0 16px rgba(16, 185, 129, 0.4)',
  },

  // Danger glow
  danger: {
    sm: '0 0 8px rgba(239, 68, 68, 0.3)',
    md: '0 0 16px rgba(239, 68, 68, 0.4)',
  },
} as const;

// ============================================
// DARK MODE SHADOWS - OLED-friendly, deeper
// ============================================

export const darkShadows = {
  ...shadows,
  xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.35)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.45), 0 4px 6px -2px rgba(0, 0, 0, 0.35)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
} as const;

// ============================================
// EXPORTS
// ============================================

export type Shadow = keyof typeof shadows;
export type Elevation = keyof typeof elevation;
