/**
 * LinkUp Design System 2026
 * Business Dashboard - Review Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, TextInput } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Button } from '../../../ui/components/buttons';
import { BusinessReview } from '../types';

interface ReviewCardProps {
  review: BusinessReview;
  onRespond?: (response: string) => void;
  onHelpful?: () => void;
  delay?: number;
  style?: ViewStyle;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onRespond,
  onHelpful,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [showResponseInput, setShowResponseInput] = React.useState(false);
  const [responseText, setResponseText] = React.useState('');

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRatingStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const handleSubmitResponse = () => {
    if (responseText.trim()) {
      haptics.medium();
      onRespond?.(responseText);
      setShowResponseInput(false);
      setResponseText('');
    }
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
        style,
      ]}
    >
      {/* User Info */}
      <View style={styles.userInfo}>
        <Avatar
          src={review.userAvatar}
          name={review.userName}
          size="md"
        />
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
            {review.userName}
          </Text>
          <Text style={[styles.eventLabel, { color: theme.colors.text.tertiary }]}>
            {review.eventTitle}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>{getRatingStars(review.rating)}</Text>
          <Text style={[styles.dateText, { color: theme.colors.text.tertiary }]}>
            {formatDate(review.createdAt)}
          </Text>
        </View>
      </View>

      {/* Review Text */}
      {review.comment && (
        <View style={[styles.commentContainer, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={[styles.commentText, { color: theme.colors.text.secondary }]}>
            "{review.comment}"
          </Text>
        </View>
      )}

      {/* Business Response */}
      {review.businessResponse && (
        <View style={[styles.responseContainer, { backgroundColor: '#10B98110' }]}>
          <View style={styles.responseHeader}>
            <Text style={styles.responseIcon}>💬</Text>
            <Text style={[styles.responseLabel, { color: '#10B981' }]}>Your Response</Text>
          </View>
          <Text style={[styles.responseText, { color: theme.colors.text.primary }]}>
            {review.businessResponse}
          </Text>
        </View>
      )}

      {/* Response Input */}
      {showResponseInput && (
        <View style={styles.responseInputContainer}>
          <TextInput
            style={[
              styles.responseInput,
              { 
                backgroundColor: theme.colors.surface.secondary,
                color: theme.colors.text.primary,
                borderColor: theme.colors.border.default,
              },
            ]}
            placeholder="Write a response..."
            placeholderTextColor={theme.colors.text.tertiary}
            value={responseText}
            onChangeText={setResponseText}
            multiline
            numberOfLines={3}
          />
          <View style={styles.responseActions}>
            <Button
              variant="secondary"
              size="sm"
              onPress={() => setShowResponseInput(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onPress={handleSubmitResponse}
            >
              Respond
            </Button>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {review.businessResponse ? (
          <Pressable 
            onPress={() => setShowResponseInput(true)}
            style={[styles.actionButton, { backgroundColor: theme.colors.surface.secondary }]}
          >
            <Text style={[styles.actionText, { color: theme.colors.text.secondary }]}>Edit Response</Text>
          </Pressable>
        ) : (
          <Pressable 
            onPress={() => { haptics.light(); setShowResponseInput(true); }}
            style={[styles.actionButton, { backgroundColor: '#10B98120' }]}
          >
            <Text style={[styles.actionText, { color: '#10B981' }]}>Respond</Text>
          </Pressable>
        )}

        <Pressable 
          onPress={() => { haptics.light(); onHelpful?.(); }}
          style={[styles.actionButton, { backgroundColor: theme.colors.surface.secondary }]}
        >
          <Text style={styles.helpfulIcon}>👍</Text>
          <Text style={[styles.actionText, { color: theme.colors.text.secondary }]}>
            Helpful ({review.helpful})
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  userDetails: {
    flex: 1,
    marginLeft: spacing[3],
  },
  userName: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  eventLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  ratingStars: {
    fontSize: 14,
  },
  dateText: {
    fontSize: 11,
    marginTop: 2,
  },
  commentContainer: {
    padding: spacing[3],
    borderRadius: 10,
    marginBottom: spacing[3],
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  responseContainer: {
    padding: spacing[3],
    borderRadius: 10,
    marginBottom: spacing[3],
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  responseIcon: {
    fontSize: 14,
    marginRight: spacing[1],
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  responseText: {
    fontSize: 14,
    lineHeight: 20,
  },
  responseInputContainer: {
    marginBottom: spacing[3],
  },
  responseInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: spacing[3],
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  responseActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    marginTop: spacing[2],
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  helpfulIcon: {
    fontSize: 14,
  },
});

ReviewCard.displayName = 'ReviewCard';
