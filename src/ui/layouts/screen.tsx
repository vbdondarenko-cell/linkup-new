import React from 'react';
import { StyleSheet, View, ScrollView, KeyboardAvoidingView, Platform, ViewProps } from 'react-native';
import { useTheme } from '../providers/theme-provider';
import { spacing } from '../tokens/spacing';

export interface ScreenProps extends ViewProps {
  scrollable?: boolean;
  keyboardAvoiding?: boolean;
  padding?: boolean;
  children: React.ReactNode;
}

export const Screen: React.FC<ScreenProps> = ({
  scrollable = false,
  keyboardAvoiding = true,
  padding = true,
  style,
  children,
  ...props
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContainer: {
      flexGrow: 1,
    },
    content: {
      flex: 1,
      ...(padding && { paddingHorizontal: spacing[4] }),
    },
  });

  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: styles.scrollContainer, showsVerticalScrollIndicator: false }
    : {};

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Container style={[styles.content, style]} {...containerProps} {...props}>
        {children}
      </Container>
    </KeyboardAvoidingView>
  );
};

export default Screen;
