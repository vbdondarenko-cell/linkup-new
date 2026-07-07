// Border radius tokens
// Consistent, predictable curves

export const radius = {
  none: '0px',
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  full: '9999px',
} as const;

export const componentRadius = {
  // Buttons
  button: radius.sm,
  buttonSmall: radius.xs,
  buttonLarge: radius.md,
  
  // Inputs
  input: radius.md,
  inputLarge: radius.lg,
  
  // Cards
  card: radius.lg,
  cardLarge: radius.xl,
  
  // Avatar
  avatar: radius.full,
  avatarSmall: radius.md,
  avatarLarge: radius.full,
  
  // Badge
  badge: radius.full,
  badgeSmall: radius.sm,
  
  // Modal
  modal: radius.xl,
  modalLarge: radius['2xl'],
  
  // BottomSheet
  bottomSheet: radius.xl,
  bottomSheetLarge: radius['2xl'],
  
  // Chip
  chip: radius.full,
  chipSmall: radius.md,
  
  // FAB
  fab: radius.xl,
  fabSmall: radius.lg,
  
  // Overlay
  overlay: radius.lg,
  
  // Toast
  toast: radius.lg,
} as const;

export type Radius = keyof typeof radius;
export type ComponentRadius = keyof typeof componentRadius;