/**
 * LinkUp Design System 2026
 * Realtime - Achievements & Badges
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { Achievement, Badge, AchievementType, BadgeType } from '../types';

interface AchievementsListProps {
  achievements: Achievement[];
  onAchievementPress?: (achievement: Achievement) => void;
  filter?: AchievementType | 'all';
  style?: ViewStyle;
}

const CATEGORY_COLORS: Record<string, string> = {
  community: '#3B82F6',
  coffee: '#8B4513',
  sports: '#22C55E',
  travel: '#F59E0B',
  music: '#8B5CF6',
  food: '#DC2626',
  gaming: '#6366F1',
  volunteer: '#10B981',
  business: '#0EA5E9',
  culture: '#B45309',
  education: '#8B5CF6',
  nightlife: '#6B21A8',
  organizer: '#F59E0B',
  explorer: '#14B8A6',
  premium: '#FFD700',
};

const AchievementCard: React.FC<{
  achievement: Achievement;
  onPress: () => void;
}> = ({ achievement, onPress }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const categoryColor = CATEGORY_COLORS[achievement.category] || theme.colors.primary.DEFAULT;
  const isUnlocked = achievement.status === 'unlocked';
  const progress = Math.min(100, (achievement.progress / achievement.requirement) * 100);

  return (
    <Animated.View entering={FadeInDown.springify()} layout={Layout.springify()}>
      <Pressable
        onPress={() => { haptics.light(); onPress(); }}
        style={({ pressed }) => [
          styles.achievementCard,
          { backgroundColor: theme.colors.surface.primary },
          !isUnlocked && styles.locked,
          pressed && { opacity: 0.8 },
        ]}
      >
        {/* Icon */}
        <View style={[
          styles.achievementIcon,
          { 
            backgroundColor: isUnlocked ? `${categoryColor}20` : theme.colors.surface.secondary,
            opacity: isUnlocked ? 1 : 0.5,
          }
        ]}>
          <Text style={[
            styles.achievementIconText,
            { opacity: isUnlocked ? 1 : 0.5 }
          ]}>
            {isUnlocked ? achievement.icon : '🔒'}
          </Text>
        </View>

        {/* Content */}
        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Text style={[
              styles.achievementName,
              { color: isUnlocked ? theme.colors.text.primary : theme.colors.text.tertiary }
            ]}>
              {achievement.isSecret && !isUnlocked ? '???' : achievement.name}
            </Text>
            {achievement.isSecret && !isUnlocked && (
              <View style={[styles.secretBadge, { backgroundColor: theme.colors.surface.secondary }]}>
                <Text style={[styles.secretText, { color: theme.colors.text.tertiary }]}>Secret</Text>
              </View>
            )}
          </View>
          <Text style={[styles.achievementDesc, { color: theme.colors.text.tertiary }]}>
            {achievement.isSecret && !isUnlocked ? 'Keep exploring to unlock' : achievement.description}
          </Text>
          
          {/* Progress */}
          {!isUnlocked && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressTrack, { backgroundColor: theme.colors.surface.secondary }]}>
                <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: categoryColor }]} />
              </View>
              <Text style={[styles.progressText, { color: theme.colors.text.tertiary }]}>
                {achievement.progress}/{achievement.requirement}
              </Text>
            </View>
          )}

          {/* XP Reward */}
          {isUnlocked && (
            <View style={[styles.xpBadge, { backgroundColor: `${theme.colors.primary.DEFAULT}15` }]}>
              <Text style={[styles.xpBadgeText, { color: theme.colors.primary.DEFAULT }]}>
                +{achievement.xpReward} XP
              </Text>
            </View>
          )}
        </View>

        {/* Status */}
        {isUnlocked && (
          <View style={[styles.statusBadge, { backgroundColor: '#22C55E20' }]}>
            <Text style={styles.statusIcon}>✓</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

export const AchievementsList: React.FC<AchievementsListProps> = ({
  achievements,
  onAchievementPress,
  filter = 'all',
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const [selectedCategory, setSelectedCategory] = React.useState<AchievementType | 'all'>(filter);

  const categories: Array<{ id: AchievementType | 'all'; name: string; icon: string }> = [
    { id: 'all', name: 'All', icon: '🏆' },
    { id: 'community', name: 'Community', icon: '🤝' },
    { id: 'organizer', name: 'Organizer', icon: '🎤' },
    { id: 'explorer', name: 'Explorer', icon: '🌍' },
    { id: 'premium', name: 'Premium', icon: '⭐' },
  ];

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.status === 'unlocked').length;
  const totalXP = achievements
    .filter(a => a.status === 'unlocked')
    .reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <View style={[styles.container, style]}>
      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {unlockedCount}/{achievements.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Unlocked</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.primary.DEFAULT }]}>
            {totalXP}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>XP Earned</Text>
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => { haptics.light(); setSelectedCategory(cat.id); }}
            style={[
              styles.categoryChip,
              { 
                backgroundColor: selectedCategory === cat.id 
                  ? theme.colors.primary.DEFAULT 
                  : theme.colors.surface.primary,
              },
            ]}
          >
            <Text style={styles.categoryIcon}>{cat.icon}</Text>
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === cat.id ? '#FFFFFF' : theme.colors.text.primary }
            ]}>
              {cat.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Achievements List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.achievementsList}>
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onPress={() => onAchievementPress?.(achievement)}
            />
          ))}
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

