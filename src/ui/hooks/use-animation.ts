import { useCallback } from 'react';
import { useSharedValue, withTiming, withSpring, withSequence, runOnJS } from 'react-native-reanimated';
import { animationConfig, timing } from '../motion/animation-config';

export interface UseAnimationOptions {
  initialValue?: number;
  onComplete?: () => void;
}

export const usePressAnimation = (options?: UseAnimationOptions) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatePress = useCallback(() => {
    'worklet';
    scale.value = withTiming(0.97, { duration: animationConfig.fast.duration });
    opacity.value = withTiming(0.8, { duration: animationConfig.fast.duration });
  }, []);

  const animateRelease = useCallback(() => {
    'worklet';
    scale.value = withSpring(1, animationConfig.spring.default);
    opacity.value = withTiming(1, { duration: animationConfig.fast.duration });
  }, []);

  return {
    scale,
    opacity,
    animatePress,
    animateRelease,
  };
};

export const useFadeAnimation = (options?: UseAnimationOptions) => {
  const opacity = useSharedValue(0);

  const fadeIn = useCallback(() => {
    opacity.value = withTiming(1, { duration: animationConfig.normal.duration });
  }, []);

  const fadeOut = useCallback(() => {
    opacity.value = withTiming(0, { duration: animationConfig.normal.duration });
  }, []);

  const fadeInOut = useCallback(() => {
    opacity.value = withSequence(
      withTiming(1, { duration: animationConfig.normal.duration }),
      withTiming(0, { duration: animationConfig.normal.duration })
    );
  }, []);

  return {
    opacity,
    fadeIn,
    fadeOut,
    fadeInOut,
  };
};

export const useScaleAnimation = (options?: UseAnimationOptions) => {
  const scale = useSharedValue(0);

  const scaleIn = useCallback(() => {
    scale.value = withSpring(1, animationConfig.spring.bouncy);
  }, []);

  const scaleOut = useCallback(() => {
    scale.value = withTiming(0, { duration: animationConfig.fast.duration });
  }, []);

  return {
    scale,
    scaleIn,
    scaleOut,
  };
};
