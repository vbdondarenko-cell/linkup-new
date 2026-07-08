/**
 * LinkUp Design System 2026
 * Event Details Screen - Complete event information display
 */

'use client';

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  ViewStyle,
  Dimensions,
  Linking,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

// Components
import { Avatar, AvatarGroup } from '../../../ui/components/avatars';
import { Badge } from '../../../ui/components/badges';
import { Button } from '../../../ui/components/buttons';
import { Chip } from '../../../ui/components/chips';
import { Divider } from '../../../ui/components/dividers';
import { ActionSheet } from '../../../ui/navigation/modals/modals';

// Event-specific components
import { EventCard } from '../event-card/event-card';
import { OrganizerCard, OrganizerRow } from '../organizer-card/organizer-card';
import { TrustBlock } from '../trust/trust-block';
import { JoinFlow, JoinState } from '../join-flow/join-flow';
import { LinearProgress } from '../../../ui/components/progress';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Types
interface Participant {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface EventDetailsData {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category?: string;
  date: string;
  time: string;
  duration?: string;
  location?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  distance?: string;
  organizer: {
    id: string;
    name: string;
    avatarUrl?: string;
    trustScore?: number;
    isVerified?: boolean;
    isOrganizer?: boolean;
    isBusiness?: boolean;
  };
  participants?: {
    current: number;
    max: number;
    list?: Participant[];
  };
  requirements?: string[];
  price?: string;
  language?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  accessibilityInfo?: string;
}

interface EventDetailsScreenProps {
  event: EventDetailsData;
  joinState?: JoinState;
  isFavorite?: boolean;
  onBack?: () => void;
  onJoin?: () => void;
  onCancel?: () => void;
  onFavorite?: () => void;
  onShare?: () => void;
  onReport?: () => void;
  onOrganizerPress?: () => void;
  onLocationPress?: () => void;
  onNavigatePress?: () => void;
  onChatPress?: () => void;
  style?: ViewStyle;
}

// Hero Image Section
const HeroImageSection: React.FC<{
  imageUrl?: string;
  isPremium?: boolean;
  category?: string;
  onBack?: () => void;
}> = ({ imageUrl, isPremium, category, onBack }) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handleBack = () => {
    haptics.light();
    onBack?.();
  };

  return (
    <View style={styles.heroContainer}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.heroPlaceholder,
            { backgroundColor: theme.colors.surface.secondary },
          ]}
        >
          <Text style={styles.heroPlaceholderIcon}>📅</Text>
        </View>
      )}

      {/* Gradient Overlay */}
      <View style={styles.heroGradient} />

      {/* Back Button */}
      <Pressable
        onPress={handleBack}
        style={[styles.backButton, { backgroundColor: theme.colors.surface.primary }]}
      >
        <Text style={styles.backIcon}>←</Text>
      </Pressable>

      {/* Badges */}
      <View style={styles.heroBadges}>
        {category && (
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: theme.colors.surface.primary },
            ]}
          >
            <Text style={[styles.categoryText, { color: theme.colors.text.secondary }]}>
              {category}
            </Text>
          </View>
        )}
        {isPremium && (
          <View
            style={[
              styles.premiumBadge,
              { backgroundColor: theme.colors.premium.gold.DEFAULT },
            ]}
          >
            <Text style={styles.premiumText}>⭐ Premium</Text>
          </View>
        )}
      </View>
    </View>
  );
};

