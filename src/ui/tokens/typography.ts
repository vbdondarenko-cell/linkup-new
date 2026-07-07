// Typography tokens
// Professional, readable, accessible

export const fontFamily = {
  // System fonts for performance
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
  numbers: '"SF Pro Rounded", -apple-system, BlinkMacSystemFont, sans-serif',
} as const;

export const fontSize = {
  // Display
  displayLarge: '57px',
  displayMedium: '45px',
  displaySmall: '36px',
  
  // Large Title
  largeTitle: '34px',
  largeTitleBold: '34px',
  
  // Title
  title1: '28px',
  title2: '22px',
  title3: '20px',
  
  // Headline
  headline: '17px',
  headlineBold: '17px',
  
  // Body
  body: '17px',
  bodyBold: '17px',
  bodySmall: '15px',
  bodySmallBold: '15px',
  
  // Caption
  caption: '12px',
  captionBold: '12px',
  
  // Label
  label: '11px',
  labelBold: '11px',
  
  // Button
  button: '17px',
  buttonSmall: '15px',
  buttonLarge: '20px',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const lineHeight = {
  none: '1',
  tight: '1.2',
  normal: '1.4',
  relaxed: '1.6',
  loose: '2',
} as const;

export const letterSpacing = {
  tighter: '-0.8px',
  tight: '-0.4px',
  normal: '0',
  wide: '0.4px',
  wider: '0.8px',
} as const;

export const typography = {
  displayLarge: {
    fontSize: fontSize.displayLarge,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tighter,
  },
  displayMedium: {
    fontSize: fontSize.displayMedium,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.tight,
  },
  displaySmall: {
    fontSize: fontSize.displaySmall,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  largeTitle: {
    fontSize: fontSize.largeTitle,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  title1: {
    fontSize: fontSize.title1,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  title2: {
    fontSize: fontSize.title2,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  title3: {
    fontSize: fontSize.title3,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  headline: {
    fontSize: fontSize.headline,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  body: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },
  bodySmall: {
    fontSize: fontSize.bodySmall,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },
  caption: {
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
  button: {
    fontSize: fontSize.button,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.none,
    letterSpacing: letterSpacing.normal,
  },
} as const;

export type TypographyVariant = keyof typeof typography;