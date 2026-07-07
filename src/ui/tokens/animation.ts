/**
 * LinkUp Design System 2026
 * Motion System - Purposeful, calm, refined
 * Every animation should feel natural and intentional
 */

// ============================================
// DURATION TOKENS
// ============================================

export const duration = {
  // Instant - for immediate feedback
  instant: '0ms',

  // Fast - hover states, micro-interactions
  fast: '100ms',

  // Normal - standard transitions
  normal: '200ms',

  // Slow - reveals, sheets
  slow: '300ms',

  // Slower - large transitions
  slower: '400ms',

  // Slowest - page transitions
  slowest: '500ms',

  // Specific durations
  enter: '250ms',
  exit: '200ms',
  press: '100ms',
  release: '150ms',
} as const;

// ============================================
// EASING FUNCTIONS - iOS-inspired curves
// ============================================

export const easing = {
  // Linear
  linear: 'linear',

  // Standard curves
  ease: 'ease',

  // iOS-style curves (from Apple HIG)
  easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',

  // Deceleration (entering content)
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',

  // Acceleration (exiting content)
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',

  // Emphasis curves (spring-like)
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInBack: 'cubic-bezier(0.64, 0, 0.78, 0)',
  easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',

  // Spring curves
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  springBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',

  // Smooth
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ============================================
// SPRING CONFIGURATIONS
// ============================================

export const spring = {
  // Default spring - balanced
  default: {
    damping: 20,
    stiffness: 300,
    mass: 1,
    velocity: 0,
  },

  // Gentle spring - smooth, calm
  gentle: {
    damping: 25,
    stiffness: 200,
    mass: 1,
    velocity: 0,
  },

  // Snappy spring - responsive
  snappy: {
    damping: 15,
    stiffness: 400,
    mass: 0.8,
    velocity: 0,
  },

  // Bouncy spring - playful
  bouncy: {
    damping: 12,
    stiffness: 300,
    mass: 0.8,
    velocity: 0,
  },

  // Stiff spring - precise
  stiff: {
    damping: 30,
    stiffness: 500,
    mass: 1,
    velocity: 0,
  },
} as const;

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions = {
  // Default - standard UI transitions
  default: {
    duration: duration.normal,
    easing: easing.decelerate,
  },

  // Fast - hover states, toggles
  fast: {
    duration: duration.fast,
    easing: easing.decelerate,
  },

  // Slow - reveals, sheets
  slow: {
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Fade - opacity changes
  fade: {
    duration: duration.fast,
    easing: easing.linear,
  },

  // Scale - resize animations
  scale: {
    duration: duration.normal,
    easing: easing.easeOutBack,
  },

  // Slide - movement animations
  slide: {
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Press - button press feedback
  press: {
    duration: duration.press,
    easing: easing.easeOut,
  },

  // Release - button release feedback
  release: {
    duration: duration.release,
    easing: easing.easeOutBack,
  },
} as const;

// ============================================
// MOTION PATTERNS - For specific UI patterns
// ============================================

export const motion = {
  // Interactive press effect
  press: {
    scale: 0.97,
    duration: duration.press,
    easing: easing.easeOut,
  },

  // Interactive hover effect
  hover: {
    scale: 1.02,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // FAB scale
  fab: {
    scale: 0.95,
    duration: duration.press,
    easing: easing.easeOut,
  },

  // List item stagger
  listStagger: {
    delay: 50,
    duration: duration.normal,
    easing: easing.decelerate,
  },

  // Card reveal
  cardReveal: {
    translateY: 8,
    opacity: 0,
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Modal appear
  modal: {
    translateY: 20,
    scale: 0.95,
    opacity: 0,
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Modal dismiss
  modalDismiss: {
    translateY: 20,
    scale: 0.95,
    opacity: 0,
    duration: duration.fast,
    easing: easing.accelerate,
  },

  // Bottom sheet appear
  bottomSheet: {
    translateY: '100%',
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Bottom sheet dismiss
  bottomSheetDismiss: {
    translateY: '100%',
    duration: duration.fast,
    easing: easing.accelerate,
  },

  // Toast appear
  toast: {
    translateY: -20,
    opacity: 0,
    duration: duration.normal,
    easing: easing.easeOutBack,
  },

  // Tab switch
  tabSwitch: {
    translateX: 0,
    duration: duration.normal,
    easing: easing.decelerate,
  },

  // Skeleton shimmer
  shimmer: {
    duration: '1500ms',
    easing: easing.linear,
  },
} as const;

// ============================================
// REDUCED MOTION - Accessibility
// ============================================

export const reducedMotion = {
  // Override for reduced motion preference
  all: {
    duration: '0.01ms',
    easing: 'linear',
  },

  // Only opacity changes
  opacity: {
    duration: '0.01ms',
    easing: 'linear',
  },

  // Only essential transforms
  essential: {
    scale: 0.98,
    duration: '0.01ms',
    easing: 'linear',
  },
} as const;

// ============================================
// INTERACTIVE FEEDBACK - Touch/click feedback
// ============================================

export const feedback = {
  // Button press
  button: {
    scale: 0.97,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Card press
  card: {
    scale: 0.99,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Icon button press
  iconButton: {
    scale: 0.9,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Toggle
  toggle: {
    scale: 0.95,
    duration: duration.fast,
    easing: easing.easeOut,
  },

  // Like/favorite heart
  heart: {
    scale: [1, 1.3, 1],
    duration: 300,
    easing: easing.easeOutBack,
  },
} as const;

// ============================================
// EXPORTS
// ============================================

export type Duration = keyof typeof duration;
export type Easing = keyof typeof easing;
export type Spring = keyof typeof spring;