// Badge Grid Component
interface BadgeGridProps {
  badges: Badge[];
  onBadgePress?: (badge: Badge) => void;
  style?: ViewStyle;
}

const RARITY_COLORS = {
  common: '#94A3B8',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#FFD700',
};

const BadgeItem: React.FC<{
  badge: Badge;
  onPress: () => void;
}> = ({ badge, onPress }) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const rarityColor = RARITY_COLORS[badge.rarity];
  const isEarned = !!badge.earnedAt;

  return (
    <Pressable
      onPress={() => { haptics.light(); onPress(); }}
      style={({ pressed }) => [
        styles.badgeItem,
        { backgroundColor: theme.colors.surface.primary },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={[
        styles.badgeIconContainer,
        { 
          borderColor: isEarned ? rarityColor : theme.colors.surface.secondary,
          borderWidth: 2,
          opacity: isEarned ? 1 : 0.4,
        }
      ]}>
        <Text style={[styles.badgeIcon, { opacity: isEarned ? 1 : 0.3 }]}>
          {badge.icon}
        </Text>
      </View>
      <Text 
        style={[
          styles.badgeName, 
          { color: isEarned ? theme.colors.text.primary : theme.colors.text.tertiary }
        ]}
        numberOfLines={1}
      >
        {isEarned ? badge.name : '???'}
      </Text>
      {isEarned && (
        <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
      )}
    </Pressable>
  );
};

export const BadgeGrid: React.FC<BadgeGridProps> = ({
  badges,
  onBadgePress,
  style,
}) => {
  const theme = useTheme();
  
  const earnedBadges = badges.filter(b => b.earnedAt);
  const lockedBadges = badges.filter(b => !b.earnedAt);

  return (
    <View style={[styles.container, style]}>
      {/* Stats */}
      <View style={[styles.statsRow, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>
            {earnedBadges.length}/{badges.length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Badges</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: RARITY_COLORS.legendary }]}>
            {badges.filter(b => b.rarity === 'legendary' && b.earnedAt).length}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text.tertiary }]}>Legendary</Text>
        </View>
      </View>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>
            Earned Badges
          </Text>
          <View style={styles.badgeGrid}>
            {earnedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} onPress={() => onBadgePress?.(badge)} />
            ))}
          </View>
        </View>
      )}

      {/* Locked Badges */}
      {lockedBadges.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.tertiary }]}>
            Locked Badges
          </Text>
          <View style={styles.badgeGrid}>
            {lockedBadges.map((badge) => (
              <BadgeItem key={badge.id} badge={badge} onPress={() => onBadgePress?.(badge)} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    padding: spacing[4],
    marginHorizontal: spacing[5],
    marginVertical: spacing[3],
    borderRadius: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: 20,
    marginRight: spacing[2],
    gap: spacing[1],
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
  },
  achievementsList: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing[4],
    borderRadius: 16,
  },
  locked: {
    opacity: 0.8,
  },
  achievementIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  achievementIconText: {
    fontSize: 26,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  achievementName: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  secretBadge: {
    marginLeft: spacing[2],
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
  },
  secretText: {
    fontSize: 10,
    fontWeight: fontWeight.medium,
  },
  achievementDesc: {
    fontSize: 13,
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
    marginRight: spacing[2],
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 11,
    minWidth: 40,
    textAlign: 'right',
  },
  xpBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: spacing[2],
  },
  xpBadgeText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  statusBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: fontWeight.bold,
  },
  // Badge Grid
  section: {
    paddingHorizontal: spacing[5],
    marginTop: spacing[4],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing[3],
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  badgeItem: {
    width: '30%',
    padding: spacing[3],
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  badgeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  badgeIcon: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 11,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  rarityDot: {
    position: 'absolute',
    top: spacing[2],
    right: spacing[2],
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  bottomSpacer: {
    height: spacing[8],
  },
});

AchievementsList.displayName = 'AchievementsList';
BadgeGrid.displayName = 'BadgeGrid';
