// Animation configuration for React Native
// Uses react-native-reanimated under the hood

export const animationConfig = {
  // Fast animations
  fast: {
    duration: 100,
  },

  // Normal animations
  normal: {
    duration: 200,
  },

  // Slow animations
  slow: {
    duration: 300,
  },

  // Modal animations
  modal: {
    duration: 300,
    damping: 15,
    stiffness: 150,
  },

  // Bottom sheet animations
  bottomSheet: {
    duration: 300,
    damping: 20,
    stiffness: 120,
  },

  // Spring configurations
  spring: {
    default: {
      damping: 15,
      stiffness: 150,
      mass: 1,
    },
    gentle: {
      damping: 20,
      stiffness: 100,
      mass: 1,
    },
    bouncy: {
      damping: 10,
      stiffness: 200,
      mass: 0.8,
    },
    stiff: {
      damping: 25,
      stiffness: 300,
      mass: 1,
    },
  },
} as const;

// Timing functions
export const timing = {
  linear: 'linear',
  easeIn: 'easeIn',
  easeOut: 'easeOut',
  easeInOut: 'easeInOut',
  accelerate: 'accelerate',
  decelerate: 'decelerate',
} as const;

// Gesture states
export const gestureState = {
  UNDETERMINED: 0,
  BEGAN: 1,
  ACTIVE: 2,
  END: 3,
  CANCELLED: 4,
} as const;

// Interaction delays (for haptic feedback)
export const hapticDelay = {
  light: 10,
  medium: 20,
  heavy: 30,
} as const;
