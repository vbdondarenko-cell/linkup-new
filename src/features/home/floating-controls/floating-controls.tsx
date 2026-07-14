/**
 * LinkUp Design System 2026
 * Floating Controls - Map floating buttons
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';

interface FloatingControlButtonProps {
  icon: string;
  label?: string;
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingControlButton: React.FC<FloatingControlButtonProps> = ({
  icon,
  label,
  onPress,
  isActive = false,
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!disabled) {
      haptics.light();
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[
        styles.button,
        {
          backgroundColor: isActive
            ? theme.colors.interactive.primary
            : theme.colors.surface.primary,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
      accessibilityLabel={label || icon}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.icon,
          {
            color: isActive ? '#FFFFFF' : theme.colors.text.primary,
          },
        ]}
      >
        {icon}
      </Text>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: isActive ? '#FFFFFF' : theme.colors.text.secondary,
            },
          ]}
        >
          {label}
        </Text>
      )}
    </AnimatedPressable>
  );
};

// Current Location Button
interface CurrentLocationButtonProps {
  onPress: () => void;
  isFollowing?: boolean;
  style?: ViewStyle;
}

export const CurrentLocationButton: React.FC<CurrentLocationButtonProps> = ({
  onPress,
  isFollowing = false,
  style,
}) => {
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.medium();
    onPress();
  };

  return (
    <FloatingControlButton
      icon={isFollowing ? '🎯' : '📍'}
      label={isFollowing ? 'Following' : 'Locate'}
      onPress={handlePress}
      isActive={isFollowing}
      style={style}
    />
  );
};

// Compass Button
interface CompassButtonProps {
  onPress: () => void;
  rotation?: number;
  style?: ViewStyle;
}

export const CompassButton: React.FC<CompassButtonProps> = ({
  onPress,
  rotation = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  const isNorth = Math.abs(rotation) < 15 || Math.abs(rotation - 360) < 15;

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.compassButton,
        {
          backgroundColor: theme.colors.surface.primary,
          transform: [{ rotate: `${-rotation}deg` }],
        },
        style,
      ]}
    >
      <Text style={styles.compassIcon}>🧭</Text>
      {isNorth && (
        <View
          style={[
            styles.northIndicator,
            { backgroundColor: theme.colors.status.danger.DEFAULT },
          ]}
        />
      )}
    </Pressable>
  );
};

// Zoom Controls
interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export const ZoomControls: React.FC<ZoomControlsProps> = ({
  onZoomIn,
  onZoomOut,
  disabled = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.zoomControls,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.button,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onZoomIn}
        disabled={disabled}
        style={[
          styles.zoomButton,
          { opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <Text style={[styles.zoomIcon, { color: theme.colors.text.primary }]}>
          +
        </Text>
      </Pressable>
      <View
        style={[
          styles.zoomDivider,
          { backgroundColor: theme.colors.border.default },
        ]}
      />
      <Pressable
        onPress={onZoomOut}
        disabled={disabled}
        style={[
          styles.zoomButton,
          { opacity: disabled ? 0.5 : 1 },
        ]}
      >
        <Text style={[styles.zoomIcon, { color: theme.colors.text.primary }]}>
          −
        </Text>
      </Pressable>
    </View>
  );
};

// Layer Toggle
interface LayerButtonProps {
  onPress: () => void;
  currentLayer?: 'standard' | 'satellite' | 'terrain';
  style?: ViewStyle;
}

export const LayerButton: React.FC<LayerButtonProps> = ({
  onPress,
  currentLayer = 'standard',
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    haptics.selection();
    onPress();
  };

  const icons = {
    standard: '🗺️',
    satellite: '🛰️',
    terrain: '🏔️',
  };

  return (
    <FloatingControlButton
      icon={icons[currentLayer]}
      label="Layers"
      onPress={handlePress}
      style={style}
    />
  );
};

// Full Floating Controls Container
interface FloatingControlsProps {
  onCurrentLocation: () => void;
  onCompass: () => void;
  onFilters: () => void;
  onCreateEvent?: () => void;
  isFollowing?: boolean;
  compassRotation?: number;
  style?: ViewStyle;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onCurrentLocation,
  onCompass,
  onFilters,
  onCreateEvent,
  isFollowing = false,
  compassRotation = 0,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Main Controls */}
      <View style={styles.mainControls}>
        <CurrentLocationButton
          onPress={onCurrentLocation}
          isFollowing={isFollowing}
        />
        <CompassButton onPress={onCompass} rotation={compassRotation} />
      </View>

      {/* Secondary Controls */}
      <View style={styles.secondaryControls}>
        <FloatingControlButton
          icon="🎛️"
          label="Filters"
          onPress={onFilters}
        />
        {onCreateEvent && (
          <FloatingControlButton
            icon="➕"
            label="Create"
            onPress={onCreateEvent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    fontSize: 8,
    marginTop: 2,
    fontWeight: '500',
  },
  compassButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  compassIcon: {
    fontSize: 20,
  },
  northIndicator: {
    position: 'absolute',
    top: 6,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  zoomControls: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  zoomButton: {
    width: 48,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomIcon: {
    fontSize: 24,
    fontWeight: '300',
  },
  zoomDivider: {
    height: 1,
    width: 32,
    alignSelf: 'center',
  },
  container: {
    position: 'absolute',
    right: spacing[4],
    gap: spacing[3],
  },
  mainControls: {
    gap: spacing[3],
    alignItems: 'center',
  },
  secondaryControls: {
    gap: spacing[3],
    alignItems: 'center',
    marginTop: spacing[4],
  },
});

FloatingControlButton.displayName = 'FloatingControlButton';
CurrentLocationButton.displayName = 'CurrentLocationButton';
CompassButton.displayName = 'CompassButton';
ZoomControls.displayName = 'ZoomControls';
LayerButton.displayName = 'LayerButton';
FloatingControls.displayName = 'FloatingControls';
