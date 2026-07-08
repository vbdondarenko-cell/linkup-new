/**
 * LinkUp Design System 2026
 * Settings - Row Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable, Switch, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { useHaptics } from '../../../ui/hooks/use-haptics';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SettingsRowProps {
  icon?: string;
  title: string;
  subtitle?: string;
  value?: string;
  showArrow?: boolean;
  showSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  isDestructive?: boolean;
  isPremium?: boolean;
  badge?: string;
  leftImage?: string;
  rightImage?: string;
  style?: ViewStyle;
}

export const SettingsRow: React.FC<SettingsRowProps> = ({
  icon,
  title,
  subtitle,
  value,
  showArrow = false,
  showSwitch = false,
  switchValue = false,
  onSwitchChange,
  onPress,
  isDestructive = false,
  isPremium = false,
  badge,
  leftImage,
  rightImage,
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
    onPress?.();
  };

  const handleSwitchChange = (newValue: boolean) => {
    haptics.light();
    onSwitchChange?.(newValue);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const titleColor = isDestructive ? '#EF4444' : theme.colors.text.primary;

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={showSwitch}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface.primary },
        animatedStyle,
        style,
      ]}
    >
      {/* Left Side */}
      <View style={styles.leftSide}>
        {icon && (
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary.DEFAULT}15` }]}>
            <Text style={styles.icon}>{icon}</Text>
          </View>
        )}
        {leftImage && (
          <Image source={{ uri: leftImage }} style={styles.leftImage} />
        )}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1}>
              {title}
            </Text>
            {isPremium && (
              <View style={[styles.premiumBadge, { backgroundColor: '#FFD70015' }]}>
                <Text style={styles.premiumIcon}>⭐</Text>
              </View>
            )}
            {badge && (
              <View style={[styles.badge, { backgroundColor: `${theme.colors.primary.DEFAULT}15` }]}>
                <Text style={[styles.badgeText, { color: theme.colors.primary.DEFAULT }]}>
                  {badge}
                </Text>
              </View>
            )}
          </View>
          {subtitle && (
            <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.rightSide}>
        {value && (
          <Text style={[styles.value, { color: theme.colors.text.tertiary }]}>
            {value}
          </Text>
        )}
        {rightImage && (
          <Image source={{ uri: rightImage }} style={styles.rightImage} />
        )}
        {showSwitch && (
          <Switch
            value={switchValue}
            onValueChange={handleSwitchChange}
            trackColor={{ false: theme.colors.surface.secondary, true: '#FFD700' }}
            thumbColor="#FFFFFF"
          />
        )}
        {showArrow && (
          <Text style={[styles.arrow, { color: theme.colors.text.tertiary }]}>→</Text>
        )}
      </View>
    </AnimatedPressable>
  );
};

// Divider Component
interface SettingsDividerProps {
  inset?: boolean;
  style?: ViewStyle;
}

export const SettingsDivider: React.FC<SettingsDividerProps> = ({
  inset = false,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <View 
      style={[
        styles.divider,
        { backgroundColor: theme.colors.border.default },
        inset && styles.dividerInset,
        style,
      ]} 
    />
  );
};

// Section Header Component
interface SettingsSectionHeaderProps {
  title: string;
  style?: ViewStyle;
}

export const SettingsSectionHeader: React.FC<SettingsSectionHeaderProps> = ({
  title,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <Text style={[styles.sectionHeader, { color: theme.colors.text.tertiary }, style]}>
      {title}
    </Text>
  );
};

// Settings Group Component
interface SettingsGroupProps {
  children: React.ReactNode;
  inset?: boolean;
  style?: ViewStyle;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  children,
  inset = false,
  style,
}) => {
  const theme = useTheme();
  
  return (
    <View 
      style={[
        styles.group,
        { backgroundColor: theme.colors.surface.primary, borderRadius: theme.radius.component.lg },
        inset && styles.groupInset,
        style,
      ]}
    >
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index < React.Children.count(children) - 1 && <SettingsDivider />}
        </>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    minHeight: 56,
  },
  leftSide: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  icon: {
    fontSize: 18,
  },
  leftImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing[3],
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  title: {
    fontSize: 16,
    fontWeight: fontWeight.medium,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  premiumBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 10,
  },
  badge: {
    paddingHorizontal: spacing[2],
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: fontWeight.semibold,
  },
  rightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginLeft: spacing[2],
  },
  value: {
    fontSize: 15,
  },
  rightImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  arrow: {
    fontSize: 16,
    marginLeft: spacing[1],
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing[4] + 32 + spacing[3],
  },
  dividerInset: {
    marginLeft: spacing[4],
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing[5],
    marginBottom: spacing[2],
    marginLeft: spacing[5],
  },
  group: {
    overflow: 'hidden',
  },
  groupInset: {
    marginHorizontal: spacing[5],
  },
});

SettingsRow.displayName = 'SettingsRow';
SettingsDivider.displayName = 'SettingsDivider';
SettingsSectionHeader.displayName = 'SettingsSectionHeader';
SettingsGroup.displayName = 'SettingsGroup';
