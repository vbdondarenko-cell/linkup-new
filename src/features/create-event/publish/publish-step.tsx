/**
 * LinkUp Design System 2026
 * Publish Step - Publish event
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/spacing';
import { Button } from '../../../ui/components/buttons';
import type { CreateEventData } from '../flow/create-event-flow';

interface PublishStepProps {
  data: CreateEventData;
  onPublish: () => void;
  style?: ViewStyle;
}

export const PublishStep: React.FC<PublishStepProps> = ({
  data,
  onPublish,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [isPublishing, setIsPublishing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const scale = useSharedValue(1);
  const rocketY = useSharedValue(0);
  const rocketRotation = useSharedValue(0);

  const handlePublish = useCallback(async () => {
    haptics.medium();
    setIsPublishing(true);

    // Animate rocket
    rocketY.value = withSequence(
      withTiming(-20, { duration: 300 }),
      withSpring(0, { damping: 10, stiffness: 100 })
    );
    rocketRotation.value = withSequence(
      withTiming(-10, { duration: 150 }),
      withTiming(10, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsPublishing(false);
    setIsComplete(true);
    haptics.success();

    // Call onPublish after animation
    onPublish();
  }, [haptics, rocketY, rocketRotation, onPublish]);

  const rocketStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: rocketY.value },
      { rotate: `${rocketRotation.value}deg` },
    ],
  }));

  return (
    <View style={[styles.container, style]}>
      {!isComplete ? (
        <>
          {/* Title */}
          <Text
            style={[
              styles.title,
              { color: theme.colors.text.primary },
            ]}
          >
            Ready to publish? 🚀
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.text.secondary },
            ]}
          >
            Your event will be visible to everyone nearby
          </Text>

          {/* Summary */}
          <View
            style={[
              styles.summaryCard,
              {
                backgroundColor: theme.colors.surface.primary,
                borderColor: theme.colors.border.default,
              },
            ]}
          >
            <Text style={styles.summaryTitle}>Event Summary</Text>
            
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📍</Text>
              <Text
                style={[
                  styles.summaryText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {data.location?.name || 'Location not set'}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📅</Text>
              <Text
                style={[
                  styles.summaryText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {data.date?.start?.toLocaleDateString() || 'Date not set'}
                {data.time && ` at ${data.time.startTime}`}
              </Text>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>👥</Text>
              <Text
                style={[
                  styles.summaryText,
                  { color: theme.colors.text.primary },
                ]}
              >
                {data.participants
                  ? `${data.participants.min}-${data.participants.max} people`
                  : 'Participants not set'}
              </Text>
            </View>
          </View>

          {/* Terms */}
          <Text
            style={[
              styles.terms,
              { color: theme.colors.text.tertiary },
            ]}
          >
            By publishing, you agree to our Community Guidelines and Terms of Service.
          </Text>

          {/* Publish Button */}
          <Animated.View style={[styles.buttonContainer, rocketStyle]}>
            <Button
              variant="primary"
              size="xl"
              onPress={handlePublish}
              loading={isPublishing}
              style={styles.publishButton}
            >
              {isPublishing ? 'Publishing...' : '🚀 Publish Event'}
            </Button>
          </Animated.View>
        </>
      ) : (
        <>
          {/* Success State */}
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text
              style={[
                styles.successTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              Event Published!
            </Text>
            <Text
              style={[
                styles.successSubtitle,
                { color: theme.colors.text.secondary },
              ]}
            >
              Your event is now live. People nearby can discover and join it.
            </Text>

            <View style={styles.successActions}>
              <Button
                variant="primary"
                size="lg"
                onPress={onPublish}
                style={styles.successButton}
              >
                View on Map
              </Button>
              <Button
                variant="tertiary"
                size="lg"
                onPress={onPublish}
                style={styles.successButton}
              >
                Share Event
              </Button>
            </View>
          </View>
        </>
      )}
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
  summaryCard: {
    padding: spacing[4],
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing[4],
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    color: '#666',
    marginBottom: spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  summaryIcon: {
    fontSize: 18,
    marginRight: spacing[3],
    width: 24,
    textAlign: 'center',
  },
  summaryText: {
    fontSize: 15,
    flex: 1,
  },
  terms: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing[6],
  },
  buttonContainer: {
    alignItems: 'center',
  },
  publishButton: {
    minWidth: 200,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },
  successIcon: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  successTitle: {
    fontSize: 28,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  successSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing[8],
  },
  successActions: {
    width: '100%',
    gap: spacing[3],
  },
  successButton: {
    width: '100%',
  },
});

PublishStep.displayName = 'PublishStep';
