import React from 'react';
import { StyleSheet, View, Text, ViewProps } from 'react-native';
import { useTheme } from '../providers/theme-provider';
import { typography } from '../tokens/typography';
import { spacing } from '../tokens/spacing';
import { HStack } from './stack';

export interface SectionProps extends ViewProps {
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
  noPadding?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  headerRight,
  noPadding = false,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    section: {
      marginBottom: spacing[6],
    },
    header: {
      paddingHorizontal: noPadding ? 0 : spacing[4],
      marginBottom: spacing[3],
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      ...typography.headline,
      color: theme.colors.text.primary,
    },
    subtitle: {
      ...typography.bodySmall,
      color: theme.colors.text.secondary,
      marginTop: spacing[1],
    },
    content: {
      ...(noPadding ? {} : { paddingHorizontal: spacing[4] }),
    },
  });

  return (
    <View style={[styles.section, style]} {...props}>
      {(title || subtitle || headerRight) && (
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            {headerRight}
          </View>
        </View>
      )}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default Section;
