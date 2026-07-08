/**
 * LinkUp Design System 2026
 * Premium - Comparison Table Component
 */

'use client';

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../../ui/providers/theme-provider';
import { spacing } from '../../../ui/tokens/spacing';
import { fontSize, fontWeight } from '../../../ui/tokens/typography';
import { ComparisonFeature } from '../types';

interface ComparisonTableProps {
  features: ComparisonFeature[];
  style?: ViewStyle;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  features,
  style,
}) => {
  const theme = useTheme();

  const renderCell = (value: boolean | string, isPremium: boolean) => {
    if (typeof value === 'boolean') {
      return (
        <View style={styles.checkContainer}>
          {value ? (
            <Text style={[styles.checkIcon, { color: isPremium ? '#FFD700' : '#10B981' }]}>✓</Text>
          ) : (
            <Text style={[styles.crossIcon, { color: theme.colors.text.tertiary }]}>—</Text>
          )}
        </View>
      );
    }
    return (
      <Text style={[styles.cellText, { color: theme.colors.text.secondary }]}>
        {value}
      </Text>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Free vs Premium
      </Text>

      {/* Header */}
      <View style={[styles.headerRow, { backgroundColor: theme.colors.surface.primary }]}>
        <View style={styles.featureHeaderCell}>
          <Text style={[styles.headerText, { color: theme.colors.text.tertiary }]}>
            Feature
          </Text>
        </View>
        <View style={[styles.planHeaderCell, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={[styles.headerText, { color: theme.colors.text.secondary }]}>
            Free
          </Text>
        </View>
        <View style={[styles.planHeaderCell, { backgroundColor: '#FFD70015' }]}>
          <Text style={[styles.headerText, { color: '#FFD700' }]}>
            ⭐ Premium
          </Text>
        </View>
      </View>

      {/* Feature Rows */}
      {features.map((feature, index) => (
        <Animated.View
          key={feature.id}
          entering={FadeInUp.delay(100 + index * 50)}
          style={[
            styles.featureRow,
            { backgroundColor: index % 2 === 0 ? theme.colors.surface.primary : theme.colors.surface.secondary },
          ]}
        >
          <View style={styles.featureCell}>
            <Text style={[styles.featureName, { color: theme.colors.text.primary }]}>
              {feature.name}
            </Text>
          </View>
          <View style={styles.valueCell}>
            {renderCell(feature.free, false)}
          </View>
          <View style={[styles.valueCell, { backgroundColor: '#FFD70008' }]}>
            {renderCell(feature.premium, true)}
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

// Compact Comparison Component
interface CompactComparisonProps {
  features: ComparisonFeature[];
  style?: ViewStyle;
}

export const CompactComparison: React.FC<CompactComparisonProps> = ({
  features,
  style,
}) => {
  const theme = useTheme();

  return (
    <View style={[styles.compactContainer, style]}>
      {/* Free Column */}
      <View style={styles.compactColumn}>
        <View style={[styles.compactHeader, { backgroundColor: theme.colors.surface.secondary }]}>
          <Text style={[styles.compactHeaderText, { color: theme.colors.text.secondary }]}>
            Free
          </Text>
        </View>
        {features.slice(0, 4).map((feature) => (
          <View key={feature.id} style={styles.compactRow}>
            <Text style={styles.compactCheck}>
              {typeof feature.free === 'boolean' && feature.free ? '✓' : '—'}
            </Text>
            <Text style={[styles.compactText, { color: theme.colors.text.primary }]}>
              {feature.name}
            </Text>
          </View>
        ))}
      </View>

      {/* Premium Column */}
      <View style={[styles.compactColumn, { backgroundColor: '#FFD70008' }]}>
        <View style={[styles.compactHeader, { backgroundColor: '#FFD70015' }]}>
          <Text style={[styles.compactHeaderText, { color: '#FFD700' }]}>
            ⭐ Premium
          </Text>
        </View>
        {features.slice(0, 4).map((feature) => (
          <View key={feature.id} style={styles.compactRow}>
            <Text style={styles.compactCheck}>
              {typeof feature.premium === 'boolean' && feature.premium ? '✓' : '—'}
            </Text>
            <Text style={[styles.compactText, { color: theme.colors.text.primary }]}>
              {feature.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[5],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: fontWeight.bold,
    marginBottom: spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing[2],
  },
  featureHeaderCell: {
    flex: 2,
    padding: spacing[3],
  },
  planHeaderCell: {
    flex: 1,
    padding: spacing[3],
    alignItems: 'center',
  },
  headerText: {
    fontSize: 13,
    fontWeight: fontWeight.semibold,
  },
  featureRow: {
    flexDirection: 'row',
    paddingVertical: spacing[2],
  },
  featureCell: {
    flex: 2,
    padding: spacing[3],
  },
  featureName: {
    fontSize: 14,
  },
  valueCell: {
    flex: 1,
    padding: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: 18,
    fontWeight: fontWeight.bold,
  },
  crossIcon: {
    fontSize: 18,
  },
  cellText: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing[5],
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactColumn: {
    flex: 1,
  },
  compactHeader: {
    padding: spacing[3],
    alignItems: 'center',
  },
  compactHeaderText: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[2],
    paddingHorizontal: spacing[3],
    gap: spacing[2],
  },
  compactCheck: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: fontWeight.bold,
    width: 16,
  },
  compactText: {
    fontSize: 12,
    flex: 1,
  },
});

ComparisonTable.displayName = 'ComparisonTable';
CompactComparison.displayName = 'CompactComparison';
