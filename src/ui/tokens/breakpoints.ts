/**
 * LinkUp Design System 2026
 * Breakpoint System - Responsive design tokens
 */

// ============================================
// BREAKPOINT VALUES
// ============================================

export const breakpoints = {
  // Mobile first breakpoints
  xs: '0px',      // Extra small (phones < 375px)
  sm: '640px',    // Small (phones, large phones)
  md: '768px',    // Medium (tablets, small laptops)
  lg: '1024px',   // Large (laptops, desktops)
  xl: '1280px',   // Extra large (desktops)
  '2xl': '1536px', // 2XL (large desktops)
  '3xl': '1920px', // 3XL (ultrawide)
} as const;

// ============================================
// BREAKPOINT NUMERIC VALUES (for JS)
// ============================================

export const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
  '3xl': 1920,
} as const;

// ============================================
// MEDIA QUERIES
// ============================================

export const mediaQuery = {
  // Min-width queries
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  '3xl': `@media (min-width: ${breakpoints['3xl']})`,

  // Max-width queries
  maxXs: `@media (max-width: ${breakpoints.xs})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`,
  max2xl: `@media (max-width: ${breakpoints['2xl']})`,

  // Range queries
  betweenSmMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  betweenMdLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  betweenLgXl: `@media (min-width: ${breakpoints.lg}) and (max-width: ${breakpoints.xl})`,
  betweenMdXl: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.xl})`,
} as const;

// ============================================
// DEVICE QUERIES
// ============================================

export const deviceQuery = {
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',

  // Pointer devices
  pointer: '@media (hover: fine) and (pointer: fine)',

  // Fine pointer (mouse)
  mouse: '@media (hover: fine) and (pointer: fine) and (hover: hover)',

  // Coarse pointer (touch)
  coarsePointer: '@media (pointer: coarse)',

  // High contrast
  highContrast: '@media (prefers-contrast: high)',

  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',

  // Dark color scheme
  dark: '@media (prefers-color-scheme: dark)',

  // Light color scheme
  light: '@media (prefers-color-scheme: light)',

  // Print
  print: '@media print',

  // Screen readers
  screenReader: `
    @media speech,
    @media (update: none) {
      /* Visually hidden but accessible */
    }
  `,
} as const;

// ============================================
// CONTAINER WIDTHS
// ============================================

export const containerWidth = {
  // Standard containers
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%',
} as const;

// ============================================
// ASPECT RATIOS
// ============================================

export const aspectRatio = {
  square: '1 / 1',
  portrait: '3 / 4',
  landscape: '4 / 3',
  wide: '16 / 9',
  ultraWide: '21 / 9',
  video: '16 / 9',
  photo: '4 / 3',
  avatar: '1 / 1',
  card: '4 / 3',
  story: '9 / 16',
} as const;

// ============================================
// EXPORTS
// ============================================

export type Breakpoint = keyof typeof breakpoints;
