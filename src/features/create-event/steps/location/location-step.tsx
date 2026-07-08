/**
 * LinkUp Design System 2026
 * Location Step - Choose event location
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/typography';
import { SearchInput } from '../../../../ui/components/inputs';
import type { CreateEventData } from '../../flow/create-event-flow';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface LocationStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

interface LocationOption {
  id: string;
  type: 'current' | 'map' | 'saved' | 'recent' | 'search';
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [searchQuery, setSearchQuery] = useState('');
  const selectedLocationId = data.location?.name;

  const handleSelectLocation = useCallback(
    (location: NonNullable<CreateEventData['location']>) => {
      haptics.selection();
      onUpdate({ location });
      onComplete({ location });
    },
    [haptics, onUpdate, onComplete]
  );

  // Sample saved locations
  const savedLocations = [
    { id: '1', name: 'Home', address: '123 Main Street', lat: 40.7128, lng: -74.006 },
    { id: '2', name: 'Office', address: '456 Business Ave', lat: 40.7148, lng: -74.008 },
  ];

  // Sample recent locations
  const recentLocations = [
    { id: '3', name: 'Central Park', address: 'Central Park, NY', lat: 40.7829, lng: -73.9654 },
    { id: '4', name: 'Times Square', address: 'Times Square, NY', lat: 40.758, lng: -73.9855 },
  ];

  const locationOptions: LocationOption[] = [
    {
      id: 'current',
      type: 'current',
      title: 'Use Current Location',
      subtitle: 'Your GPS location',
      icon: '📍',
      onPress: () => handleSelectLocation({
        latitude: 40.7128,
        longitude: -74.006,
        name: 'Current Location',
        address: 'New York, NY',
      }),
    },
    {
      id: 'map',
      type: 'map',
      title: 'Choose on Map',
      subtitle: 'Pin a location',
      icon: '🗺️',
      onPress: () => {
        // Open map picker
        handleSelectLocation({
          latitude: 40.7128,
          longitude: -74.006,
          name: 'Selected Location',
          address: 'Tap to edit address',
        });
      },
    },
  ];

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        Where is your event? 📍
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Choose a location for your event
      </Text>

      {/* Search */}
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search for a venue or address..."
        style={styles.search}
      />

      {/* Quick Options */}
      <View style={styles.section}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Quick Options
        </Text>
        {locationOptions.map((option, index) => (
          <Animated.View
            key={option.id}
            entering={FadeIn.delay(index * 50)}
          >
            <LocationOptionCard
              option={option}
              isSelected={data.location?.name === option.title}
            />
          </Animated.View>
        ))}
      </View>

      {/* Saved Locations */}
      {savedLocations.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Saved Places
          </Text>
          {savedLocations.map((location, index) => (
            <Animated.View
              key={location.id}
              entering={FadeIn.delay(index * 50)}
            >
              <LocationOptionCard
                option={{
                  id: location.id,
                  type: 'saved',
                  title: location.name,
                  subtitle: location.address,
                  icon: '🏠',
                  onPress: () => handleSelectLocation({
                    latitude: location.lat,
                    longitude: location.lng,
                    name: location.name,
                    address: location.address,
                  }),
                }}
                isSelected={data.location?.name === location.name}
              />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Recent Locations */}
      {recentLocations.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Recent
          </Text>
          {recentLocations.map((location, index) => (
            <Animated.View
              key={location.id}
              entering={FadeIn.delay(index * 50)}
            >
              <LocationOptionCard
                option={{
                  id: location.id,
                  type: 'recent',
                  title: location.name,
                  subtitle: location.address,
                  icon: '🕐',
                  onPress: () => handleSelectLocation({
                    latitude: location.lat,
                    longitude: location.lng,
                    name: location.name,
                    address: location.address,
                  }),
                }}
                isSelected={data.location?.name === location.name}
              />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Selected Location Preview */}
      {data.location && (
        <Animated.View
          entering={FadeIn}
          style={[
            styles.selectedPreview,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.interactive.primary,
            },
          ]}
        >
          <Text style={styles.selectedIcon}>✓</Text>
          <View style={styles.selectedInfo}>
            <Text
              style={[
                styles.selectedTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {data.location.name}
            </Text>
            <Text
              style={[
                styles.selectedSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              {data.location.address}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

// Location Option Card
interface LocationOptionCardProps {
  option: LocationOption;
  isSelected: boolean;
}

const LocationOptionCard: React.FC<LocationOptionCardProps> = ({
  option,
  isSelected,
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={option.onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.optionCard,
        {
          backgroundColor: isSelected
            ? theme.colors.interactive.primary + '10'
            : theme.colors.surface.primary,
          borderColor: isSelected
            ? theme.colors.interactive.primary
            : theme.colors.border.default,
        },
        animatedStyle,
      ]}
    >
      <Text style={styles.optionIcon}>{option.icon}</Text>
      <View style={styles.optionContent}>
        <Text
          style={[
            styles.optionTitle,
            {
              color: isSelected
                ? theme.colors.interactive.primary
                : theme.colors.text.primary,
            },
          ]}
        >
          {option.title}
        </Text>
        {option.subtitle && (
          <Text
            style={[
              styles.optionSubtitle,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {option.subtitle}
          </Text>
        )}
      </View>
      {isSelected && (
        <View
          style={[
            styles.selectedIndicator,
            { backgroundColor: theme.colors.interactive.primary },
          ]}
        >
          <Text style={styles.selectedIndicatorText}>✓</Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontSize: 15,
    marginBottom: spacing[4],
  },
  search: {
    marginBottom: spacing[6],
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: spacing[2],
  },
  optionIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  optionSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicatorText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 2,
    marginTop: spacing[4],
  },
  selectedIcon: {
    fontSize: 20,
    color: theme.colors.interactive.primary,
    marginRight: spacing[3],
  },
  selectedInfo: {
    flex: 1,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  selectedSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

LocationStep.displayName = 'LocationStep';
