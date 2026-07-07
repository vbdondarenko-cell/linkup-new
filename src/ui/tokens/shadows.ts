// Shadow tokens
// Subtle, natural, depth without noise

export const shadows = {
  none: 'none',
  
  // iOS-inspired shadows
  xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
  sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
  
  // Inner shadows
  innerSm: 'inset 0 1px 2px rgba(0, 0, 0, 0.06)',
  innerMd: 'inset 0 2px 4px rgba(0, 0, 0, 0.08)',
  
  // Focus ring
  focus: '0 0 0 3px rgba(99, 102, 241, 0.3)',
  focusLight: '0 0 0 3px rgba(99, 102, 241, 0.2)',
  focusDark: '0 0 0 3px rgba(99, 102, 241, 0.4)',
} as const;

export const elevation = {
  0: shadows.none,
  1: shadows.xs,
  2: shadows.sm,
  3: shadows.md,
  4: shadows.lg,
  5: shadows.xl,
  6: shadows['2xl'],
} as const;

export type Shadow = keyof typeof shadows;
export type Elevation = keyof typeof elevation;