// Event Info Section
const EventInfoSection: React.FC<{
  event: EventDetailsData;
}> = ({ event }) => {
  const theme = useTheme();

  return (
    <View style={styles.infoSection}>
      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.text.primary },
        ]}
      >
        {event.title}
      </Text>

      {/* Date & Time */}
      <View style={styles.infoRow}>
        <Text style={styles.infoIcon}>📅</Text>
        <View style={styles.infoContent}>
          <Text
            style={[styles.infoText, { color: theme.colors.text.primary }]}
          >
            {event.date} • {event.time}
          </Text>
          {event.duration && (
            <Text
              style={[styles.infoSubtext, { color: theme.colors.text.secondary }]}
            >
              Duration: {event.duration}
            </Text>
          )}
        </View>
      </View>

      {/* Location */}
      {event.location && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoText, { color: theme.colors.text.primary }]}
            >
              {event.location.name}
            </Text>
            <Text
              style={[styles.infoSubtext, { color: theme.colors.text.secondary }]}
            >
              {event.location.address}
              {event.distance && ` • ${event.distance}`}
            </Text>
          </View>
        </View>
      )}

      {/* Language */}
      {event.language && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>🗣️</Text>
          <View style={styles.infoContent}>
            <Text
              style={[styles.infoText, { color: theme.colors.text.primary }]}
            >
              {event.language}
            </Text>
          </View>
        </View>
      )}

      {/* Price */}
      {event.price && (
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>💰</Text>
          <View style={styles.infoContent}>
            <Text
              style={[
                styles.infoText,
                { color: event.price === 'Free' ? theme.colors.status.success.DEFAULT : theme.colors.text.primary },
              ]}
            >
              {event.price}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

// Participants Section
const ParticipantsSection: React.FC<{
  participants?: EventDetailsData['participants'];
}> = ({ participants }) => {
  const theme = useTheme();

  if (!participants) return null;

  const availabilityPercentage = (participants.current / participants.max) * 100;
  const spotsLeft = participants.max - participants.current;

  return (
    <View style={styles.participantsSection}>
      <View style={styles.participantsHeader}>
        <Text
          style={[
            styles.sectionTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          👥 Participants
        </Text>
        <Text
          style={[
            styles.participantsCount,
            { color: theme.colors.text.secondary },
          ]}
        >
          {participants.current} / {participants.max}
        </Text>
      </View>

      {/* Availability Bar */}
      <View style={styles.availabilityContainer}>
        <View
          style={[
            styles.availabilityTrack,
            { backgroundColor: theme.colors.surface.tertiary },
          ]}
        >
          <View
            style={[
              styles.availabilityFill,
              {
                width: `${availabilityPercentage}%`,
                backgroundColor:
                  availabilityPercentage >= 90
                    ? theme.colors.status.danger.DEFAULT
                    : availabilityPercentage >= 70
                    ? theme.colors.status.warning.DEFAULT
                    : theme.colors.status.success.DEFAULT,
              },
            ]}
          />
        </View>
        <Text
          style={[
            styles.spotsText,
            { color: theme.colors.text.tertiary },
          ]}
        >
          {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Event is full'}
        </Text>
      </View>

      {/* Avatar List */}
      {participants.list && participants.list.length > 0 && (
        <View style={styles.avatarList}>
          {participants.list.slice(0, 8).map((participant, index) => (
            <View key={participant.id} style={[styles.avatarItem, { marginLeft: index > 0 ? -12 : 0 }]}>
              <Avatar
                src={participant.avatarUrl}
                name={participant.name}
                size="sm"
              />
            </View>
          ))}
          {participants.list.length > 8 && (
            <View style={[styles.moreAvatars, { backgroundColor: theme.colors.surface.tertiary }]}>
              <Text
                style={[
                  styles.moreAvatarsText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                +{participants.list.length - 8}
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

// Description Section
const DescriptionSection: React.FC<{
  description?: string;
  requirements?: string[];
  tags?: string[];
}> = ({ description, requirements, tags }) => {
  const theme = useTheme();

  return (
    <View style={styles.descriptionSection}>
      {/* Description */}
      {description && (
        <View style={styles.descriptionBlock}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            About
          </Text>
          <Text
            style={[
              styles.descriptionText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {description}
          </Text>
        </View>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="sm"
              variant="filter"
              style={styles.tag}
            />
          ))}
        </View>
      )}

      {/* Requirements */}
      {requirements && requirements.length > 0 && (
        <View style={styles.requirementsBlock}>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            Requirements
          </Text>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text style={styles.requirementIcon}>✓</Text>
              <Text
                style={[
                  styles.requirementText,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {req}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// Main Event Details Screen
export const EventDetailsScreen: React.FC<EventDetailsScreenProps> = ({
  event,
  joinState = 'available',
  isFavorite = false,
  onBack,
  onJoin,
  onCancel,
  onFavorite,
  onShare,
  onReport,
  onOrganizerPress,
  onLocationPress,
  onNavigatePress,
  onChatPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const [showActionSheet, setShowActionSheet] = useState(false);

  const handleShare = useCallback(() => {
    haptics.light();
    onShare?.();
    setShowActionSheet(false);
  }, [haptics, onShare]);

  const handleReport = useCallback(() => {
    haptics.light();
    onReport?.();
    setShowActionSheet(false);
  }, [haptics, onReport]);

  const handleFavorite = useCallback(() => {
    haptics.medium();
    onFavorite?.();
  }, [haptics, onFavorite]);

  const handleNavigate = useCallback(() => {
    if (event.location) {
      const url = `https://maps.apple.com/?ll=${event.location.latitude},${event.location.longitude}`;
      Linking.openURL(url);
    }
  }, [event.location]);

  const handleJoin = useCallback(() => {
    haptics.medium();
    onJoin?.();
  }, [haptics, onJoin]);

  const handleCancel = useCallback(() => {
    haptics.light();
    onCancel?.();
  }, [haptics, onCancel]);

  const actionSheetOptions = [
    { label: 'Favorite', icon: isFavorite ? '❤️' : '🤍', onPress: handleFavorite },
    { label: 'Share', icon: '📤', onPress: handleShare },
    { label: 'Copy Link', icon: '🔗', onPress: () => {} },
    { label: 'Report', icon: '🚩', onPress: handleReport, destructive: true },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface.background }, style]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <HeroImageSection
          imageUrl={event.imageUrl}
          isPremium={event.isPremium}
          category={event.category}
          onBack={onBack}
        />

        {/* Content */}
        <View style={styles.content}>
          {/* Event Info */}
          <EventInfoSection event={event} />

          {/* Participants */}
          <ParticipantsSection participants={event.participants} />

          {/* Organizer */}
          <View style={styles.organizerSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              👤 Organizer
            </Text>
            <OrganizerRow
              name={event.organizer.name}
              avatarUrl={event.organizer.avatarUrl}
              isVerified={event.organizer.isVerified}
              isOrganizer={event.organizer.isOrganizer}
              isBusiness={event.organizer.isBusiness}
              trustScore={event.organizer.trustScore}
              onPress={onOrganizerPress}
            />
          </View>

          {/* Trust Block */}
          {event.organizer.trustScore && (
            <TrustBlock
              trustScore={event.organizer.trustScore}
              isVerified={event.organizer.isVerified}
              isOrganizer={event.organizer.isOrganizer}
              isBusiness={event.organizer.isBusiness}
              attendanceRate={85}
              hostedEventsCount={24}
            />
          )}

          {/* Description */}
          <DescriptionSection
            description={event.description}
            requirements={event.requirements}
            tags={event.tags}
          />

          {/* Spacer for bottom action */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: theme.colors.surface.primary,
            borderTopColor: theme.colors.border.default,
          },
        ]}
      >
        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          <Pressable
            onPress={handleFavorite}
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface.secondary },
            ]}
          >
            <Text style={styles.actionIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowActionSheet(true)}
            style={[
              styles.actionButton,
              { backgroundColor: theme.colors.surface.secondary },
            ]}
          >
            <Text style={styles.actionIcon}>•••</Text>
          </Pressable>
        </View>

        {/* Join Flow */}
        <View style={styles.joinContainer}>
          <JoinFlow
            state={joinState}
            eventTitle={event.title}
            spotsLeft={event.participants ? event.participants.max - event.participants.current : undefined}
            onJoin={handleJoin}
            onCancel={handleCancel}
            onViewChat={onChatPress}
          />
        </View>
      </View>

      {/* Action Sheet */}
      <ActionSheet
        visible={showActionSheet}
        onClose={() => setShowActionSheet(false)}
        title="Actions"
        options={actionSheetOptions.map((opt) => ({
          label: opt.label,
          icon: opt.icon,
          onPress: opt.onPress,
          destructive: opt.destructive,
        }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[4],
  },
  heroContainer: {
    width: SCREEN_WIDTH,
    height: 280,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderIcon: {
    fontSize: 80,
    opacity: 0.5,
  },
  heroGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  heroBadges: {
    position: 'absolute',
    top: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    gap: spacing[2],
  },
  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 6,
  },
  premiumText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    padding: spacing[4],
    marginTop: -spacing[4],
  },
  infoSection: {
    marginBottom: spacing[6],
  },
  title: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    lineHeight: 32,
    marginBottom: spacing[4],
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  infoIcon: {
    fontSize: 18,
    marginRight: spacing[3],
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  infoSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  participantsSection: {
    marginBottom: spacing[6],
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[3],
  },
  participantsCount: {
    fontSize: 14,
  },
  availabilityContainer: {
    marginBottom: spacing[3],
  },
  availabilityTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing[1],
  },
  availabilityFill: {
    height: '100%',
  },
  spotsText: {
    fontSize: 12,
  },
  avatarList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarItem: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 16,
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  moreAvatarsText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  organizerSection: {
    marginBottom: spacing[6],
  },
  descriptionSection: {
    marginBottom: spacing[6],
  },
  descriptionBlock: {
    marginBottom: spacing[4],
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
    marginBottom: spacing[4],
  },
  tag: {},
  requirementsBlock: {
    marginBottom: spacing[4],
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  requirementIcon: {
    fontSize: 14,
    color: '#10B981',
    marginRight: spacing[2],
  },
  requirementText: {
    fontSize: 14,
    flex: 1,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    paddingBottom: spacing[6],
    borderTopWidth: 1,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing[2],
    marginRight: spacing[3],
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 20,
  },
  joinContainer: {
    flex: 1,
  },
});

EventDetailsScreen.displayName = 'EventDetailsScreen';
