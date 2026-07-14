/**
 * LinkUp Design System 2026
 * Home Map - Full screen interactive map
 */

'use client';

import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { MapMarker, MapMarkerType } from '../markers/map-marker';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface MapMarkerData {
  id: string;
  latitude: number;
  longitude: number;
  type: MapMarkerType;
  title: string;
  isPremium?: boolean;
  isSelected?: boolean;
  onPress?: () => void;
}

interface HomeMapProps {
  region: MapRegion;
  markers: MapMarkerData[];
  userLocation?: {
    latitude: number;
    longitude: number;
  };
  selectedMarkerId?: string | null;
  onMarkerPress?: (marker: MapMarkerData) => void;
  onRegionChange?: (region: MapRegion) => void;
  onMapPress?: () => void;
  showUserLocation?: boolean;
  style?: ViewStyle;
}

// Simulated Map View (placeholder for actual Mapbox/Google Maps integration)
export const HomeMap: React.FC<HomeMapProps> = ({
  region,
  markers,
  userLocation,
  selectedMarkerId,
  onMarkerPress,
  onRegionChange,
  onMapPress,
  showUserLocation = true,
  style,
}) => {
  const theme = useTheme();

  // Calculate marker positions based on region
  const getMarkerPosition = useCallback(
    (marker: MapMarkerData) => {
      const latRange = region.latitudeDelta;
      const lngRange = region.longitudeDelta;

      const x =
        ((marker.longitude - (region.longitude - lngRange / 2)) / lngRange) *
        SCREEN_WIDTH;
      const y =
        ((region.latitude + latRange / 2 - marker.latitude) / latRange) *
        SCREEN_HEIGHT;

      return { x, y };
    },
    [region]
  );

  // Filter markers within visible region
  const visibleMarkers = useMemo(() => {
    return markers.filter((marker) => {
      const { x, y } = getMarkerPosition(marker);
      return x >= -50 && x <= SCREEN_WIDTH + 50 && y >= -50 && y <= SCREEN_HEIGHT;
    });
  }, [markers, getMarkerPosition]);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            theme.mode === 'dark'
              ? theme.colors.map.dark
              : theme.colors.map.light,
        },
        style,
      ]}
    >
      {/* Map Background (placeholder for actual map tiles) */}
      <View style={styles.mapBackground}>
        {/* Grid pattern to simulate map */}
        <View style={styles.gridOverlay}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`h-${i}`}
              style={[
                styles.gridLineH,
                {
                  top: `${i * 5}%`,
                  backgroundColor:
                    theme.mode === 'dark'
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.03)',
                },
              ]}
            />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={`v-${i}`}
              style={[
                styles.gridLineV,
                {
                  left: `${i * 5}%`,
                  backgroundColor:
                    theme.mode === 'dark'
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(0,0,0,0.03)',
                },
              ]}
            />
          ))}
        </View>

        {/* Map placeholders for buildings/roads */}
        <View style={styles.mapContent}>
          {/* Simulated roads */}
          <View
            style={[
              styles.road,
              styles.roadHorizontal,
              {
                top: '30%',
                backgroundColor:
                  theme.mode === 'dark' ? '#1a1a2e' : '#e8e8e8',
              },
            ]}
          />
          <View
            style={[
              styles.road,
              styles.roadHorizontal,
              {
                top: '60%',
                backgroundColor:
                  theme.mode === 'dark' ? '#1a1a2e' : '#e8e8e8',
              },
            ]}
          />
          <View
            style={[
              styles.road,
              styles.roadVertical,
              {
                left: '25%',
                backgroundColor:
                  theme.mode === 'dark' ? '#1a1a2e' : '#e8e8e8',
              },
            ]}
          />
          <View
            style={[
              styles.road,
              styles.roadVertical,
              {
                left: '70%',
                backgroundColor:
                  theme.mode === 'dark' ? '#1a1a2e' : '#e8e8e8',
              },
            ]}
          />

          {/* Simulated blocks */}
          <View
            style={[
              styles.block,
              {
                top: '10%',
                left: '10%',
                width: 80,
                height: 60,
                backgroundColor:
                  theme.mode === 'dark' ? '#252542' : '#d4d4d4',
                borderRadius: 8,
              },
            ]}
          />
          <View
            style={[
              styles.block,
              {
                top: '35%',
                left: '35%',
                width: 100,
                height: 80,
                backgroundColor:
                  theme.mode === 'dark' ? '#252542' : '#d4d4d4',
                borderRadius: 8,
              },
            ]}
          />
          <View
            style={[
              styles.block,
              {
                top: '65%',
                left: '50%',
                width: 90,
                height: 70,
                backgroundColor:
                  theme.mode === 'dark' ? '#252542' : '#d4d4d4',
                borderRadius: 8,
              },
            ]}
          />
          <View
            style={[
              styles.block,
              {
                top: '15%',
                right: '15%',
                width: 70,
                height: 50,
                backgroundColor:
                  theme.mode === 'dark' ? '#252542' : '#d4d4d4',
                borderRadius: 8,
              },
            ]}
          />
          <View
            style={[
              styles.block,
              {
                bottom: '20%',
                left: '15%',
                width: 110,
                height: 90,
                backgroundColor:
                  theme.mode === 'dark' ? '#252542' : '#d4d4d4',
                borderRadius: 8,
              },
            ]}
          />
        </View>
      </View>

      {/* Markers Layer */}
      <View style={styles.markersLayer} pointerEvents="box-none">
        {visibleMarkers.map((marker) => {
          const position = getMarkerPosition(marker);
          return (
            <View
              key={marker.id}
              style={[
                styles.markerContainer,
                {
                  left: position.x - 24,
                  top: position.y - 48,
                },
              ]}
            >
              <MapMarker
                type={marker.type}
                isSelected={marker.id === selectedMarkerId}
                isPremium={marker.isPremium}
                onPress={() => onMarkerPress?.(marker)}
              />
            </View>
          );
        })}
      </View>

      {/* User Location Indicator */}
      {showUserLocation && userLocation && (
        <View
          style={[
            styles.userLocationContainer,
            {
              left:
                ((userLocation.longitude - (region.longitude - region.longitudeDelta / 2)) /
                  region.longitudeDelta) *
                  SCREEN_WIDTH -
                12,
              top:
                ((region.latitude + region.latitudeDelta / 2 - userLocation.latitude) /
                  region.latitudeDelta) *
                SCREEN_HEIGHT -
                12,
            },
          ]}
        >
          <View
            style={[
              styles.userLocationDot,
              {
                backgroundColor: theme.colors.interactive.primary,
              },
            ]}
          />
          <View
            style={[
              styles.userLocationPulse,
              {
                backgroundColor: theme.colors.interactive.primary,
              },
            ]}
          />
          <View
            style={[
              styles.userLocationAccuracy,
              {
                backgroundColor: theme.colors.interactive.primary,
                opacity: 0.15,
              },
            ]}
          />
        </View>
      )}

      {/* Map Attribution */}
      <View style={styles.attribution}>
        <Text
          style={[
            styles.attributionText,
            { color: theme.colors.text.tertiary },
          ]}
        >
          © LinkUp Map
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  mapContent: {
    ...StyleSheet.absoluteFillObject,
  },
  road: {
    position: 'absolute',
  },
  roadHorizontal: {
    left: 0,
    right: 0,
    height: 24,
  },
  roadVertical: {
    top: 0,
    bottom: 0,
    width: 24,
  },
  block: {
    position: 'absolute',
  },
  markersLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  userLocationContainer: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 3,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.4,
    zIndex: 2,
  },
  userLocationAccuracy: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    zIndex: 1,
  },
  attribution: {
    position: 'absolute',
    bottom: spacing[2],
    right: spacing[2],
    padding: spacing[1],
  },
  attributionText: {
    fontSize: 10,
  },
});

HomeMap.displayName = 'HomeMap';
