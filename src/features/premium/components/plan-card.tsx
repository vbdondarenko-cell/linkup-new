/**
 * LinkUp Design System 2026
 * Premium Plans - Plan Card Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { SubscriptionPlan } from '../types';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  isCurrentPlan?: boolean;
  onSelect?: () => void;
  onSubscribe?: () => void;
  delay?: number;
  style?: ViewStyle;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  isCurrentPlan = false,
  onSelect,
  onSubscribe,
  delay = 0,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const handlePress = () => {
    haptics.light();
    onSelect?.();
  };

  const handleSubscribe = () => {
    haptics.medium();
    onSubscribe?.();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      delayPressIn={delay}
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.surface.primary,
          borderColor: isSelected ? '#FFD700' : theme.colors.border.default,
          borderWidth: isSelected ? 2 : 1,
        },
        plan.isPopular && styles.popularContainer,
        animatedStyle,
        style,
      ]}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularBadgeText}>BEST VALUE</Text>
        </View>
      )}

      {/* Selection Indicator */}
      <View style={[
        styles.radioOuter,
        { borderColor: isSelected ? '#FFD700' : theme.colors.border.default }
      ]}>
        {isSelected && <View style={[styles.radioInner, { backgroundColor: '#FFD700' }]} />}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.planName, { color: theme.colors.text.primary }]}>
          {plan.name}
        </Text>

        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.colors.text.primary }]}>
            {formatPrice(plan.price, plan.currency)}
          </Text>
          <Text style={[styles.interval, { color: theme.colors.text.tertiary }]}>
            /{plan.interval === 'year' ? 'year' : 'month'}
          </Text>
        </View>

        {plan.savings && (
          <View style={[styles.savingsBadge, { backgroundColor: '#10B98115' }]}>
            <Text style={[styles.savingsText, { color: '#10B981' }]}>
              Save {plan.savings}%
            </Text>
          </View>
        )}

        {isCurrentPlan && (
          <View style={[styles.currentBadge, { backgroundColor: `${theme.colors.primary.DEFAULT}15` }]}>
            <Text style={[styles.currentText, { color: theme.colors.primary.DEFAULT }]}>
              Current Plan
            </Text>
          </View>
        )}
      </View>

      {/* Features */}
      <View style={styles.features}>
        {plan.features.slice(0, 3).map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <Text style={styles.featureCheck}>✓</Text>
            <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </AnimatedPressable>
  );
};

// Plans Grid Component
interface PlansGridProps {
  plans: SubscriptionPlan[];
  selectedPlanId: string | null;
  currentPlanId?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  onSubscribe: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export const PlansGrid: React.FC<PlansGridProps> = ({
  plans,
  selectedPlanId,
  currentPlanId,
  onSelectPlan,
  onSubscribe,
  isLoading = false,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.gridContainer, style]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Choose Your Plan
      </Text>
      
      <View style={styles.grid}>
        {plans.map((plan, index) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            isCurrentPlan={currentPlanId === plan.id}
            onSelect={() => onSelectPlan(plan)}
            delay={100 + index * 100}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing[5],
    borderRadius: 20,
    marginBottom: spacing[3],
  },
  popularContainer: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: spacing[4],
    backgroundColor: '#FFD700',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: 10,
  },
  popularBadgeText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    marginBottom: spacing[3],
  },
  planName: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[1],
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
  },
  interval: {
    fontSize: 14,
    marginLeft: 2,
  },
  savingsBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: spacing[2],
  },
  savingsText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  currentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: spacing[2],
  },
  currentText: {
    fontSize: 12,
    fontWeight: fontWeight.semibold,
  },
  features: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: spacing[3],
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  featureCheck: {
    fontSize: 14,
    color: '#10B981',
    marginRight: spacing[2],
  },
  featureText: {
    fontSize: 13,
  },
  gridContainer: {
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[4],
  },
  grid: {},
});

PlanCard.displayName = 'PlanCard';
PlansGrid.displayName = 'PlansGrid';
