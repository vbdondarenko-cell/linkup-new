import React from 'react';
import { StyleSheet, View, Text, Image, ViewProps } from 'react-native';
import { useTheme } from '../../providers/theme-provider';
import { typography } from '../../tokens/typography';

export type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

export interface AvatarProps extends ViewProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  online?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'medium',
  online,
  style,
  ...props
}) => {
  const theme = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return 32;
      case 'large':
        return 56;
      case 'xlarge':
        return 80;
      default:
        return 44;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 12;
      case 'large':
        return 20;
      case 'xlarge':
        return 28;
      default:
        return 16;
    }
  };

  const dimension = getSize();
  const initials = name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?';

  const styles = StyleSheet.create({
    container: {
      width: dimension,
      height: dimension,
      borderRadius: dimension / 2,
      backgroundColor: theme.colors.interactive.primary,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    image: {
      width: dimension,
      height: dimension,
    },
    initials: {
      color: '#FFFFFF',
      fontSize: getFontSize(),
      fontWeight: typography.headline.fontWeight,
    },
    onlineIndicator: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: dimension * 0.3,
      height: dimension * 0.3,
      borderRadius: dimension * 0.15,
      backgroundColor: theme.colors.status.success.light,
      borderWidth: 2,
      borderColor: theme.colors.surface.primary,
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {src ? (
        <Image source={{ uri: src }} style={styles.image} />
      ) : (
        <Text style={styles.initials}>{initials}</Text>
      )}
      {online !== undefined && (
        <View style={styles.onlineIndicator} />
      )}
    </View>
  );
};

export default Avatar;
