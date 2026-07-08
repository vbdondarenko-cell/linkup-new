/**
 * LinkUp Design System 2026
 * List Components - Navigation, Settings, Profile rows
 */

'use client';

import React, { useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';
import { Avatar } from '../avatars';
import { Badge } from '../badges';

export type ListItemVariant = 'default' | 'navigation' | 'settings' | 'profile' | 'chat' | 'event';

interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  leftAvatar?: {
    src?: string;
    name?: string;
  };
  badge?: React.ReactNode;
  chevron?: boolean;
  switch?: {
    value: boolean;
    onValueChange: (value: boolean) => void;
  };
  variant?: ListItemVariant;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  description,
  leftElement,
  rightElement,
  leftAvatar,
  badge,
  chevron = false,
  switch: switchProp,
  variant = 'default',
  onPress,
  disabled = false,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(1);

  const handlePressIn = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const handlePressOut = useCallback(() => {
    if (onPress) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
    }
  }, [onPress, scale]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      haptics.light();
      onPress?.();
    }
  }, [disabled, haptics, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: touchTarget.minimum,
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    backgroundColor: theme.colors.surface.primary,
    opacity: disabled ? 0.5 : 1,
  };

  const getTitleStyle = () => ({
    fontSize: variant === 'profile' ? parseInt(fontSize.headline as string, 10) : parseInt(fontSize.body.md as string, 10),
    fontWeight: fontWeight.medium,
    color: theme.colors.text.primary,
  });

  const getSubtitleStyle = () => ({
    fontSize: parseInt(fontSize.bodySmall as string, 10),
    color: theme.colors.text.secondary,
    marginTop: spacing[0.5],
  });

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!onPress || disabled}
      style={[containerStyle, animatedStyle, style]}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={title}
    >
      {/* Left */}
      <View style={styles.left}>
        {leftAvatar && (
          <Avatar
            src={leftAvatar.src}
            name={leftAvatar.name}
            size="md"
          />
        )}
        {leftElement && <View style={styles.leftElement}>{leftElement}</View>}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={getTitleStyle()} numberOfLines={1}>
            {title}
          </Text>
          {badge && <View style={styles.badge}>{badge}</View>}
        </View>
        {subtitle && (
          <Text style={getSubtitleStyle()} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
        {description && (
          <Text
            style={[
              getSubtitleStyle(),
              { marginTop: spacing[1] },
            ]}
            numberOfLines={2}
          >
            {description}
          </Text>
        )}
      </View>

      {/* Right */}
      <View style={styles.right}>
        {rightElement}
        {switchProp && (
          <Switch
            value={switchProp.value}
            onValueChange={switchProp.onValueChange}
          />
        )}
        {chevron && (
          <Text style={[styles.chevron, { color: theme.colors.text.tertiary }]}>
            ›
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
};

// ============================================
// SWITCH
// ============================================

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const handlePress = () => {
    if (!disabled) {
      haptics.toggleOn();
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.switchTrack,
        {
          width: 51,
          height: 31,
          borderRadius: 15.5,
          backgroundColor: value
            ? theme.colors.interactive.primary
            : theme.colors.surface.tertiary,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <View
        style={[
          styles.switchThumb,
          {
            width: 27,
            height: 27,
            borderRadius: 13.5,
            backgroundColor: '#FFFFFF',
            transform: [{ translateX: value ? 20 : 0 }],
          },
        ]}
      />
    </Pressable>
  );
};

// ============================================
// SECTION LIST
// ============================================

interface SectionListProps {
  title?: string;
  children: React.ReactNode;
  footer?: string;
  style?: ViewStyle;
}

export const SectionList: React.FC<SectionListProps> = ({
  title,
  children,
  footer,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.section, style]}>
      {title && (
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text.secondary,
              paddingHorizontal: spacing[4],
              paddingVertical: spacing[2],
            },
          ]}
        >
          {title.toUpperCase()}
        </Text>
      )}
      <View
        style={[
          styles.sectionContent,
          {
            backgroundColor: theme.colors.surface.primary,
            borderRadius: theme.radius.component.card,
            marginHorizontal: spacing[4],
          },
        ]}
      >
        {children}
      </View>
      {footer && (
        <Text
          style={[
            styles.sectionFooter,
            {
              color: theme.colors.text.tertiary,
              paddingHorizontal: spacing[4],
              paddingTop: spacing[2],
            },
          ]}
        >
          {footer}
        </Text>
      )}
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  left: {
    marginRight: spacing[3],
  },
  leftElement: {},
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    marginLeft: spacing[2],
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing[2],
  },
  chevron: {
    fontSize: 24,
    fontWeight: '300',
    marginLeft: spacing[1],
  },
  switchTrack: {
    justifyContent: 'center',
    padding: 2,
  },
  switchThumb: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  section: {
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  sectionContent: {
    overflow: 'hidden',
  },
  sectionFooter: {
    fontSize: 12,
  },
});

ListItem.displayName = 'ListItem';
Switch.displayName = 'Switch';
SectionList.displayName = 'SectionList';
