/**
 * LinkUp Design System 2026
 * Premium Settings Screen
 */

'use client';

import React from 'react';
import { View, Text, ScrollView, StyleSheet, ViewStyle, Pressable, Switch } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { usePremiumState } from '../hooks';
import { ThemeSelector } from '../components';

interface PremiumSettingsScreenProps {
  onManageSubscription?: () => void;
  onRestorePurchase?: () => void;
  onContactSupport?: () => void;
  style?: ViewStyle;
}

export const PremiumSettingsScreen: React.FC<PremiumSettingsScreenProps> = ({
  onManageSubscription,
  onRestorePurchase,
  onContactSupport,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();
  const {
    isPremium,
    subscription,
    currentTheme,
    themes,
    setTheme,
  } = usePremiumState();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = () => {
    if (!subscription) return null;
    if (subscription.status === 'active') {
      return { label: 'Active', color: '#10B981' };
    }
    return { label: 'Expired', color: '#EF4444' };
  };

  const statusBadge = getStatusBadge();

  return (
    <Animated.View entering={FadeIn} style={[styles.container, { backgroundColor: theme.colors.background.secondary }, style]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.surface.primary }]}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            Premium Settings
          </Text>
          {isPremium && (
            <View style={[styles.premiumBadge, { backgroundColor: '#FFD70015' }]}>
              <Text style={styles.premiumIcon}>⭐</Text>
              <Text style={[styles.premiumText, { color: '#FFD700' }]}>Premium</Text>
            </View>
          )}
        </View>

        {/* Current Plan */}
        {subscription && (
          <Animated.View entering={FadeInDown.delay(100)}>
            <Pressable
              onPress={() => { haptics.light(); onManageSubscription?.(); }}
              style={[styles.settingCard, { backgroundColor: theme.colors.surface.primary }]}
            >
              <View style={styles.settingIcon}>
                <Text style={styles.iconEmoji}>📋</Text>
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
                  Current Plan
                </Text>
                <Text style={[styles.settingSubtitle, { color: theme.colors.text.secondary }]}>
                  {subscription.planId === 'monthly' ? 'Monthly' : 'Yearly'}
                </Text>
              </View>
              <View style={styles.settingRight}>
                {statusBadge && (
                  <View style={[styles.statusBadge, { backgroundColor: `${statusBadge.color}15` }]}>
                    <Text style={[styles.statusText, { color: statusBadge.color }]}>
                      {statusBadge.label}
                    </Text>
                  </View>
                )}
                <Text style={[styles.settingArrow, { color: theme.colors.text.tertiary }]}>→</Text>
              </View>
            </Pressable>
          </Animated.View>
        )}

        {/* Theme */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.themeSection}>
          <ThemeSelector
            themes={themes}
            currentTheme={currentTheme}
            isPremium={isPremium}
            onSelectTheme={setTheme}
          />
        </Animated.View>

        {/* Notifications */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Notifications
          </Text>
          
          <View style={[styles.card, { backgroundColor: theme.colors.surface.primary }]}>
            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleTitle, { color: theme.colors.text.primary }]}>
                  Expiration Reminders
                </Text>
                <Text style={[styles.toggleSubtitle, { color: theme.colors.text.tertiary }]}>
                  Get notified before Premium expires
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: theme.colors.surface.secondary, true: '#FFD700' }}
                thumbColor="#FFFFFF"
              />
            </View>
            
            <View style={[styles.divider, { backgroundColor: theme.colors.border.default }]} />
            
            <View style={styles.toggleRow}>
              <View>
                <Text style={[styles.toggleTitle, { color: theme.colors.text.primary }]}>
                  Reward Reminders
                </Text>
                <Text style={[styles.toggleSubtitle, { color: theme.colors.text.tertiary }]}>
                  Get notified when rewards are available
                </Text>
              </View>
              <Switch
                value={true}
                trackColor={{ false: theme.colors.surface.secondary, true: '#FFD700' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Account
          </Text>
          
          <Pressable
            onPress={() => { haptics.light(); onRestorePurchase?.(); }}
            style={[styles.actionCard, { backgroundColor: theme.colors.surface.primary }]}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.iconEmoji}>🔄</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>
                Restore Purchase
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
                Recover your subscription on this device
              </Text>
            </View>
            <Text style={[styles.actionArrow, { color: theme.colors.text.tertiary }]}>→</Text>
          </Pressable>
          
          <Pressable
            onPress={() => { haptics.light(); onContactSupport?.(); }}
            style={[styles.actionCard, { backgroundColor: theme.colors.surface.primary }]}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.iconEmoji}>💬</Text>
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: theme.colors.text.primary }]}>
                Contact Support
              </Text>
              <Text style={[styles.actionSubtitle, { color: theme.colors.text.secondary }]}>
                Get help with your subscription
              </Text>
            </View>
            <Text style={[styles.actionArrow, { color: theme.colors.text.tertiary }]}>→</Text>
          </Pressable>
        </Animated.View>

        {/* Subscription Info */}
        {subscription && (
          <Animated.View entering={FadeInDown.delay(300)} style={styles.infoSection}>
            <Text style={[styles.infoText, { color: theme.colors.text.tertiary }]}>
              {subscription.autoRenew ? 'Auto-renews' : 'Does not auto-renew'} on {formatDate(subscription.nextPaymentAt || subscription.expiresAt || new Date())}
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.text.tertiary }]}>
              Payment method: {subscription.paymentMethod}
            </Text>
          </Animated.View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: spacing[5], paddingTop: spacing[6] },
  title: { fontSize: 28, fontWeight: fontWeight.bold },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing[3], paddingVertical: spacing[1], borderRadius: 12, marginTop: spacing[2], gap: 4 },
  premiumIcon: { fontSize: 14 },
  premiumText: { fontSize: 13, fontWeight: fontWeight.semibold },
  settingCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing[5], padding: spacing[4], borderRadius: 16, marginBottom: spacing[3] },
  settingIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  iconEmoji: { fontSize: 22 },
  settingContent: { flex: 1, marginLeft: spacing[3] },
  settingTitle: { fontSize: 15, fontWeight: fontWeight.semibold },
  settingSubtitle: { fontSize: 13, marginTop: 2 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  statusBadge: { paddingHorizontal: spacing[2], paddingVertical: spacing[1], borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: fontWeight.semibold },
  settingArrow: { fontSize: 18 },
  themeSection: { marginBottom: spacing[3] },
  section: { paddingHorizontal: spacing[5], marginBottom: spacing[4] },
  sectionTitle: { fontSize: 18, fontWeight: fontWeight.bold, marginBottom: spacing[3] },
  card: { borderRadius: 16, padding: spacing[4] },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleTitle: { fontSize: 15, fontWeight: fontWeight.medium },
  toggleSubtitle: { fontSize: 13, marginTop: 2 },
  divider: { height: 1, marginVertical: spacing[3] },
  actionCard: { flexDirection: 'row', alignItems: 'center', padding: spacing[4], borderRadius: 16, marginBottom: spacing[3] },
  actionIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(59, 130, 246, 0.1)', alignItems: 'center', justifyContent: 'center' },
  actionContent: { flex: 1, marginLeft: spacing[3] },
  actionTitle: { fontSize: 15, fontWeight: fontWeight.semibold },
  actionSubtitle: { fontSize: 13, marginTop: 2 },
  actionArrow: { fontSize: 18 },
  infoSection: { paddingHorizontal: spacing[5], alignItems: 'center' },
  infoText: { fontSize: 12, textAlign: 'center', marginBottom: spacing[1] },
  bottomSpacer: { height: spacing[8] },
});

PremiumSettingsScreen.displayName = 'PremiumSettingsScreen';
