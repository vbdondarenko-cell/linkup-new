// Spacing tokens - 4px base unit
// Consistent spacing only

export const spacing = {
  0: '0px',
  0.5: '2px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
} as const;

export const layout = {
  // Screen padding
  screenPadding: '16px',
  screenPaddingHorizontal: '16px',
  screenPaddingVertical: '16px',
  
  // Container
  containerMaxWidth: '1200px',
  containerPadding: '24px',
  
  // Card
  cardPadding: '16px',
  cardPaddingLarge: '24px',
  
  // Input
  inputPaddingHorizontal: '16px',
  inputPaddingVertical: '12px',
  
  // Button
  buttonPaddingHorizontal: '16px',
  buttonPaddingVertical: '12px',
  buttonPaddingHorizontalLarge: '24px',
  buttonPaddingVerticalLarge: '16px',
  
  // List
  listItemPadding: '16px',
  listItemGap: '12px',
  
  // Section
  sectionGap: '24px',
  sectionPadding: '16px',
} as const;

export type Spacing = keyof typeof spacing;