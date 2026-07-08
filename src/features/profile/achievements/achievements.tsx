/**
 * LinkUp Design System 2026
 * Achievements - Achievement badges and cards
 */

'use client';

import React, { useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  ZoomIn,
} from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// Achievement Types
export type AchievementCategory =
  | 'community'
  | 'coffee'
  | 'travel'
  | 'music'
  | 'food'
  | 'gaming'
  | 'sports'
  | 'business'
  | 'volunteer'
  | 'nightlife'
  | 'education'
  | 'culture';

export type AchievementStatus = 'locked' | 'unlocked' | 'in_progress';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  xpReward?: number;
  status: AchievementStatus;
  progress?: number;
  target?: number;
  unlockedAt?: Date;
}

// Sample achievements
export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  { id: '1', name: 'First Step', description: 'Join your first event', category: 'community', icon: '👣', xpReward: 10, status: 'unlocked', unlockedAt: new Date() },
  { id: '2', name: 'Social Butterfly', description: 'Attend 10 events', category: 'community', icon: '🦋', xpReward: 50, status: 'in_progress', progress: 7, target: 10 },
  { id: '3', name: 'Coffee Lover', description: 'Attend 5 coffee meetups', category: 'coffee', icon: '☕', xpReward: 30, status: 'unlocked', unlockedAt: new Date() },
  { id: '4', name: 'World Traveler', description: 'Attend events in 5 cities', category: 'travel', icon: '✈️', xpReward: 100, status: 'locked' },
  { id: '5', name: 'Music Enthusiast', description: 'Attend 5 music events', category: 'music', icon: '🎵', xpReward: 30, status: 'locked' },
  { id: '6', name: 'Foodie', description: 'Attend 5 food events', category: 'food', icon: '🍕', xpReward: 30, status: 'locked' },
  { id: '7', name: 'Gamer', description: 'Attend 5 gaming events', category: 'gaming', icon: '🎮', xpReward: 30, status: 'locked' },
  { id: '8', name: 'Athlete', description: 'Attend 5 sports events', category: 'sports', icon: '⚽', xpReward: 30, status: 'locked' },
  { id: '9', name: 'Networking Pro', description: 'Meet 50 people', category: 'business', icon: '💼', xpReward: 75, status: 'locked' },
  { id: '10', name: 'Volunteer', description: 'Attend 5 volunteer events', category: 'volunteer', icon: '🤝', xpReward: 50, status: 'locked' },
  { id: '11', name: 'Night Owl', description: 'Attend 5 nightlife events', category: 'nightlife', icon: '🌙', xpReward: 30, status: 'locked' },
  { id: '12', name: 'Scholar', description: 'Attend 5 education events', category: 'education', icon: '📚', xpReward: 30, status: 'locked' },
  { id: '13', name: 'Culture Vulture', description: 'Attend 5 cultural events', category: 'culture', icon: '🎭', xpReward: 30, status: 'locked' },
];

interface AchievementCardProps {
  achievement: Achievement;
  onPress?: () => void;
  style?: ViewStyle;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const isUnlocked = achievement.status === 'unlocked';
  const isInProgress = achievement.status === 'in_progress';
  const progress = achievement.progress && achievement.target
    ? (achievement.progress / achievement.target) * 100
    : 0;

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    haptics.light();
    onPress?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getCategoryColor = () => {
    const colors: Record<AchievementCategory, string> = {
      community: '#3B82F6',
      coffee: '#8B4513',
      travel: '#E67E22',
      music: '#9B59B6',
      food: '#FF6B6B',
      gaming: '#3498DB',
      sports: '#27AE60',
      business: '#2C3E50',
      volunteer: '#1ABC9C',
      nightlife: '#8E44AD',
      education: '#2980B9',
      culture: '#D35400',
    };
    return colors[achievement.category] || '#6B7280';
  };

