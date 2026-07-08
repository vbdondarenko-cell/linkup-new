/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Request Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Avatar } from '../../../ui/components/avatars';
import { Button } from '../../../ui/components/buttons';
import { JoinRequest } from '../types';

interface RequestCardProps {
  request: JoinRequest;
  onAccept?: () => void;
  onDecline?: () => void;
  onViewProfile?: () => void;
  delay?: number;
  style?: ViewStyle;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  onAccept,
  onDecline,
  onViewProfile,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const getStatusColor = () => {
    switch (request.status) {
      case 'pending': return '#F59E0B';
      case 'accepted': return '#10B981';
      case 'declined': return '#EF4444';
      case 'expired': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const getTrustLevel = () => {
    if (request.trustScore >= 80) return 'High';
    if (request.trustScore >= 60) return 'Medium';
    return 'Low';
  };

  const getTrustColor = () => {
    if (request.trustScore >= 80) return '#10B981';
    if (request.trustScore >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <Animated.View
      entering={FadeInRight.delay(delay).springify()}
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.lg,
        },
        style,
      ]}
    >
      {/* User Info */}
      <Pressable onPress={onViewProfile} style={styles.userInfo}>
        <Avatar
          src={request.avatarUrl}
          name={request.displayName}
          size="md"
        />
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
            {request.displayName}
          </Text>
          <View style={styles.userMeta}>
            <View style={[styles.trustBadge, { backgroundColor: `${getTrustColor()}15` }]}>
              <Text style={[styles.trustText, { color: getTrustColor() }]}>
                Trust: {getTrustLevel()}
              </Text>
            </View>
            <Text style={[styles.timeText, { color: theme.colors.text.tertiary }]}>
              {formatTime(request.requestedAt)}
            </Text>
          </View>
        </View>
      </Pressable>

      {/* Event Info */}
      <View style={styles.eventInfo}>
        <Text style={[styles.eventLabel, { color: theme.colors.text.tertiary }]}>
          Requesting to join
        </Text>
        <Text 
          style={[styles.eventTitle, { color: theme.colors.text.primary }]}
          numberOfLines={1}
        >
          {request.eventTitle}
        </Text>
      </View>

      {/* Message */}
      {request.message && (
        <View style={[styles.messageContainer, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={[styles.messageText, { color: theme.colors.text.secondary }]}>
            "{request.message}"
          </Text>
        </View>
      )}

      {/* Actions */}
      {request.status === 'pending' && (
        <View style={styles.actions}>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => { haptics.light(); onDecline?.(); }}
            style={styles.declineButton}
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            onPress={() => { haptics.light(); onAccept?.(); }}
            style={styles.acceptButton}
          >
            Accept
          </Button>
        </View>
      )}

      {request.status !== 'pending' && (
        <View style={[styles.statusBanner, { backgroundColor: `${getStatusColor()}15` }]}>
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  userDetails: {
    flex: 1,
    marginLeft: spacing[3],
  },
  userName: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[1],
    gap: spacing[2],
  },
  trustBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 4,
  },
  trustText: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
  },
  timeText: {
    fontSize: 11,
  },
  eventInfo: {
    marginBottom: spacing[3],
  },
  eventLabel: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: fontWeight.medium,
  },
  messageContainer: {
    padding: spacing[3],
    borderRadius: 8,
    marginBottom: spacing[3],
  },
  messageText: {
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  declineButton: {
    flex: 1,
  },
  acceptButton: {
    flex: 1,
  },
  statusBanner: {
    padding: spacing[2],
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
  },
});

RequestCard.displayName = 'RequestCard';
