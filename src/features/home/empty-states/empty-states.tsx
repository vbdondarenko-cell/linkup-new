/**
 * LinkUp Design System 2026
 * Empty States - Beautiful no-content scenarios
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../ui/providers/theme-provider';
import { spacing } from '../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../ui/tokens/typography';
import { Button } from '../../ui/components/buttons';

// ============================================
// BASE EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.container, style]}>
      {/* Icon */}
      <Text style={styles.icon}>{icon}</Text>

      {/* Title */}
      <Text
        style={[
          styles.title,
          {
            fontSize: parseInt(fontSize.title.md as string, 10),
            fontWeight: fontWeight.semibold,
            color: theme.colors.text.primary,
          },
        ]}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          style={[
            styles.description,
            {
              fontSize: parseInt(fontSize.body.md as string, 10),
              color: theme.colors.text.secondary,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {/* Actions */}
      {(primaryAction || secondaryAction) && (
        <View style={styles.actions}>
          {primaryAction && (
            <Button
              variant="primary"
              onPress={primaryAction.onPress}
              style={styles.primaryAction}
            >
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="tertiary"
              onPress={secondaryAction.onPress}
              style={styles.secondaryAction}
            >
              {secondaryAction.label}
            </Button>
          )}
        </View>
      )}
    </View>
  );
};

// ============================================
// NO EVENTS NEARBY
// ============================================

interface NoEventsEmptyProps {
  onCreateEvent?: () => void;
  onExpandRadius?: () => void;
  onExploreCategories?: () => void;
  style?: ViewStyle;
}

export const NoEventsEmpty: React.FC<NoEventsEmptyProps> = ({
  onCreateEvent,
  onExpandRadius,
  onExploreCategories,
  style,
}) => {
  return (
    <EmptyState
      icon="🎉"
      title="No events nearby"
      description="Be the first to create an event in this area!"
      primaryAction={
        onCreateEvent
          ? { label: 'Create Event', onPress: onCreateEvent }
          : undefined
      }
      secondaryAction={
        onExpandRadius
          ? { label: 'Expand Radius', onPress: onExpandRadius }
          : undefined
      }
      style={style}
    />
  );
};

// ============================================
// NO SEARCH RESULTS
// ============================================

interface NoSearchResultsEmptyProps {
  query: string;
  onClearSearch?: () => void;
  onCreateEvent?: () => void;
  style?: ViewStyle;
}

export const NoSearchResultsEmpty: React.FC<NoSearchResultsEmptyProps> = ({
  query,
  onClearSearch,
  onCreateEvent,
  style,
}) => {
  return (
    <EmptyState
      icon="🔍"
      title={`No results for "${query}"`}
      description="Try a different search or create an event for this topic."
      primaryAction={
        onCreateEvent
          ? { label: 'Create Event', onPress: onCreateEvent }
          : undefined
      }
      secondaryAction={
        onClearSearch
          ? { label: 'Clear Search', onPress: onClearSearch }
          : undefined
      }
      style={style}
    />
  );
};

// ============================================
// OFFLINE BANNER
// ============================================

interface OfflineBannerProps {
  isVisible: boolean;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isVisible,
  onRetry,
  style,
}) => {
  const theme = useTheme();

  if (!isVisible) return null;

  return (
    <View
      style={[
        styles.offlineBanner,
        {
          backgroundColor: theme.colors.status.warning.bg,
          borderBottomColor: theme.colors.status.warning.border,
        },
        style,
      ]}
    >
      <Text style={styles.offlineIcon}>📡</Text>
      <Text
        style={[
          styles.offlineText,
          { color: theme.colors.status.warning.text },
        ]}
      >
        You're offline. Some features may be limited.
      </Text>
      {onRetry && (
        <Button
          variant="tertiary"
          size="sm"
          onPress={onRetry}
          style={styles.retryButton}
        >
          Retry
        </Button>
      )}
    </View>
  );
};

// ============================================
// LOCATION DISABLED
// ============================================

interface LocationDisabledEmptyProps {
  onEnableLocation?: () => void;
  onSearchManually?: () => void;
  style?: ViewStyle;
}

