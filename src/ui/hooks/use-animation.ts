/**
 * LinkUp Design System 2026
 * Animation Hooks
 * Purposeful, calm animations using design tokens
 */

import { useCallback } from 'react';
import { useSharedValue, withTiming, withSpring, withSequence } from 'react-native-reanimated';
import { duration, easing, spring, feedback } from '../tokens/animation';

export interface UseAnimationOptions {
  initialValue?: number;
  onComplete?: () => void;
}

/**
 * Press animation hook - for button/interactive element press states
 */
export const usePressAnimation = (options?: UseAnimationOptions) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatePress = useCallback(() => {
    'worklet';
    scale.value = withTiming(feedback.button.scale, {
      duration: duration.fast,
      easing: easing.easeOut,
    });
    opacity.value = withTiming(0.8, {
      duration: duration.fast,
      easing: easing.easeOut,
    });
  }, []);

  const animateRelease = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, {
      damping: spring.default.damping,
      stiffness: spring.default.stiffness,
      mass: spring.default.mass,
    });
    opacity.value = withTiming(1, {
      duration: duration.fast,
      easing: easing.easeOut,
    });
  }, []);

  return {
    scale,
    opacity,
    animatePress,
    animateRelease,
  };
};

/**
 * Fade animation hook - for opacity transitions
 */
export const useFadeAnimation = (options?: UseAnimationOptions) => {
  const opacity = useSharedValue(0);

  const fadeIn = useCallback(() => {
    opacity.value = withTiming(1, {
      duration: duration.normal,
      easing: easing.decelerate,
    });
  }, []);

  const fadeOut = useCallback(() => {
    opacity.value = withTiming(0, {
      duration: duration.fast,
      easing: easing.accelerate,
    });
  }, []);

  const fadeInOut = useCallback(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: duration.normal, easing: easing.decelerate }),
      withTiming(0, { duration: duration.fast, easing: easing.accelerate })
    );
  }, []);

  return {
    opacity,
    fadeIn,
    fadeOut,
    fadeInOut,
  };
};

/**
 * Scale animation hook - for entrance/exit animations
 */
export const useScaleAnimation = (options?: UseAnimationOptions) => {
  const scale = useSharedValue(0);

  const scaleIn = useCallback(() => {
    scale.value = withSpring(1, {
      damping: spring.bouncy.damping,
      stiffness: spring.bouncy.stiffness,
      mass: spring.bouncy.mass,
    });
  }, []);

  const scaleOut = useCallback(() => {
    scale.value = withTiming(0, {
      duration: duration.fast,
      easing: easing.accelerate,
    });
  }, []);

  return {
    scale,
    scaleIn,
    scaleOut,
  };
};

/**
 * Slide animation hook - for bottom sheets, modals
 */
export const useSlideAnimation = (options?: UseAnimationOptions) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  const slideUp = useCallback((distance: number = 20) => {
    translateY.value = withSpring(-distance, {
      damping: spring.gentle.damping,
      stiffness: spring.gentle.stiffness,
      mass: spring.gentle.mass,
    });
  }, []);

  const slideDown = useCallback((distance: number = 20) => {
    translateY.value = withSpring(distance, {
      damping: spring.gentle.damping,
      stiffness: spring.gentle.stiffness,
      mass: spring.gentle.mass,
    });
  }, []);

  const slideIn = useCallback(() => {
    translateY.value = withSpring(0, {
      damping: spring.default.damping,
      stiffness: spring.default.stiffness,
    });
  }, []);

  return {
    translateY,
    translateX,
    slideUp,
    slideDown,
    slideIn,
  };
};
