import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../../ui/providers/theme-provider';
import { typography } from '../../../../ui/tokens/typography';
import { spacing } from '../../../../ui/tokens/spacing';
import { Avatar, Badge } from '../../../../ui/components/base';
import { HStack } from '../../../../ui/layouts/stack';
import { UserLocation } from '../../types';

export interface HomeHeaderProps {
  location: UserLocation | null;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
  userAvatarUrl?: string;
  userName?: string;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  location,
  notificationCount = 0,
  onNotificationPress,
  onProfilePress,
  userAvatarUrl,
  userName,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, []);

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: insets.top + spacing[2],
      left: spacing[4],
      right: spacing[4],
      zIndex: 20,
    },
    content: {
      backgroundColor: theme.colors.surface.elevated,
      borderRadius: theme.radius.component.card,
      padding: spacing[3],
      shadowColor: '#000',
      ...theme.shadows.component.md,
    },
    topRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    greeting: {
      ...typography.headline,
      color: theme.colors.text.secondary,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: spacing[1],
    },
    locationIcon: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.colors.status.success.light,
      marginRight: spacing[1],
    },
    city: {
      ...typography.title2,
      color: theme.colors.text.primary,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing[3],
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface.secondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
    },
    notificationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.colors.status.danger.light,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <View style={styles.locationRow}>
              <View style={styles.locationIcon} />
              <Text style={styles.city}>
                {location?.city || 'Detecting location...'}
              </Text>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              style={styles.iconButton}
              onPress={onNotificationPress}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
            >
              <Text>🔔</Text>
              {notificationCount > 0 && (
                <View style={styles.notificationBadge}>
                  <View style={styles.notificationDot} />
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={onProfilePress}
              accessibilityLabel="Profile"
              accessibilityRole="button"
            >
              <Avatar
                src={userAvatarUrl}
                name={userName || 'User'}
                size="small"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeader;
