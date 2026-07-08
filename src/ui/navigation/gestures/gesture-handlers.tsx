/**
 * LinkUp Design System 2026
 * Gesture Handlers - Natural, intuitive interactions
 * Swipe back, drag, long press, and more
 */

'use client';

import React, { useCallback } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  LongPressGestureHandler,
  TapGestureHandler,
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
  RotationGestureHandler,
  RotationGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useHaptics } from '../../hooks/use-haptics';
import { spring, duration } from '../../tokens/animation';

// ============================================
// SWIPE BACK HANDLER
// ============================================

interface SwipeBackHandlerProps {
  children: React.ReactNode;
  onSwipeBack: () => void;
  enabled?: boolean;
  threshold?: number;
  velocityThreshold?: number;
  style?: ViewStyle;
}

export const SwipeBackHandler: React.FC<SwipeBackHandlerProps> = ({
  children,
  onSwipeBack,
  enabled = true,
  threshold = 100,
  velocityThreshold = 500,
  style,
}) => {
  const haptics = useHaptics();
  const translateX = useSharedValue(0);
  const progress = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      // Only allow right swipe (going back)
      if (event.translationX > 0) {
        // Apply resistance
        translateX.value = event.translationX * 0.5;
        progress.value = interpolate(
          event.translationX,
          [0, threshold],
          [0, 1],
          Extrapolation.CLAMP
        );
      }
    },
    onEnd: (event) => {
      // Trigger back if threshold or velocity met
      if (
        translateX.value > threshold ||
        event.velocityX > velocityThreshold
      ) {
        runOnJS(haptics.selection)();
        runOnJS(onSwipeBack)();
      }

      // Animate back to original position
      translateX.value = withSpring(0, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      progress.value = withTiming(0, { duration: duration.fast });
    },
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0, 0.3]),
  }));

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <View style={[styles.container, style]}>
      {/* Backdrop indicator */}
      <Animated.View style={[styles.backdrop, backdropStyle]} />

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.content, containerStyle]}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

// ============================================
// DRAG HANDLER
// ============================================

interface DragHandlerProps {
  children: React.ReactNode;
  onDragStart?: () => void;
  onDragEnd?: (translationY: number, velocityY: number) => void;
  onDrag?: (translationY: number) => void;
  direction?: 'vertical' | 'horizontal';
  enabled?: boolean;
  style?: ViewStyle;
}

export const DragHandler: React.FC<DragHandlerProps> = ({
  children,
  onDragStart,
  onDragEnd,
  onDrag,
  direction = 'vertical',
  enabled = true,
  style,
}) => {
  const haptics = useHaptics();
  const translate = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { start: number }
  >({
    onStart: (_, ctx) => {
      ctx.start = translate.value;
      if (onDragStart) {
        runOnJS(onDragStart)();
      }
    },
    onActive: (event, ctx) => {
      const delta =
        direction === 'vertical' ? event.translationY : event.translationX;
      translate.value = ctx.start + delta;

      if (onDrag) {
        runOnJS(onDrag)(translate.value);
      }
    },
    onEnd: (event) => {
      const velocity =
        direction === 'vertical' ? event.velocityY : event.velocityX;

      if (onDragEnd) {
        runOnJS(onDragEnd)(translate.value, velocity);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const transform =
      direction === 'vertical'
        ? [{ translateY: translate.value }]
        : [{ translateX: translate.value }];

    return { transform };
  });

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </PanGestureHandler>
  );
};

// ============================================
// LONG PRESS HANDLER
// ============================================

interface LongPressHandlerProps {
  children: React.ReactNode;
  onLongPress: () => void;
  duration?: number;
  enabled?: boolean;
  style?: ViewStyle;
}

export const LongPressHandler: React.FC<LongPressHandlerProps> = ({
  children,
  onLongPress,
  duration: pressDuration = 500,
  enabled = true,
  style,
}) => {
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handleLongPress = useCallback(() => {
    haptics.medium();
    onLongPress();
  }, [haptics, onLongPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <LongPressGestureHandler
      onBegan={() => {
        scale.value = withSpring(0.95, {
          damping: spring.snappy.damping,
          stiffness: spring.snappy.stiffness,
        });
      }}
      onEnded={() => {
        scale.value = withSpring(1, {
          damping: spring.default.damping,
          stiffness: spring.default.stiffness,
        });
        runOnJS(handleLongPress)();
      }}
      minDurationMs={pressDuration}
      enabled={enabled}
    >
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </LongPressGestureHandler>
  );
};

// ============================================
// TAP HANDLER
// ============================================

interface TapHandlerProps {
  children: React.ReactNode;
  onTap: () => void;
  onDoubleTap?: () => void;
  numberOfTaps?: number;
  enabled?: boolean;
  style?: ViewStyle;
}

export const TapHandler: React.FC<TapHandlerProps> = ({
  children,
  onTap,
  onDoubleTap,
  numberOfTaps = 1,
  enabled = true,
  style,
}) => {
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handleTap = useCallback(() => {
    haptics.light();
    onTap();
  }, [haptics, onTap]);

  const handleDoubleTap = useCallback(() => {
    haptics.medium();
    onDoubleTap?.();
  }, [haptics, onDoubleTap]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TapGestureHandler
      onBegan={() => {
        scale.value = withSpring(0.97, {
          damping: spring.snappy.damping,
          stiffness: spring.snappy.stiffness,
        });
      }}
      onEnded={() => {
        scale.value = withSpring(1, {
          damping: spring.default.damping,
          stiffness: spring.default.stiffness,
        });
      }}
      numberOfTaps={numberOfTaps}
      enabled={enabled}
    >
      <Animated.View style={[style, animatedStyle]}>
        {onDoubleTap ? (
          <TapGestureHandler
            onTapped={() => {
              runOnJS(handleDoubleTap)();
            }}
            numberOfTaps={2}
          >
            <Animated.View>{children}</Animated.View>
          </TapGestureHandler>
        ) : (
          <View onTouchEnd={handleTap}>{children}</View>
        )}
      </Animated.View>
    </TapGestureHandler>
  );
};

// ============================================
// PINCH TO ZOOM HANDLER
// ============================================

interface PinchToZoomHandlerProps {
  children: React.ReactNode;
  minScale?: number;
  maxScale?: number;
  onZoomStart?: () => void;
  onZoomEnd?: (scale: number) => void;
  enabled?: boolean;
  style?: ViewStyle;
}

export const PinchToZoomHandler: React.FC<PinchToZoomHandlerProps> = ({
  children,
  minScale = 1,
  maxScale = 3,
  onZoomStart,
  onZoomEnd,
  enabled = true,
  style,
}) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const gestureHandler = useAnimatedGestureHandler<
    PinchGestureHandlerGestureEvent,
    { startScale: number }
  >({
    onStart: () => {
      savedScale.value = scale.value;
      if (onZoomStart) {
        runOnJS(onZoomStart)();
      }
    },
    onActive: (event, ctx) => {
      const newScale = ctx.startScale * event.scale;
      scale.value = Math.min(Math.max(newScale, minScale), maxScale);
    },
    onEnd: () => {
      // Snap back if scale is too small
      if (scale.value < minScale) {
        scale.value = withSpring(minScale, {
          damping: spring.default.damping,
          stiffness: spring.default.stiffness,
        });
      }

      if (onZoomEnd) {
        runOnJS(onZoomEnd)(scale.value);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <PinchGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
    </PinchGestureHandler>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
});
