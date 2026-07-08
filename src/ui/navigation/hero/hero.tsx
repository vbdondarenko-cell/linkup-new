/**
 * LinkUp Design System 2026
 * Hero Animations - Seamless transitions between screens
 * Makes the app feel connected and fluid
 */

'use client';

import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { ViewStyle, LayoutRectangle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { spring } from '../../tokens/animation';

// ============================================
// TYPES
// ============================================

export type HeroType = 'card' | 'avatar' | 'button' | 'image' | 'icon';

export interface HeroConfig {
  id: string;
  type: HeroType;
  sourceRect?: LayoutRectangle;
  targetRect?: LayoutRectangle;
}

export interface HeroContextValue {
  registerHero: (config: HeroConfig) => void;
  unregisterHero: (id: string) => void;
  updateHeroRect: (id: string, rect: LayoutRectangle, isSource: boolean) => void;
  startTransition: (sourceId: string, targetId: string) => void;
  heroes: Map<string, HeroConfig>;
  isTransitioning: boolean;
  getHeroRect: (id: string, isSource: boolean) => LayoutRectangle | undefined;
}

// ============================================
// CONTEXT
// ============================================

const HeroContext = createContext<HeroContextValue | null>(null);

// ============================================
// PROVIDER
// ============================================

interface HeroProviderProps {
  children: ReactNode;
}

export const HeroProvider: React.FC<HeroProviderProps> = ({ children }) => {
  const [heroes, setHeroes] = useState<Map<string, HeroConfig>>(new Map());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionPair, setTransitionPair] = useState<{
    source: string;
    target: string;
  } | null>(null);

  const registerHero = useCallback((config: HeroConfig) => {
    setHeroes((prev) => {
      const next = new Map(prev);
      next.set(config.id, config);
      return next;
    });
  }, []);

  const unregisterHero = useCallback((id: string) => {
    setHeroes((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const updateHeroRect = useCallback(
    (id: string, rect: LayoutRectangle, isSource: boolean) => {
      setHeroes((prev) => {
        const hero = prev.get(id);
        if (!hero) return prev;

        const next = new Map(prev);
        next.set(id, {
          ...hero,
          [isSource ? 'sourceRect' : 'targetRect']: rect,
        });
        return next;
      });
    },
    []
  );

  const getHeroRect = useCallback(
    (id: string, isSource: boolean): LayoutRectangle | undefined => {
      const hero = heroes.get(id);
      return isSource ? hero?.sourceRect : hero?.targetRect;
    },
    [heroes]
  );

  const startTransition = useCallback((sourceId: string, targetId: string) => {
    setTransitionPair({ source: sourceId, target: targetId });
    setIsTransitioning(true);
  }, []);

  const endTransition = useCallback(() => {
    setTransitionPair(null);
    setIsTransitioning(false);
  }, []);

  const value = useMemo<HeroContextValue>(
    () => ({
      registerHero,
      unregisterHero,
      updateHeroRect,
      startTransition,
      heroes,
      isTransitioning,
      getHeroRect,
    }),
    [
      registerHero,
      unregisterHero,
      updateHeroRect,
      startTransition,
      heroes,
      isTransitioning,
      getHeroRect,
    ]
  );

  return (
    <HeroContext.Provider value={value}>{children}</HeroContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export function useHero() {
  const context = useContext(HeroContext);

  if (!context) {
    throw new Error('useHero must be used within HeroProvider');
  }

  return context;
}

// ============================================
// HERO VIEW COMPONENT
// ============================================

interface HeroViewProps {
  id: string;
  type: HeroType;
  children: ReactNode;
  style?: ViewStyle;
}

export const HeroView: React.FC<HeroViewProps> = ({
  id,
  type,
  children,
  style,
}) => {
  const context = useContext(HeroContext);
  
  if (!context) {
    return <>{children}</>;
  }

  const { registerHero, unregisterHero, updateHeroRect, isTransitioning, getHeroRect } = context;

  const handleLayout = useCallback(
    (event: any) => {
      const { x, y, width, height } = event.nativeEvent.layout;
      updateHeroRect(id, { x, y, width, height }, true);
    },
    [id, updateHeroRect]
  );

  React.useEffect(() => {
    registerHero({ id, type });
    return () => unregisterHero(id);
  }, [id, type, registerHero, unregisterHero]);

  const animatedStyle = useAnimatedStyle(() => {
    // This would be enhanced to use actual shared element transition
    // For now, it provides a subtle scale effect during transitions
    return {
      transform: [{ scale: withTiming(isTransitioning ? 0.98 : 1, { duration: 200 }) }],
    };
  });

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[style, animatedStyle]}
    >
      {children}
    </Animated.View>
  );
};

// ============================================
// HERO IMAGE (with shared element transition)
// ============================================

interface HeroImageProps {
  id: string;
  source: string;
  style?: ViewStyle;
}

export const HeroImage: React.FC<HeroImageProps> = ({ id, source, style }) => {
  const context = useContext(HeroContext);
  
  if (!context) {
    return <Animated.Image source={{ uri: source }} style={style} />;
  }

  const { registerHero, unregisterHero, isTransitioning } = context;

  React.useEffect(() => {
    registerHero({ id, type: 'image' });
    return () => unregisterHero(id);
  }, [id, registerHero, unregisterHero]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isTransitioning ? 1.05 : 1, {
            damping: spring.default.damping,
            stiffness: spring.default.stiffness,
          }),
        },
      ],
    };
  });

  return (
    <Animated.Image
      source={{ uri: source }}
      style={[style, animatedStyle]}
    />
  );
};

