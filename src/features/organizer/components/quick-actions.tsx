/**
 * LinkUp Design System 2026
 * Organizer Dashboard - Quick Actions Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { QuickAction } from '../types';

interface QuickActionsProps {
  actions: QuickAction[];
  onActionPress: (action: QuickAction) => void;
  style?: ViewStyle;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  onActionPress,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handlePress = (action: QuickAction) => {
    haptics.light();
    onActionPress(action);
  };

  return (
    <Animated.View 
      entering={FadeInUp.delay(300).springify()} 
      style={style}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Quick Actions
      </Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.actionsContainer}
      >
        {actions.map((action, index) => (
          <Animated.View
            key={action.id}
            entering={FadeInDown.delay(350 + index * 50).springify()}
          >
            <Pressable
              onPress={() => handlePress(action)}
              style={({ pressed }) => [
                styles.actionItem,
                {
                  backgroundColor: theme.colors.surface.primary,
                  borderRadius: theme.radius.component.lg,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }],
                },
              ]}
            >
              <View style={[styles.iconContainer, { backgroundColor: `${action.color}15` }]}>
                <Text style={styles.icon}>{action.icon}</Text>
              </View>
              <Text style={[styles.actionLabel, { color: theme.colors.text.primary }]}>
                {action.label}
              </Text>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

// Default actions
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  { id: 'create', label: 'Create Event', icon: '➕', color: '#3B82F6', action: 'create' },
  { id: 'duplicate', label: 'Duplicate', icon: '📋', color: '#8B5CF6', action: 'duplicate' },
  { id: 'calendar', label: 'Calendar', icon: '📅', color: '#10B981', action: 'calendar' },
  { id: 'requests', label: 'Requests', icon: '👥', color: '#F59E0B', action: 'requests' },
  { id: 'analytics', label: 'Analytics', icon: '📊', color: '#EC4899', action: 'analytics' },
  { id: 'templates', label: 'Templates', icon: '📝', color: '#6366F1', action: 'templates' },
];

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[4],
    paddingHorizontal: spacing[5],
  },
  actionsContainer: {
    paddingHorizontal: spacing[5],
    gap: spacing[3],
  },
  actionItem: {
    alignItems: 'center',
    padding: spacing[3],
    minWidth: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  icon: {
    fontSize: 24,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
});

QuickActions.displayName = 'QuickActions';