  const categoryColor = getCategoryColor();

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      entering={ZoomIn.duration(300)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.surface.primary,
          borderColor: isUnlocked ? categoryColor : theme.colors.border.default,
          opacity: isUnlocked ? 1 : 0.6,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: isUnlocked ? `${categoryColor}20` : theme.colors.surface.tertiary,
          },
        ]}
      >
        <Text style={[styles.icon, { opacity: isUnlocked ? 1 : 0.4 }]}>
          {isUnlocked ? achievement.icon : '🔒'}
        </Text>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text
          style={[
            styles.name,
            { color: isUnlocked ? theme.colors.text.primary : theme.colors.text.tertiary },
          ]}
          numberOfLines={1}
        >
          {achievement.name}
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.text.tertiary }]}
          numberOfLines={2}
        >
          {achievement.description}
        </Text>

        {/* Progress Bar */}
        {isInProgress && (
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressTrack,
                { backgroundColor: theme.colors.surface.tertiary },
              ]}
            >
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%`, backgroundColor: categoryColor },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text.tertiary }]}>
              {achievement.progress}/{achievement.target}
            </Text>
          </View>
        )}
      </View>

      {/* XP Reward */}
      {achievement.xpReward && (
        <View
          style={[
            styles.xpBadge,
            { backgroundColor: isUnlocked ? categoryColor : theme.colors.surface.tertiary },
          ]}
        >
          <Text style={styles.xpIcon}>✨</Text>
          <Text style={styles.xpValue}>{achievement.xpReward}</Text>
        </View>
      )}
    </AnimatedPressable>
  );
};

// Achievement Badge (compact)
interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'md',
  style,
}) => {
  const theme = useTheme();
  const isUnlocked = achievement.status === 'unlocked';

  const getSize = () => {
    switch (size) {
      case 'sm': return 40;
      case 'lg': return 72;
      default: return 56;
    }
  };

  const containerSize = getSize();

  return (
    <View
      style={[
        styles.badge,
        {
          width: containerSize,
          height: containerSize,
          borderRadius: containerSize / 2,
          backgroundColor: isUnlocked ? theme.colors.surface.primary : theme.colors.surface.tertiary,
          opacity: isUnlocked ? 1 : 0.5,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: containerSize * 0.5 }}>
        {isUnlocked ? achievement.icon : '🔒'}
      </Text>
    </View>
  );
};

// Main Achievements Section
interface AchievementsProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
  showAll?: boolean;
  style?: ViewStyle;
}

export const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  onAchievementPress,
  showAll = false,
  style,
}) => {
  const theme = useTheme();

  const unlockedCount = achievements.filter((a) => a.status === 'unlocked').length;
  const totalCount = achievements.length;

  const renderItem = ({ item }: { item: Achievement }) => (
    <AchievementCard
      achievement={item}
      onPress={() => onAchievementPress?.(item)}
    />
  );

  return (
    <View style={[styles.container, style]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            🏆 Achievements
          </Text>
          <Text style={[styles.achievementCount, { color: theme.colors.text.tertiary }]}>
            {unlockedCount}/{totalCount} unlocked
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressHeader}>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.surface.tertiary },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width: `${(unlockedCount / totalCount) * 100}%`,
                backgroundColor: theme.colors.interactive.primary,
              },
            ]}
          />
        </View>
      </View>

      {/* Grid */}
      <FlatList
        data={showAll ? achievements : achievements.slice(0, 6)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        scrollEnabled={false}
      />
    </View>
  );
};

// Recently Unlocked Section
interface RecentAchievementsProps {
  achievements: Achievement[];
  onSeeAll?: () => void;
  style?: ViewStyle;
}

export const RecentAchievements: React.FC<RecentAchievementsProps> = ({
  achievements,
  onSeeAll,
  style,
}) => {
  const theme = useTheme();

  const recentUnlocked = achievements
    .filter((a) => a.status === 'unlocked')
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 3);

  if (recentUnlocked.length === 0) return null;

  return (
    <View style={[styles.recentContainer, style]}>
      <View style={styles.recentHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          ✨ Recently Unlocked
        </Text>
        {onSeeAll && (
          <Pressable onPress={onSeeAll}>
            <Text style={[styles.seeAllText, { color: theme.colors.interactive.primary }]}>
              See All
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.recentGrid}>
        {recentUnlocked.map((achievement, index) => (
          <Animated.View
            key={achievement.id}
            entering={FadeIn.delay(index * 100)}
            style={styles.recentItem}
          >
            <AchievementBadge achievement={achievement} size="lg" />
            <Text
              style={[styles.recentName, { color: theme.colors.text.primary }]}
              numberOfLines={1}
            >
              {achievement.name}
            </Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing[4],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: fontWeight.semibold,
  },
  achievementCount: {
    fontSize: 13,
  },
  progressHeader: {
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  grid: {
    paddingHorizontal: spacing[4],
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing[3],
  },
  card: {
    width: '48%',
    padding: spacing[3],
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[2],
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    lineHeight: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing[2],
  },
  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginRight: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: 8,
  },
  xpIcon: {
    fontSize: 10,
    marginRight: 2,
  },
  xpValue: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
    color: '#FFFFFF',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  recentContainer: {
    marginTop: spacing[4],
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: fontWeight.medium,
  },
  recentGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: spacing[4],
  },
  recentItem: {
    alignItems: 'center',
    width: 80,
  },
  recentName: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    marginTop: spacing[1],
    textAlign: 'center',
  },
});

AchievementCard.displayName = 'AchievementCard';
AchievementBadge.displayName = 'AchievementBadge';
Achievements.displayName = 'Achievements';
RecentAchievements.displayName = 'RecentAchievements';
