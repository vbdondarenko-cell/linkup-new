/**
 * LinkUp Design System 2026
 * Avatar Component - Image, Initials, Fallback, Rings, Status
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { spacing } from '../../tokens/spacing';
import { fontWeight } from '../../tokens/typography';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';
export type AvatarRing = 'verified' | 'premium' | 'organizer' | 'business';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarRing;
  presence?: AvatarStatus;
  onPress?: () => void;
  style?: ViewStyle;
}

const sizeMap: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 72,
  '2xl': 96,
};

const fontSizeMap: Record<AvatarSize, number> = {
  xs: 10,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
  '2xl': 36,
};

const statusSizeMap: Record<AvatarSize, number> = {
  xs: 8,
  sm: 10,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
};

const ringWidthMap: Record<AvatarSize, number> = {
  xs: 2,
  sm: 2,
  md: 2,
  lg: 3,
  xl: 3,
  '2xl': 4,
};

const presenceColors = {
  online: '#10B981',
  offline: '#737373',
  busy: '#EF4444',
  away: '#F59E0B',
};

const ringColors = {
  verified: '#3B82F6',
  premium: '#F59E0B',
  organizer: '#A855F7',
  business: '#3B82F6',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  presence,
  onPress,
  style,
}) => {
  const theme = useTheme();

  const [imageError, setImageError] = useState(false);

  const avatarSize = sizeMap[size];
  const fontSize = fontSizeMap[size];
  const statusSize = statusSizeMap[size];
  const ringWidth = ringWidthMap[size];

  const getInitials = useCallback((name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }, []);

  const getBackgroundColor = useCallback((name: string): string => {
    const colors = [
      theme.colors.brand.primary[500],
      theme.colors.brand.secondary[500],
      theme.colors.brand.accent[500],
      '#6366F1',
      '#8B5CF6',
      '#EC4899',
      '#F59E0B',
      '#10B981',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  }, [theme]);

  const initials = name ? getInitials(name) : '?';
  const backgroundColor = name ? getBackgroundColor(name) : theme.colors.surface.tertiary;

  const hasImage = src && !imageError;

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
  };

  const ringStyle: ViewStyle | undefined = status ? {
    position: 'absolute',
    top: -ringWidth,
    left: -ringWidth,
    right: -ringWidth,
    bottom: -ringWidth,
    borderRadius: (avatarSize + ringWidth * 2) / 2,
    borderWidth: ringWidth,
    borderColor: ringColors[status],
  } : undefined;

  const presenceStyle: ViewStyle | undefined = presence ? {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: statusSize,
    height: statusSize,
    borderRadius: statusSize / 2,
    backgroundColor: presenceColors[presence],
    borderWidth: 2,
    borderColor: theme.colors.surface.primary,
  } : undefined;

  const content = (
    <View style={[styles.container, containerStyle, style]}>
      {/* Ring */}
      {ringStyle && <View style={ringStyle} />}

      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
            backgroundColor: hasImage ? 'transparent' : backgroundColor,
          },
        ]}
      >
        {hasImage ? (
          <Image
            source={{ uri: src }}
            style={[
              styles.image,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
              },
            ]}
            onError={() => setImageError(true)}
          />
        ) : (
          <Text
            style={[
              styles.initials,
              {
                fontSize,
                fontWeight: fontWeight.semibold,
                color: '#FFFFFF',
              },
            ]}
          >
            {initials}
          </Text>
        )}
      </View>

      {/* Presence Indicator */}
      {presenceStyle && <View style={presenceStyle} />}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          { opacity: pressed ? 0.8 : 1 },
        ]}
        accessibilityRole="button"
        accessibilityLabel={name ? `Avatar of ${name}` : 'Avatar'}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

// Avatar Group Component
interface AvatarGroupProps {
  avatars: Array<{
    src?: string;
    name?: string;
  }>;
  max?: number;
  size?: AvatarSize;
  overlap?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  max = 4,
  size = 'md',
  overlap = 'md',
}) => {
  const theme = useTheme();
  const avatarSize = sizeMap[size];
  
  const overlapValues = {
    sm: avatarSize * 0.3,
    md: avatarSize * 0.4,
    lg: avatarSize * 0.5,
  };
  
  const overlapValue = overlapValues[overlap];
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <View
      style={[
        styles.groupContainer,
        { height: avatarSize, paddingLeft: overlapValue },
      ]}
    >
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupItem,
            {
              marginLeft: -overlapValue,
              zIndex: max - index,
            },
          ]}
        >
          <Avatar src={avatar.src} name={avatar.name} size={size} />
        </View>
      ))}
      
      {remainingCount > 0 && (
        <View
          style={[
            styles.groupItem,
            {
              marginLeft: -overlapValue,
              zIndex: 0,
            },
          ]}
        >
          <View
            style={[
              styles.remainingBadge,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: theme.colors.surface.tertiary,
              },
            ]}
          >
            <Text
              style={[
                styles.remainingText,
                {
                  fontSize: fontSizeMap[size] * 0.8,
                  color: theme.colors.text.secondary,
                },
              ]}
            >
              +{remainingCount}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    textAlign: 'center',
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupItem: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 999,
  },
  remainingBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  remainingText: {
    fontWeight: '600',
  },
});

Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';
