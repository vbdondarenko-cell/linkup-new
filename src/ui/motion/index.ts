/**
 * LinkUp Design System 2026
 * Motion Module - Animation utilities
 */

import { duration, easing, spring, transitions, motion, reducedMotion, feedback } from '../tokens/animation';

export {
  // Duration
  duration,
  
  // Easing
  easing,
  
  // Spring
  spring,
  
  // Transitions
  transitions,
  
  // Motion patterns
  motion,
  
  // Reduced motion
  reducedMotion,
  
  // Interactive feedback
  feedback,
};

// Animation utility functions
export const animationUtils = {
  /**
   * Create a transition string
   */
  transition: (property: string, durationMs: number, easingFn: string = easing.decelerate) => {
    return `${property} ${durationMs}ms ${easingFn}`;
  },

  /**
   * Create multiple transitions
   */
  transitions: (properties: Record<string, { duration: number; easing?: string }>) => {
    return Object.entries(properties)
      .map(([prop, { duration: dur, easing: ease = easing.decelerate }]) =>
        `${prop} ${dur}ms ${ease}`
      )
      .join(', ');
  },

  /**
   * Create keyframe animation
   */
  keyframes: (name: string, frames: Record<string, React.CSSProperties>) => {
    // This would be used with a CSS-in-JS solution
    return { name, frames };
  },
};

// Export spring configuration for Reanimated
export const reanimatedConfig = {
  default: {
    damping: spring.default.damping,
    stiffness: spring.default.stiffness,
    mass: spring.default.mass,
  },
  gentle: {
    damping: spring.gentle.damping,
    stiffness: spring.gentle.stiffness,
    mass: spring.gentle.mass,
  },
  snappy: {
    damping: spring.snappy.damping,
    stiffness: spring.snappy.stiffness,
    mass: spring.snappy.mass,
  },
  bouncy: {
    damping: spring.bouncy.damping,
    stiffness: spring.bouncy.stiffness,
    mass: spring.bouncy.mass,
  },
};

// CSS custom property helpers
export const motionCSS = {
  // Quick transition
  quick: `all ${duration.fast}ms ${easing.decelerate}`,
  
  // Normal transition
  normal: `all ${duration.normal}ms ${easing.decelerate}`,
  
  // Slow transition
  slow: `all ${duration.slow}ms ${easing.decelerate}`,
  
  // Press effect
  press: `transform ${duration.fast}ms ${easing.easeOut}`,
  
  // Scale effect
  scale: `transform ${duration.normal}ms ${easing.easeOutBack}`,
  
  // Fade effect
  fade: `opacity ${duration.fast}ms ${easing.linear}`,
  
  // Slide up
  slideUp: `transform ${duration.slow}ms ${easing.decelerate}`,
};
