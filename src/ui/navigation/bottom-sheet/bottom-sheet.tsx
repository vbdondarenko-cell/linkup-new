/**
 * LinkUp Design System 2026
 * Bottom Sheet - Interactive, elastic, accessible
 * Supports collapsed, medium, expanded, fullscreen
 */

'use client';

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Dimensions,
  BackHandler,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';
import { duration, spring } from '../../tokens/animation';

// ============================================
// TYPES
// ============================================

export type SnapPoint = 'collapsed' | 'medium' | 'expanded' | 'fullscreen';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  snapPoints?: {
    collapsed?: number;
    medium?: number;
    expanded?: number;
    fullscreen?: number;
  };
  initialSnap?: SnapPoint;
  enableScroll?: boolean;
  enableDrag?: boolean;
  enableElastic?: boolean;
  showHandle?: boolean;
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ============================================
// BOTTOM SHEET
// ============================================

export const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  snapPoints = {},
  enableScroll = true,
  enableDrag = true,
  enableElastic = true,
  showHandle = true,
  title,
  children,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const defaultSnapPoints = useMemo(
    () => ({
      collapsed: snapPoints.collapsed ?? SCREEN_HEIGHT * 0.15,
      medium: snapPoints.medium ?? SCREEN_HEIGHT * 0.4,
      expanded: snapPoints.expanded ?? SCREEN_HEIGHT * 0.7,
      fullscreen: snapPoints.fullscreen ?? SCREEN_HEIGHT * 0.95,
    }),
    [snapPoints]
  );

  const [currentSnap, setCurrentSnap] = useState<SnapPoint>('collapsed');
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useSharedValue(0);
  const isScrolling = useSharedValue(false);

  // Animation values
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue({ y: 0 });
  const opacity = useSharedValue(0);

  // Determine snap point value
  const getSnapPointValue = useCallback(
    (point: SnapPoint) => {
      return defaultSnapPoints[point];
    },
    [defaultSnapPoints]
  );

  // Current position based on snap
  const targetY = useMemo(() => {
    return SCREEN_HEIGHT - getSnapPointValue(currentSnap);
  }, [currentSnap, getSnapPointValue]);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: duration.fast });
      translateY.value = withSpring(targetY, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
    } else {
      opacity.value = withTiming(0, { duration: duration.fast });
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
    }
  }, [visible, targetY, translateY, opacity]);

  // Back handler
  useEffect(() => {
    if (visible) {
      const handler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClose();
        return true;
      });
      return () => handler.remove();
    }
  }, [visible]);

  const handleClose = useCallback(() => {
    haptics.sheetClose();
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: spring.default.damping,
      stiffness: spring.default.stiffness,
    });
    setTimeout(onClose, 200);
  }, [haptics, onClose, translateY]);

  const handleSnap = useCallback(
    (point: SnapPoint) => {
      haptics.sheetOpen();
      setCurrentSnap(point);
      const pointY = SCREEN_HEIGHT - getSnapPointValue(point);
      translateY.value = withSpring(pointY, {
        damping: spring.gentle.damping,
        stiffness: spring.gentle.stiffness,
      });
    },
    [haptics, getSnapPointValue, translateY]
  );

  // Gesture handler
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startY: number }
  >({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
      isScrolling.value = false;
    },
    onActive: (event, ctx) => {
      const newY = ctx.startY + event.translationY;
      
      // Apply elastic effect at boundaries
      if (enableElastic) {
        if (newY < 0) {
          translateY.value = newY * 0.3;
        } else if (newY > SCREEN_HEIGHT - defaultSnapPoints.collapsed) {
          translateY.value =
            SCREEN_HEIGHT -
            defaultSnapPoints.collapsed +
            (newY - (SCREEN_HEIGHT - defaultSnapPoints.collapsed)) * 0.5;
        } else {
          translateY.value = newY;
        }
      } else {
        translateY.value = Math.max(0, newY);
      }
    },
    onEnd: (event) => {
      const velocity = event.velocityY;
      const currentY = translateY.value;

      // Determine snap point based on position and velocity
      let snapTo: SnapPoint = 'collapsed';

      if (velocity > 500) {
        // Fast downward swipe - collapse
        snapTo = 'collapsed';
      } else if (velocity < -500) {
        // Fast upward swipe - expand
        snapTo = 'expanded';
      } else {
        // Find closest snap point
        const snapPoints: SnapPoint[] = ['collapsed', 'medium', 'expanded', 'fullscreen'];
        let closestPoint: SnapPoint = 'collapsed';
        let closestDistance = Infinity;

        snapPoints.forEach((point) => {
          const pointY = SCREEN_HEIGHT - getSnapPointValue(point);
          const distance = Math.abs(currentY - pointY);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestPoint = point;
          }
        });

        snapTo = closestPoint;
      }

      runOnJS(handleSnap)(snapTo);
    },
  });

  // Animated styles
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [SCREEN_HEIGHT, SCREEN_HEIGHT - defaultSnapPoints.collapsed],
      [0, 1],
      Extrapolation.CLAMP
    ),
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Scroll handler for nested scroll
  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [scrollY]
  );

  const handleScrollBeginDrag = useCallback(() => {
    isScrolling.value = true;
  }, [isScrolling]);

  const handleScrollEndDrag = useCallback(() => {
    isScrolling.value = false;
  }, [isScrolling]);

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <View
          style={StyleSheet.absoluteFill}
          onTouchEnd={handleClose}
        />
      </Animated.View>

      {/* Sheet */}
      <PanGestureHandler onGestureEvent={gestureHandler} enabled={enableDrag}>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.surface.primary,
              borderTopLeftRadius: theme.radius.component.bottomSheet,
              borderTopRightRadius: theme.radius.component.bottomSheet,
            },
            sheetStyle,
            style,
          ]}
        >
          {/* Handle */}
          {showHandle && (
            <View style={styles.handleContainer}>
              <View
                style={[
                  styles.handle,
                  { backgroundColor: theme.colors.surface.tertiary },
                ]}
              />
            </View>
          )}

          {/* Header */}
          {title && (
            <View style={styles.header}>
              <Text
                style={[
                  styles.title,
                  { color: theme.colors.text.primary },
                ]}
              >
                {title}
              </Text>
            </View>
          )}

          {/* Content */}
          {enableScroll ? (
            <ScrollView
              ref={scrollRef}
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              onScroll={handleScroll}
              onScrollBeginDrag={handleScrollBeginDrag}
              onScrollEndDrag={handleScrollEndDrag}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.content}>{children}</View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

// ============================================
// SNAP INDICATORS
// ============================================

interface SnapIndicatorProps {
  snapPoint: SnapPoint;
  isActive: boolean;
}

export const SnapIndicator: React.FC<SnapIndicatorProps> = ({
  snapPoint,
  isActive,
}) => {
  const theme = useTheme();

  const labels: Record<SnapPoint, string> = {
    collapsed: 'Preview',
    medium: 'Half',
    expanded: 'Most',
    fullscreen: 'Full',
  };

  return (
    <View
      style={[
        styles.indicator,
        {
          backgroundColor: isActive
            ? theme.colors.interactive.primary
            : theme.colors.surface.tertiary,
        },
      ]}
    >
      <Text
        style={[
          styles.indicatorText,
          {
            color: isActive ? '#FFFFFF' : theme.colors.text.secondary,
          },
        ]}
      >
        {labels[snapPoint]}
      </Text>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    height: SCREEN_HEIGHT,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 2.5,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  indicator: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 4,
  },
  indicatorText: {
    fontSize: 10,
    fontWeight: '500',
  },
});

BottomSheet.displayName = 'BottomSheet';
