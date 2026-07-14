import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '../../../providers/theme-provider';

export interface DividerProps extends ViewProps {
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'small' | 'medium' | 'large';
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  spacing: spacingSize = 'medium',
  style,
  ...props
}) => {
  const theme = useTheme();

  const spacingValue = (() => {
    switch (spacingSize) {
      case 'none':
        return 0;
      case 'small':
        return 8;
      case 'large':
        return 24;
      default:
        return 16;
    }
  })();

  const styles = StyleSheet.create({
    divider: {
      backgroundColor: theme.colors.divider.default,
      ...(orientation === 'horizontal'
        ? { height: 1, width: '100%', marginVertical: spacingValue }
        : { width: 1, height: '100%', marginHorizontal: spacingValue }),
    },
  });

  return <View style={[styles.divider, style]} {...props} />;
};

export default Divider;
