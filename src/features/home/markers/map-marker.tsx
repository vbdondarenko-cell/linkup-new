/**
 * LinkUp Design System 2026
 * Map Marker - Premium marker design for events
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';

export type MapMarkerType = 'user' | 'organizer' | 'business';

interface MapMarkerProps {
  type: MapMarkerType;
  isSelected?: boolean;
  isPremium?: boolean;
  isVisited?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const MapMarker: React.FC<MapMarkerProps> = ({
  type,
  isSelected = false,
  isPremium = false,
  isVisited = false,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);
  const selectedScale = useSharedValue(isSelected ? 1 : 0);
  const visitedOpacity = useSharedValue(isVisited ? 0.6 : 1);

  useEffect(() => {
    selectedScale.value = withSpring(isSelected ? 1 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [isSelected, selectedScale]);

  useEffect(() => {
    visitedOpacity.value = withTiming(isVisited ? 0.6 : 1, { duration: 200 });
  }, [isVisited, visitedOpacity]);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  }, [scale]);

  const handlePress = useCallback(() => {
    haptics.light();
    onPress?.();
  }, [haptics, onPress]);

  // Marker colors based on type
  const getMarkerColors = () => {
    switch (type) {
      case 'organizer':
        return {
          bg: '#A855F7', // Purple
          icon: '🎯',
          shadow: 'rgba(168, 85, 247, 0.4)',
        };
      case 'business':
        return {
          bg: '#3B82F6', // Blue
          icon: '🏢',
          shadow: 'rgba(59, 130, 246, 0.4)',
        };
      case 'user':
      default:
        return {
          bg: theme.colors.interactive.primary,
          icon: '📅',
          shadow: `${theme.colors.interactive.primary}66`,
        };
    }
  };

  const colors = getMarkerColors();

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: visitedOpacity.value,
  }));

  const selectedAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selectedScale.value ? 1.2 : 1, { damping: 12 }) }],
    opacity: selectedScale.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(selectedScale.value ? 1.5 : 0, { damping: 10 }) }],
    opacity: selectedScale.value * 0.3,
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, containerAnimatedStyle, style]}
      accessibilityLabel={`${type} event marker`}
      accessibilityRole="button"
    >
      {/* Selection pulse */}
      <Animated.View
        style={[
          styles.pulse,
          { backgroundColor: colors.bg },
          pulseAnimatedStyle,
        ]}
      />

      {/* Selection ring */}
      <Animated.View
        style={[
          styles.selectedRing,
          { borderColor: colors.bg },
          selectedAnimatedStyle,
        ]}
      />

      {/* Marker body */}
      <View
        style={[
          styles.marker,
          {
            backgroundColor: colors.bg,
            shadowColor: colors.shadow,
          },
          isSelected && styles.markerSelected,
        ]}
      >
        {/* Icon */}
        <Text style={styles.icon}>{colors.icon}</Text>

        {/* Premium accent */}
        {isPremium && (
          <View style={styles.premiumAccent}>
            <Text style={styles.premiumIcon}>⭐</Text>
          </View>
        )}

        {/* Pointer */}
        <View style={[styles.pointer, { borderTopColor: colors.bg }]} />
      </View>
    </AnimatedPressable>
  );
};

// Cluster Marker for grouped markers
interface ClusterMarkerProps {
  count: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
  count,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Size based on count
  const getSize = () => {
    if (count >= 100) return 56;
    if (count >= 50) return 48;
    if (count >= 20) return 40;
    return 32;
  };

  const size = getSize();

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle, style]}
    >
      <View
        style={[
          styles.cluster,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: theme.colors.interactive.primary,
          },
        ]}
      >
        <Text style={styles.clusterCount}>{count}+</Text>
      </View>
    </AnimatedPressable>
  );
};

// Marker animations
export const useMarkerAnimation = (isSelected: boolean) => {
  const scale = useSharedValue(1);
  const bounce = useSharedValue(0);

  useEffect(() => {
    if (isSelected) {
      // Bounce animation on selection
      bounce.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    }
  }, [isSelected, bounce]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * bounce.value }],
  }));

  return { animatedStyle };
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  selectedRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
  },
  marker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  markerSelected: {
    transform: [{ scale: 1.1 }],
  },
  icon: {
    fontSize: 20,
  },
  premiumAccent: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 10,
  },
  pointer: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  cluster: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  clusterCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

MapMarker.displayName = 'MapMarker';
ClusterMarker.displayName = 'ClusterMarker';
