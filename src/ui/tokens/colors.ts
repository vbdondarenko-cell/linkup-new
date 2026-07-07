/**
 * LinkUp Design System 2026
 * Color Tokens - Semantic colors only
 * Never hardcode colors - always use tokens
 */

// ============================================
// BRAND COLORS
// ============================================

export const brand = {
  // Primary - Deep Ocean Blue
  // Trust, confidence, calm
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

  // Secondary - Soft Lavender
  // Human connection, warmth
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

  // Accent - Fresh Mint
  // Success, growth, positive action
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
} as const;

// ============================================
// SEMANTIC STATUS COLORS
// ============================================

export const semantic = {
  success: {
    light: '#10B981',
    DEFAULT: '#10B981',
    dark: '#059669',
    bg: '#ECFDF5',
    bgSubtle: '#D1FAE5',
    text: '#065F46',
    border: '#A7F3D0',
  },
  warning: {
    light: '#F59E0B',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
    bg: '#FFFBEB',
    bgSubtle: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
  },
  danger: {
    light: '#EF4444',
    DEFAULT: '#EF4444',
    dark: '#DC2626',
    bg: '#FEF2F2',
    bgSubtle: '#FEE2E2',
    text: '#991B1B',
    border: '#FECACA',
  },
  info: {
    light: '#3B82F6',
    DEFAULT: '#3B82F6',
    dark: '#2563EB',
    bg: '#EFF6FF',
    bgSubtle: '#DBEAFE',
    text: '#1E40AF',
    border: '#BFDBFE',
  },
} as const;

// ============================================
// NEUTRAL - SURFACE COLORS
// ============================================

export const neutral = {
  0: '#FFFFFF',
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E8E8E8',
  300: '#D6D6D6',
  400: '#A8A8A8',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
  950: '#0A0A0A',
  1000: '#000000',
} as const;

// ============================================
// PREMIUM & FEATURE COLORS
// ============================================

export const premium = {
  gold: {
    light: '#FBBF24',
    DEFAULT: '#F59E0B',
    dark: '#D97706',
    bg: '#FFFBEB',
    bgSubtle: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A',
    glow: 'rgba(251, 191, 36, 0.4)',
  },
} as const;

export const business = {
  blue: {
    light: '#3B82F6',
    DEFAULT: '#2563EB',
    dark: '#1D4ED8',
    bg: '#EFF6FF',
    bgSubtle: '#DBEAFE',
    text: '#1E40AF',
    border: '#BFDBFE',
    glow: 'rgba(59, 130, 246, 0.4)',
  },
} as const;

export const organizer = {
  purple: {
    light: '#A855F7',
    DEFAULT: '#9333EA',
    dark: '#7E22CE',
    bg: '#FAF5FF',
    bgSubtle: '#F3E8FF',
    text: '#6B21A8',
    border: '#E9D5FF',
    glow: 'rgba(168, 85, 247, 0.4)',
  },
} as const;

// ============================================
// SURFACE HIERARCHY
// ============================================

export const surface = {
  // Background
  background: {
    light: '#FAFAFA',
    dark: '#09090B',
  },

  // Primary surface
  primary: {
    light: '#FFFFFF',
    dark: '#18181B',
  },

  // Secondary surface (cards, panels)
  secondary: {
    light: '#F5F5F5',
    dark: '#27272A',
  },

  // Elevated surface (modals, sheets)
  elevated: {
    light: '#FFFFFF',
    dark: '#27272A',
  },

  // Tertiary surface
  tertiary: {
    light: '#E8E8E8',
    dark: '#3F3F46',
  },

  // Inverse (dark on light, light on dark)
  inverse: {
    light: '#171717',
    dark: '#FAFAFA',
  },

  // Floating (FABs, dropdowns)
  floating: {
    light: '#FFFFFF',
    dark: '#27272A',
  },

  // Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },

  // Map specific
  map: {
    background: {
      light: '#E8E8E8',
      dark: '#181818',
    },
    overlay: {
      light: 'rgba(255, 255, 255, 0.95)',
      dark: 'rgba(30, 30, 30, 0.95)',
    },
    marker: '#5A70ED',
    markerSelected: '#10B981',
    userLocation: '#10B981',
    cluster: '#9333EA',
  },
} as const;

// ============================================
// TEXT COLORS
// ============================================

export const text = {
  primary: {
    light: '#171717',
    dark: '#FAFAFA',
  },
  secondary: {
    light: '#525252',
    dark: '#A1A1AA',
  },
  tertiary: {
    light: '#737373',
    dark: '#71717A',
  },
  disabled: {
    light: '#A3A3A3',
    dark: '#52525B',
  },
  placeholder: {
    light: '#A3A3A3',
    dark: '#52525B',
  },
  inverse: {
    light: '#FFFFFF',
    dark: '#171717',
  },
  link: {
    light: '#5A70ED',
    dark: '#7A94F6',
  },
} as const;

// ============================================
// BORDER COLORS
// ============================================

export const border = {
  default: {
    light: '#E8E8E8',
    dark: '#27272A',
  },
  subtle: {
    light: '#F5F5F5',
    dark: '#18181B',
  },
  strong: {
    light: '#D6D6D6',
    dark: '#3F3F46',
  },
  inverse: {
    light: '#FAFAFA',
    dark: '#171717',
  },
} as const;

// ============================================
// INTERACTIVE COLORS
// ============================================

export const interactive = {
  primary: {
    default: brand.primary[500],
    hover: brand.primary[600],
    pressed: brand.primary[700],
    disabled: neutral[200],
  },
  secondary: {
    default: brand.secondary[500],
    hover: brand.secondary[600],
    pressed: brand.secondary[700],
    disabled: neutral[200],
  },
  muted: {
    default: neutral[100],
    hover: neutral[200],
    pressed: neutral[300],
    disabled: neutral[100],
    dark: {
      default: neutral[800],
      hover: neutral[700],
      pressed: neutral[600],
      disabled: neutral[800],
    },
  },
} as const;

// ============================================
// FOCUS & ACCESSIBILITY
// ============================================

export const focus = {
  ring: {
    light: 'rgba(90, 112, 237, 0.4)',
    dark: 'rgba(122, 148, 246, 0.5)',
  },
  indicator: brand.primary[500],
} as const;

// ============================================
// COMPLETE COLOR EXPORTS
// ============================================

export const colors = {
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
} as const;

export type Colors = typeof colors;
export type BrandColor = keyof typeof brand;
export type SemanticColor = keyof typeof semantic;
