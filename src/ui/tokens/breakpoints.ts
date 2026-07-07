// Breakpoint tokens for responsive design

export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export const breakpointValues = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const mediaQuery = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  '2xl': `@media (min-width: ${breakpoints['2xl']})`,
  
  // Max width queries
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`,
  
  // Range queries
  betweenSmMd: `@media (min-width: ${breakpoints.sm}) and (max-width: ${breakpoints.md})`,
  betweenMdLg: `@media (min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  
  // Touch devices
  touch: '@media (hover: none) and (pointer: coarse)',
  pointer: '@media (hover: fine) and (pointer: fine)',
  
  // Reduced motion
  reducedMotion: '@media (prefers-reduced-motion: reduce)',
} as const;

export const containerWidth = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
} as const;

export type Breakpoint = keyof typeof breakpoints;