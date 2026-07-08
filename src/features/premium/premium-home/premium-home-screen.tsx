/**
 * LinkUp Design System 2026
 * Premium Home Screen
 */

'use client';

import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ViewStyle, Pressable } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

import { usePremiumState } from '../hooks';
import {
  PremiumHero,
  BenefitsList,
  PlanCard,
  RewardPremiumCard,
  ThemeSelector,
  ComparisonTable,
} from '../components';
import { FAQ_ITEMS, PREMIUM_BENEFITS, COMPARISON_FEATURES, DEFAULT_PLANS } from '../types';

interface PremiumHomeScreenProps {
  onUpgradePress?: () => void;
  onManagePress?: () => void;
  onRestorePress?: () => void;
  style?: ViewStyle;
}

export const PremiumHomeScreen: React.FC<PremiumHomeScreenProps> = ({
  onUpgradePress,
  onManagePress,
  onRestorePress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const {
    isPremium,
    subscription,
    rewardState,
    currentTheme,
    themes,
    isLoading,
    availablePlans,
    watchAd,
  } = usePremiumState();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  const handleSelectPlan = useCallback((planId: string) => {
    haptics.light();
    setSelectedPlanId(planId);
  }, [haptics]);

  const handleUpgrade = useCallback(() => {
    haptics.medium();
    onUpgradePress?.();
  }, [haptics, onUpgradePress]);

  const handleWatchAd = useCallback(() => {
    haptics.medium();
    watchAd();
  }, [haptics, watchAd]);

  const handleFaqToggle = useCallback((faqId: string) => {
    haptics.light();
    setExpandedFaqId(expandedFaqId === faqId ? null : faqId);
  }, [expandedFaqId, haptics]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer, { backgroundColor: theme.colors.background.secondary }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary.DEFAULT} />
        }
      >
        {/* Premium Hero */}
        <PremiumHero
          isPremium={isPremium}
          planName={subscription?.planId}
          expiresAt={subscription?.expiresAt}
          onUpgradePress={handleUpgrade}
          onManagePress={onManagePress}
        />

        {/* Reward Premium */}
        <Animated.View entering={FadeInDown.delay(100)}>
          <RewardPremiumCard
            rewardState={rewardState}
            isPremium={isPremium}
            onWatchAd={handleWatchAd}
          />
        </Animated.View>

        {/* Benefits */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <BenefitsList
            benefits={PREMIUM_BENEFITS}
            isPremium={isPremium}
          />
        </Animated.View>

        {/* Plans */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <View style={styles.plansSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Choose Your Plan
            </Text>
            {DEFAULT_PLANS.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isSelected={selectedPlanId === plan.id}
                isCurrentPlan={subscription?.planId === plan.type}
                onSelect={() => handleSelectPlan(plan.id)}
                onSubscribe={handleUpgrade}
                delay={100 + index * 100}
              />
            ))}
          </View>
        </Animated.View>

        {/* Comparison */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <ComparisonTable features={COMPARISON_FEATURES} />
        </Animated.View>

        {/* Themes */}
        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <ThemeSelector
            themes={themes}
            currentTheme={currentTheme}
            isPremium={isPremium}
            onSelectTheme={() => {}}
          />
        </Animated.View>

        {/* FAQ */}
        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <View style={styles.faqSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Frequently Asked Questions
            </Text>
            {FAQ_ITEMS.map((faq, index) => (
              <Animated.View
                key={faq.id}
                entering={FadeInDown.delay(100 + index * 50)}
              >
                <Pressable
                  onPress={() => handleFaqToggle(faq.id)}
                  style={[
                    styles.faqItem,
                    { backgroundColor: theme.colors.surface.primary },
                  ]}
                >
                  <View style={styles.faqHeader}>
                    <Text style={[styles.faqQuestion, { color: theme.colors.text.primary }]}>
                      {faq.question}
                    </Text>
                    <Text style={[styles.faqIcon, { color: theme.colors.text.tertiary }]}>
                      {expandedFaqId === faq.id ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedFaqId === faq.id && (
                    <Text style={[styles.faqAnswer, { color: theme.colors.text.secondary }]}>
                      {faq.answer}
                    </Text>
                  )}
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Restore Purchase */}
        <Animated.View entering={FadeInDown.delay(700)} style={styles.restoreSection}>
          <Pressable
            onPress={() => { haptics.light(); onRestorePress?.(); }}
            style={[styles.restoreButton, { backgroundColor: theme.colors.surface.primary }]}
          >
            <Text style={[styles.restoreText, { color: theme.colors.text.secondary }]}>
              Restore Purchase
            </Text>
          </Pressable>
        </Animated.View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <Text style={[styles.termsText, { color: theme.colors.text.tertiary }]}>
            Subscription automatically renews unless cancelled 24 hours before the end of the current period. Manage subscriptions in app settings.
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 16 },
  section: { marginTop: spacing[5] },
  plansSection: { paddingHorizontal: spacing[5] },
  sectionTitle: { fontSize: 20, fontWeight: fontWeight.bold, marginBottom: spacing[4], paddingHorizontal: spacing[5] },
  faqSection: { paddingHorizontal: spacing[5] },
  faqItem: { padding: spacing[4], borderRadius: 16, marginBottom: spacing[3] },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: fontWeight.semibold, flex: 1, paddingRight: spacing[3] },
  faqIcon: { fontSize: 20, fontWeight: '300' },
  faqAnswer: { fontSize: 14, lineHeight: 20, marginTop: spacing[3] },
  restoreSection: { paddingHorizontal: spacing[5], marginTop: spacing[5] },
  restoreButton: { padding: spacing[4], borderRadius: 16, alignItems: 'center' },
  restoreText: { fontSize: 15, fontWeight: fontWeight.medium },
  termsSection: { paddingHorizontal: spacing[5], marginTop: spacing[4] },
  termsText: { fontSize: 11, textAlign: 'center', lineHeight: 16 },
  bottomSpacer: { height: spacing[8] },
});

PremiumHomeScreen.displayName = 'PremiumHomeScreen';
