/**
 * LinkUp Design System 2026
 * Transitions - Reusable, purposeful animations
 * All animations feel physical and natural
 */

'use client';

import React, { useEffect } from 'react';
import { ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Extrapolation,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { duration, easing, spring } from '../../tokens/animation';

// ============================================
// TRANSITION TYPES
// ============================================

export type TransitionType =
  | 'push'
  | 'pop'
  | 'fade'
  | 'scale'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'bottomSheet'
  | 'modal'
  | 'hero';

export interface TransitionConfig {
  duration?: number;
  easing?: string;
  delay?: number;
}

// ============================================
// TRANSITION PRESETS
// ============================================

export const transitions = {
  // Quick transitions (100ms)
  quick: {
    duration: duration.fast,
    easing: easing.decelerate,
  },

  // Normal transitions (200ms)
  normal: {
    duration: duration.normal,
    easing: easing.decelerate,
  },

  // Slow transitions (300ms)
  slow: {
    duration: duration.slow,
    easing: easing.decelerate,
  },

  // Push transition
  push: {
    enter: {
      duration: duration.slow,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.fast,
      easing: easing.accelerate,
    },
  },

  // Pop transition
  pop: {
    enter: {
      duration: duration.fast,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.slow,
      easing: easing.accelerate,
    },
  },

  // Fade transition
  fade: {
    enter: {
      duration: duration.normal,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.fast,
      easing: easing.linear,
    },
  },

  // Scale transition
  scale: {
    enter: {
      duration: duration.normal,
      easing: easing.easeOutBack,
    },
    exit: {
      duration: duration.fast,
      easing: easing.accelerate,
    },
  },

  // Slide up (bottom sheets)
  slideUp: {
    enter: {
      duration: duration.slow,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.fast,
      easing: easing.accelerate,
    },
  },

  // Hero transition
  hero: {
    enter: {
      duration: duration.slower,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.fast,
      easing: easing.accelerate,
    },
  },

  // Modal transition
  modal: {
    enter: {
      duration: duration.slow,
      easing: easing.decelerate,
    },
    exit: {
      duration: duration.fast,
      easing: easing.accelerate,
    },
  },
} as const;

// ============================================
// HOOKS
// ============================================

/**
 * Fade transition hook
 */
export function useFadeTransition(visible: boolean) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: visible
        ? transitions.fade.enter.duration
        : transitions.fade.exit.duration,
    });
  }, [visible, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return animatedStyle;
}

/**
 * Scale transition hook
 */
export function useScaleTransition(visible: boolean) {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      opacity.value = withTiming(1, { duration: duration.fast });
    } else {
      scale.value = withTiming(0.9, { duration: duration.fast });
      opacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return animatedStyle;
}

/**
 * Slide transition hook
 */
export function useSlideTransition(
  visible: boolean,
  direction: 'up' | 'down' | 'left' | 'right' = 'up'
) {
  const translate = useSharedValue(
    direction === 'up' || direction === 'down' ? 100 : 0
  );
  const opacity = useSharedValue(0);

  const getTranslateValue = () => {
    switch (direction) {
      case 'up': return -100;
      case 'down': return 100;
      case 'left': return 50;
      case 'right': return -50;
    }
  };

  useEffect(() => {
    if (visible) {
      translate.value = withSpring(0, {
        damping: spring.gentle.damping,
        stiffness: spring.gentle.stiffness,
      });
      opacity.value = withTiming(1, { duration: duration.normal });
    } else {
      translate.value = withTiming(getTranslateValue(), {
        duration: duration.fast,
      });
      opacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, translate, opacity, direction]);

  const animatedStyle = useAnimatedStyle(() => {
    const transform = [];

    switch (direction) {
      case 'up':
      case 'down':
        transform.push({ translateY: translate.value });
        break;
      case 'left':
      case 'right':
        transform.push({ translateX: translate.value });
        break;
    }

    return {
      opacity: opacity.value,
      transform,
    };
  });

  return animatedStyle;
}

/**
 * Bottom sheet transition hook
 */
export function useBottomSheetTransition(visible: boolean, height: number) {
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      opacity.value = withTiming(1, { duration: duration.fast });
    } else {
      translateY.value = withSpring(height, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      opacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, translateY, opacity, height]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return { backdropStyle, sheetStyle };
}

/**
 * Modal transition hook
 */
export function useModalTransition(visible: boolean) {
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(20);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      translateY.value = withSpring(0, {
        damping: spring.gentle.damping,
        stiffness: spring.gentle.stiffness,
      });
      opacity.value = withTiming(1, { duration: duration.fast });
    } else {
      scale.value = withTiming(0.95, { duration: duration.fast });
      translateY.value = withTiming(20, { duration: duration.fast });
      opacity.value = withTiming(0, { duration: duration.fast });
    }
  }, [visible, scale, translateY, opacity]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  return { backdropStyle, modalStyle };
}

/**
 * Press animation hook for buttons
 */
export function usePressTransition() {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withSpring(0.97, {
      damping: spring.snappy.damping,
      stiffness: spring.snappy.stiffness,
    });
    opacity.value = withTiming(0.85, { duration: duration.fast });
  };

  const onPressOut = () => {
    scale.value = withSpring(1, {
      damping: spring.default.damping,
      stiffness: spring.default.stiffness,
    });
    opacity.value = withTiming(1, { duration: duration.fast });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}

/**
 * Tab switch animation hook
 */
export function useTabSwitchAnimation(index: number) {
  const indicatorPosition = useSharedValue(index);

  useEffect(() => {
    indicatorPosition.value = withSpring(index, {
      damping: spring.default.damping,
      stiffness: spring.default.stiffness,
    });
  }, [index, indicatorPosition]);

  return indicatorPosition;
}

/**
 * Stagger animation hook for lists
 */
export function useStaggerAnimation(
  itemCount: number,
  visible: boolean,
  baseDelay: number = 50
) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      opacity.value = withDelay(
        100,
        withTiming(1, { duration: duration.normal })
      );
      translateY.value = withDelay(
        100,
        withSpring(0, {
          damping: spring.gentle.damping,
          stiffness: spring.gentle.stiffness,
        })
      );
    } else {
      opacity.value = 0;
      translateY.value = 20;
    }
  }, [visible, opacity, translateY]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { containerStyle, itemCount, baseDelay };
}

// ============================================
// MOTION UTILITIES
// ============================================

export const motionUtils = {
  /**
   * Create spring animation config
   */
  spring: (type: keyof typeof spring = 'default') => ({
    damping: spring[type].damping,
    stiffness: spring[type].stiffness,
    mass: spring[type].mass,
  }),

  /**
   * Create timing animation config
   */
  timing: (durationMs: number, easingFn: string = easing.decelerate) => ({
    duration: durationMs,
    easing: Easing.bezier(0.33, 1, 0.68, 1), // Default easeOut
  }),

  /**
   * Generate random ID for animations
   */
  generateId: () => `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
};

// ============================================
// EASING FUNCTIONS
// ============================================

export const easings = {
  // Standard
  linear: Easing.linear,
  
  // iOS-style
  easeIn: Easing.bezier(0.32, 0, 0.67, 0),
  easeOut: Easing.bezier(0.33, 1, 0.68, 1),
  easeInOut: Easing.bezier(0.65, 0, 0.35, 1),
  
  // Emphasis
  easeOutBack: Easing.bezier(0.34, 1.56, 0.64, 1),
  easeInBack: Easing.bezier(0.64, 0, 0.78, 0),
  
  // Standard curves
  decelerate: Easing.out(Easing.cubic),
  accelerate: Easing.in(Easing.cubic),
};
