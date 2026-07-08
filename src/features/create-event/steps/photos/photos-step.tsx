/**
 * LinkUp Design System 2026
 * Photos Step - Add event photos
 */

'use client';

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  ScrollView,
  Dimensions,
} from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { useHaptics } from '../../../../ui/hooks/use-haptics';
import { spacing } from '../../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../../ui/tokens/spacing';
import type { CreateEventData } from '../../flow/create-event-flow';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = (SCREEN_WIDTH - spacing[4] * 2 - spacing[3] * 2) / 3;

interface PhotosStepProps {
  data: CreateEventData;
  onUpdate: (data: Partial<CreateEventData>) => void;
  onComplete: (data: Partial<CreateEventData>) => void;
  errors: Record<string, string>;
  style?: ViewStyle;
}

export const PhotosStep: React.FC<PhotosStepProps> = ({
  data,
  onUpdate,
  onComplete,
  errors,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const photos = data.photos ?? [];

  const handleAddPhoto = useCallback(
    (source: 'camera' | 'gallery') => {
      haptics.light();
      // In a real app, this would open camera or gallery
      // For now, we'll just add a placeholder
      const newPhoto = `photo_${Date.now()}`;
      const newPhotos = [...photos, newPhoto];
      onUpdate({ photos: newPhotos });
      onComplete({ photos: newPhotos });
    },
    [haptics, photos, onUpdate, onComplete]
  );

  const handleRemovePhoto = useCallback(
    (index: number) => {
      haptics.light();
      const newPhotos = photos.filter((_, i) => i !== index);
      onUpdate({ photos: newPhotos });
      onComplete({ photos: newPhotos });
    },
    [haptics, photos, onUpdate, onComplete]
  );

  const handleSetPrimary = useCallback(
    (index: number) => {
      haptics.selection();
      const newPhotos = [...photos];
      const [removed] = newPhotos.splice(index, 1);
      newPhotos.unshift(removed);
      onUpdate({ photos: newPhotos });
      onComplete({ photos: newPhotos });
    },
    [haptics, photos, onUpdate, onComplete]
  );

  return (
    <View style={[styles.container, style]}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        Add photos 📷
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.text.secondary },
        ]}
      >
        Add photos to make your event stand out (optional)
      </Text>

      {/* Add Buttons */}
      <View style={styles.addButtons}>
        <Pressable
          onPress={() => handleAddPhoto('camera')}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <Text style={styles.addButtonIcon}>📷</Text>
          <Text
            style={[
              styles.addButtonLabel,
              { color: theme.colors.text.primary },
            ]}
          >
            Camera
          </Text>
        </Pressable>
        <Pressable
          onPress={() => handleAddPhoto('gallery')}
          style={[
            styles.addButton,
            {
              backgroundColor: theme.colors.surface.primary,
              borderColor: theme.colors.border.default,
            },
          ]}
        >
          <Text style={styles.addButtonIcon}>🖼️</Text>
          <Text
            style={[
              styles.addButtonLabel,
              { color: theme.colors.text.primary },
            ]}
          >
            Gallery
          </Text>
        </Pressable>
      </View>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Photos ({photos.length}/10)
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoGrid}
          >
            {photos.map((photo, index) => (
              <Animated.View
                key={photo}
                entering={FadeIn}
                exiting={FadeOut}
                layout={Layout.springify()}
                style={[
                  styles.photoCard,
                  index === 0 && styles.primaryPhoto,
                ]}
              >
                <View
                  style={[
                    styles.photoPlaceholder,
                    { backgroundColor: theme.colors.surface.secondary },
                  ]}
                >
                  <Text style={styles.photoPlaceholderIcon}>📸</Text>
                </View>
                {index === 0 && (
                  <View
                    style={[
                      styles.primaryBadge,
                      { backgroundColor: theme.colors.interactive.primary },
                    ]}
                  >
                    <Text style={styles.primaryBadgeText}>Cover</Text>
                  </View>
                )}
                <View style={styles.photoActions}>
                  {index !== 0 && (
                    <Pressable
                      onPress={() => handleSetPrimary(index)}
                      style={[
                        styles.photoAction,
                        { backgroundColor: theme.colors.surface.primary },
                      ]}
                    >
                      <Text style={styles.photoActionIcon}>⭐</Text>
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => handleRemovePhoto(index)}
                    style={[
                      styles.photoAction,
                      { backgroundColor: theme.colors.status.danger.DEFAULT },
                    ]}
                  >
                    <Text style={styles.photoActionIcon}>×</Text>
                  </Pressable>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Tips */}
      <View
        style={[
          styles.tips,
          {
            backgroundColor: theme.colors.status.info.bg,
            borderColor: theme.colors.status.info.border,
          },
        ]}
      >
        <Text style={styles.tipsIcon}>💡</Text>
        <View style={styles.tipsContent}>
          <Text
            style={[
              styles.tipsTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Great photos attract more attendees
          </Text>
          <Text
            style={[
              styles.tipsText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Use clear, well-lit images that represent your event. The first photo will be your cover image.
          </Text>
        </View>
      </View>

      {/* Skip Option */}
      <Pressable
        onPress={() => onComplete({ photos: [] })}
        style={styles.skipButton}
      >
        <Text
          style={[
            styles.skipText,
            { color: theme.colors.text.tertiary },
          ]}
        >
          Skip this step →
        </Text>
      </Pressable>
    </View>
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
    marginBottom: spacing[6],
  },
  addButtons: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[6],
  },
  addButton: {
    flex: 1,
    paddingVertical: spacing[5],
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addButtonIcon: {
    fontSize: 32,
    marginBottom: spacing[2],
  },
  addButtonLabel: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
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
  photoGrid: {
    gap: spacing[3],
  },
  photoCard: {
    position: 'relative',
  },
  primaryPhoto: {
    borderWidth: 2,
    borderColor: '#6366F1',
    borderRadius: 12,
  },
  photoPlaceholder: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderIcon: {
    fontSize: 32,
    opacity: 0.5,
  },
  primaryBadge: {
    position: 'absolute',
    top: spacing[2],
    left: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  photoActions: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    flexDirection: 'row',
    gap: spacing[1],
  },
  photoAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoActionIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  tips: {
    flexDirection: 'row',
    padding: spacing[4],
    borderRadius: 12,
    borderWidth: 1,
  },
  tipsIcon: {
    fontSize: 24,
    marginRight: spacing[3],
  },
  tipsContent: {
    flex: 1,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[1],
  },
  tipsText: {
    fontSize: 13,
    lineHeight: 18,
  },
  skipButton: {
    marginTop: spacing[6],
    alignItems: 'center',
    padding: spacing[3],
  },
  skipText: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
});

PhotosStep.displayName = 'PhotosStep';