// ============================================
// HERO TRANSITION UTILITIES
// ============================================

/**
 * Calculate interpolation values for hero transition
 */
export function calculateHeroTransition(
  sourceRect: LayoutRectangle,
  targetRect: LayoutRectangle
) {
  const scaleX = targetRect.width / sourceRect.width;
  const scaleY = targetRect.height / sourceRect.height;
  const translateX = targetRect.x - sourceRect.x;
  const translateY = targetRect.y - sourceRect.y;

  return {
    initialTransform: [
      { scaleX: 1 },
      { scaleY: 1 },
      { translateX: 0 },
      { translateY: 0 },
    ],
    finalTransform: [
      { scaleX },
      { scaleY },
      { translateX },
      { translateY },
    ],
    initialOriginX: sourceRect.x,
    initialOriginY: sourceRect.y,
    finalOriginX: targetRect.x,
    finalOriginY: targetRect.y,
  };
}

/**
 * Create spring config for hero animation
 */
export function createHeroSpringConfig(intensity: 'gentle' | 'default' | 'bouncy' = 'default') {
  const configs = {
    gentle: { damping: 25, stiffness: 150 },
    default: { damping: 20, stiffness: 200 },
    bouncy: { damping: 15, stiffness: 250 },
  };

  return configs[intensity];
}

// ============================================
// PRE-BUILT HERO PATTERNS
// ============================================

/**
 * Event Card → Event Details hero pattern
 */
export const eventCardToDetailsHero = {
  id: 'event-hero',
  measure: ['title', 'image', 'date'],
  animation: {
    duration: 400,
    easing: 'decelerate',
  },
};

/**
 * Avatar → Profile hero pattern
 */
export const avatarToProfileHero = {
  id: 'avatar-hero',
  measure: ['avatar'],
  animation: {
    duration: 350,
    easing: 'easeOutBack',
  },
};

/**
 * Business Card → Dashboard hero pattern
 */
export const businessToDashboardHero = {
  id: 'business-hero',
  measure: ['card', 'stats'],
  animation: {
    duration: 400,
    easing: 'decelerate',
  },
};

/**
 * Marker → Bottom Sheet hero pattern
 */
export const markerToSheetHero = {
  id: 'marker-hero',
  measure: ['marker', 'preview'],
  animation: {
    duration: 300,
    easing: 'easeOut',
  },
};
