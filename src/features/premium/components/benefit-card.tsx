/**
 * LinkUp Design System 2026
 * Premium Home - Benefit Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { PremiumBenefit } from '../types';

interface BenefitCardProps {
  benefit: PremiumBenefit;
  isPremium: boolean;
  delay?: number;
  style?: ViewStyle;
}

export const BenefitCard: React.FC<BenefitCardProps> = ({
  benefit,
  isPremium,
  delay = 0,
  style,
}) => {
  const theme = useTheme();

  return (
    <Animated.View
      entering={FadeInUp.delay(delay).springify()}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary },
        style,
      ]}
    >
      {/* Icon */}
      <View style={[
        styles.iconContainer,
        { backgroundColor: benefit.isPremium ? '#FFD70015' : `${theme.colors.primary.DEFAULT}15` }
      ]}>
        <Text style={styles.icon}>{benefit.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {benefit.title}
          </Text>
          {!benefit.isPremium && (
            <View style={[styles.freeTag, { backgroundColor: `${theme.colors.status.success.DEFAULT}15` }]}>
              <Text style={[styles.freeTagText, { color: theme.colors.status.success.DEFAULT }]}>
                Free
              </Text>
            </View>
          )}
          {benefit.isPremium && (
            <View style={[styles.premiumTag, { backgroundColor: '#FFD70015' }]}>
              <Text style={styles.premiumTagText}>⭐ Premium</Text>
            </View>
          )}
        </View>
        <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
          {benefit.description}
        </Text>
      </View>

      {/* Status Indicator */}
      <View style={[
        styles.statusDot,
        { backgroundColor: benefit.isPremium ? '#FFD700' : theme.colors.status.success.DEFAULT }
      ]} />
    </Animated.View>
  );
};

// Benefits List Component
interface BenefitsListProps {
  benefits: PremiumBenefit[];
  isPremium: boolean;
  style?: ViewStyle;
}

export const BenefitsList: React.FC<BenefitsListProps> = ({
  benefits,
  isPremium,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.listContainer, style]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        What You Get
      </Text>
      {benefits.map((benefit, index) => (
        <BenefitCard
          key={benefit.id}
          benefit={benefit}
          isPremium={isPremium}
          delay={100 + index * 50}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    borderRadius: 16,
    marginBottom: spacing[3],
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    marginLeft: spacing[3],
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    fontSize: 15,
    fontWeight: fontWeight.semibold,
  },
  freeTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
  },
  freeTagText: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
  },
  premiumTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
    gap: 2,
  },
  premiumTagText: {
    fontSize: 10,
    fontWeight: fontWeight.semibold,
    color: '#FFD700',
  },
  description: {
    fontSize: 13,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  listContainer: {
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[4],
  },
});

BenefitCard.displayName = 'BenefitCard';
BenefitsList.displayName = 'BenefitsList';
