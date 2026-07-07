// Animation and motion tokens
// Functional, purposeful motion

export const easing = {
  // Standard easing curves
  linear: 'linear',
  
  // iOS-style curves
  easeIn: 'cubic-bezier(0.32, 0, 0.67, 0)',
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',
  easeInOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  
  // Emphasis curves
  easeOutBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeInBack: 'cubic-bezier(0.64, 0, 0.78, 0)',
  easeInOutBack: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  
  // Deceleration (for entering)
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  
  // Acceleration (for exiting)
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  
  // Spring
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  springBounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

export const duration = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '400ms',
  slowest: '500ms',
  
  // Specific durations
  enter: '200ms',
  exit: '150ms',
  stateChange: '200ms',
  layoutChange: '300ms',
  
  // Spring durations
  springFast: '300ms',
  springNormal: '400ms',
  springSlow: '500ms',
} as const;

export const motion = {
  // Default spring config
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
  
  springBounce: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
  
  springGentle: {
    damping: 20,
    stiffness: 100,
    mass: 1,
  },
  
  // Gesture config
  gesture: {
    quick: { duration: 100 },
    normal: { duration: 200 },
    slow: { duration: 300 },
  },
} as const;

export const transitions = {
  // Common transitions
  default: `${duration.normal} ${easing.decelerate}`,
  fast: `${duration.fast} ${easing.decelerate}`,
  slow: `${duration.slow} ${easing.decelerate}`,
  
  // Modal
  modal: `${duration.slow} ${easing.decelerate}`,
  modalExit: `${duration.fast} ${easing.accelerate}`,
  
  // Bottom Sheet
  bottomSheet: `${duration.slow} ${easing.decelerate}`,
  bottomSheetExit: `${duration.fast} ${easing.accelerate}`,
  
  // Fade
  fade: `${duration.fast} ${easing.linear}`,
  
  // Scale
  scale: `${duration.normal} ${easing.easeOutBack}`,
  scaleFast: `${duration.fast} ${easing.easeOutBack}`,
  
  // Slide
  slideUp: `${duration.slow} ${easing.decelerate}`,
  slideDown: `${duration.slow} ${easing.decelerate}`,
  slideLeft: `${duration.slow} ${easing.decelerate}`,
  slideRight: `${duration.slow} ${easing.decelerate}`,
} as const;

export type Easing = keyof typeof easing;
export type Duration = keyof typeof duration;