export const LocationDisabledEmpty: React.FC<LocationDisabledEmptyProps> = ({
  onEnableLocation,
  onSearchManually,
  style,
}) => {
  return (
    <EmptyState
      icon="📍"
      title="Location access needed"
      description="Enable location to discover events happening around you."
      primaryAction={
        onEnableLocation
          ? { label: 'Enable Location', onPress: onEnableLocation }
          : undefined
      }
      secondaryAction={
        onSearchManually
          ? { label: 'Search Manually', onPress: onSearchManually }
          : undefined
      }
      style={style}
    />
  );
};

// ============================================
// PERMISSION MISSING
// ============================================

interface PermissionMissingEmptyProps {
  permission: string;
  onGrantPermission?: () => void;
  onSkip?: () => void;
  style?: ViewStyle;
}

export const PermissionMissingEmpty: React.FC<PermissionMissingEmptyProps> = ({
  permission,
  onGrantPermission,
  onSkip,
  style,
}) => {
  return (
    <EmptyState
      icon="🔒"
      title={`${permission} access required`}
      description={`LinkUp needs ${permission.toLowerCase()} access to provide the best experience.`}
      primaryAction={
        onGrantPermission
          ? { label: 'Grant Access', onPress: onGrantPermission }
          : undefined
      }
      secondaryAction={
        onSkip ? { label: 'Skip for Now', onPress: onSkip } : undefined
      }
      style={style}
    />
  );
};

// ============================================
// PREMIUM REQUIRED
// ============================================

interface PremiumRequiredEmptyProps {
  featureName: string;
  onUpgrade?: () => void;
  onMaybeLater?: () => void;
  style?: ViewStyle;
}

export const PremiumRequiredEmpty: React.FC<PremiumRequiredEmptyProps> = ({
  featureName,
  onUpgrade,
  onMaybeLater,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.premiumContainer, style]}>
      <Text style={styles.premiumIcon}>⭐</Text>
      <Text
        style={[
          styles.premiumTitle,
          {
            fontSize: parseInt(fontSize.title.md as string, 10),
            fontWeight: fontWeight.semibold,
            color: theme.colors.text.primary,
          },
        ]}
      >
        {featureName} is a Premium Feature
      </Text>
      <Text
        style={[
          styles.premiumDescription,
          {
            fontSize: parseInt(fontSize.body.md as string, 10),
            color: theme.colors.text.secondary,
          },
        ]}
      >
        Upgrade to Premium to unlock this and many other exclusive features.
      </Text>
      <View style={styles.premiumActions}>
        {onUpgrade && (
          <Button
            variant="primary"
            onPress={onUpgrade}
            style={styles.premiumButton}
          >
            Upgrade to Premium
          </Button>
        )}
        {onMaybeLater && (
          <Button variant="tertiary" onPress={onMaybeLater}>
            Maybe Later
          </Button>
        )}
      </View>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing[6],
    maxWidth: 280,
  },
  actions: {
    alignItems: 'center',
    gap: spacing[3],
  },
  primaryAction: {
    minWidth: 160,
  },
  secondaryAction: {},
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    borderBottomWidth: 1,
  },
  offlineIcon: {
    fontSize: 18,
    marginRight: spacing[2],
  },
  offlineText: {
    flex: 1,
    fontSize: 14,
  },
  retryButton: {
    marginLeft: spacing[3],
  },
  premiumContainer: {
    alignItems: 'center',
    padding: spacing[8],
  },
  premiumIcon: {
    fontSize: 80,
    marginBottom: spacing[4],
  },
  premiumTitle: {
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  premiumDescription: {
    textAlign: 'center',
    marginBottom: spacing[6],
    maxWidth: 280,
  },
  premiumActions: {
    alignItems: 'center',
    gap: spacing[3],
  },
  premiumButton: {
    minWidth: 200,
  },
});

EmptyState.displayName = 'EmptyState';
NoEventsEmpty.displayName = 'NoEventsEmpty';
NoSearchResultsEmpty.displayName = 'NoSearchResultsEmpty';
OfflineBanner.displayName = 'OfflineBanner';
LocationDisabledEmpty.displayName = 'LocationDisabledEmpty';
PermissionMissingEmpty.displayName = 'PermissionMissingEmpty';
PremiumRequiredEmpty.displayName = 'PremiumRequiredEmpty';
