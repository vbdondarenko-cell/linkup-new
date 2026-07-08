/**
 * LinkUp Design System 2026
 * Toast Component - Non-blocking notifications
 */

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info' | 'premium';

interface ToastProps {
  visible: boolean;
  variant?: ToastVariant;
  title: string;
  message?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number;
  onDismiss: () => void;
  style?: ViewStyle;
}

// Toast Container Provider
interface ToastContextValue {
  showToast: (options: Omit<ToastProps, 'visible' | 'onDismiss'>) => void;
  hideToast: () => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toastState, setToastState] = useState<Omit<ToastProps, 'visible' | 'onDismiss'> & { visible: boolean } | null>(null);

  const showToast = useCallback((options: Omit<ToastProps, 'visible' | 'onDismiss'>) => {
    setToastState({ ...options, visible: true });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => prev ? { ...prev, visible: false } : null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastState && (
        <Toast
          {...toastState}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};

export const Toast: React.FC<ToastProps> = ({
  visible,
  variant = 'info',
  title,
  message,
  action,
  duration = 4000,
  onDismiss,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  const getVariantColors = () => {
    const { colors } = theme;
    const variants: Record<ToastVariant, { bg: string; text: string; border: string; icon: string }> = {
      success: {
        bg: colors.status.success.bg,
        text: colors.status.success.text,
        border: colors.status.success.border,
        icon: '✓',
      },
      error: {
        bg: colors.status.danger.bg,
        text: colors.status.danger.text,
        border: colors.status.danger.border,
        icon: '✕',
      },
      warning: {
        bg: colors.status.warning.bg,
        text: colors.status.warning.text,
        border: colors.status.warning.border,
        icon: '⚠',
      },
      info: {
        bg: colors.status.info.bg,
        text: colors.status.info.text,
        border: colors.status.info.border,
        icon: 'ℹ',
      },
      premium: {
        bg: colors.premium.gold.bg,
        text: colors.premium.gold.text,
        border: colors.premium.gold.border,
        icon: '⭐',
      },
    };
    return variants[variant];
  };

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 200 });

      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);
        return () => clearTimeout(timer);
      }
    } else {
      translateY.value = withSpring(-100, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, duration, translateY, opacity]);

  const handleDismiss = useCallback(() => {
    haptics.selection();
    onDismiss();
  }, [haptics, onDismiss]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const colors = getVariantColors();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface.primary,
          borderRadius: theme.radius.component.toast,
          borderLeftWidth: 4,
          borderLeftColor: colors.text,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        },
        animatedStyle,
        style,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: colors.bg }]}>
        <Text style={[styles.icon, { color: colors.text }]}>{colors.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              fontSize: 15,
              fontWeight: fontWeight.semibold,
              color: theme.colors.text.primary,
            },
          ]}
        >
          {title}
        </Text>
        {message && (
          <Text
            style={[
              styles.message,
              {
                fontSize: 13,
                color: theme.colors.text.secondary,
              },
            ]}
          >
            {message}
          </Text>
        )}
      </View>

      {/* Action */}
      {action && (
        <Pressable
          onPress={action.onPress}
          style={[styles.action, { borderColor: colors.text }]}
        >
          <Text style={[styles.actionText, { color: colors.text }]}>
            {action.label}
          </Text>
        </Pressable>
      )}

      {/* Dismiss */}
      <Pressable onPress={handleDismiss} style={styles.dismiss}>
        <Text style={{ color: theme.colors.text.tertiary, fontSize: 18 }}>×</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: spacing[4],
    left: spacing[4],
    right: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    zIndex: 9999,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  icon: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  title: {},
  message: {
    marginTop: spacing[0.5],
  },
  action: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderWidth: 1,
    borderRadius: 6,
    marginLeft: spacing[2],
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dismiss: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
});

Toast.displayName = 'Toast';
