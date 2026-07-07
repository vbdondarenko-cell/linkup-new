import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from '../providers/theme-provider';

export interface ContainerProps extends ViewProps {
  maxWidth?: number;
  center?: boolean;
  padding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  maxWidth = 1200,
  center = false,
  padding = true,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      maxWidth,
      alignSelf: 'center',
      ...(center && { alignItems: 'center' }),
      ...(padding && { paddingHorizontal: spacing[4] }),
    },
  });

  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  );
};

const spacing = {
  4: 16,
};

export default Container;
