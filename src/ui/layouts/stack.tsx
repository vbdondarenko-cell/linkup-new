import React from 'react';
import { StyleSheet, View, ViewProps, StyleProp, ViewStyle } from 'react-native';
import { spacing } from '../tokens/spacing';

export interface VStackProps extends ViewProps {
  gap?: keyof typeof spacing;
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export const VStack: React.FC<VStackProps> = ({
  gap = 4,
  align = 'stretch',
  justify = 'flex-start',
  style,
  children,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      alignItems: align,
      justifyContent: justify,
      gap: spacing[gap],
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

export interface HStackProps extends ViewProps {
  gap?: keyof typeof spacing;
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
}

export const HStack: React.FC<HStackProps> = ({
  gap = 4,
  align = 'center',
  justify = 'flex-start',
  style,
  children,
  ...props
}) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: align,
      justifyContent: justify,
      gap: spacing[gap],
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

export default { VStack, HStack };
