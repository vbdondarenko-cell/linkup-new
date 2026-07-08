/**
 * LinkUp Design System 2026
 * Modal Component - Dialogs, Alerts, Action Sheets
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal as RNModal,
  BackHandler,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';
import { Button } from '../../buttons';

// ============================================
// BASE MODAL
// ============================================

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  showCloseButton?: boolean;
  dismissible?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  dismissible = true,
  size = 'md',
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  const getSizeWidth = () => {
    switch (size) {
      case 'sm': return '85%';
      case 'lg': return '95%';
      default: return '90%';
    }
  };

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      opacity.value = withTiming(1, { duration: 200 });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
      backdropOpacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, scale, opacity, backdropOpacity]);

  useEffect(() => {
    if (visible && dismissible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        onClose();
        return true;
      });
      return () => backHandler.remove();
    }
  }, [visible, dismissible, onClose]);

  const handleBackdropPress = useCallback(() => {
    if (dismissible) {
      haptics.selection();
      onClose();
    }
  }, [dismissible, haptics, onClose]);

  const handleClose = useCallback(() => {
    haptics.light();
    onClose();
  }, [haptics, onClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
          />
        </Animated.View>

        {/* Content */}
        <Animated.View
          style={[
            styles.modal,
            {
              width: getSizeWidth(),
              backgroundColor: theme.colors.surface.primary,
              borderRadius: theme.radius.component.modal,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.25,
              shadowRadius: 20,
              elevation: 10,
            },
            modalStyle,
            style,
          ]}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View style={styles.header}>
              {title && (
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
              )}
              {showCloseButton && (
                <Pressable onPress={handleClose} style={styles.closeButton}>
                  <Text
                    style={[
                      styles.closeText,
                      { color: theme.colors.text.tertiary },
                    ]}
                  >
                    ×
                  </Text>
                </Pressable>
              )}
            </View>
          )}

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

          {/* Children */}
          {children && <View style={styles.content}>{children}</View>}
        </Animated.View>
      </View>
    </RNModal>
  );
};

// ============================================
// ALERT
// ============================================

interface AlertProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  variant?: 'info' | 'warning' | 'error' | 'success';
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  onClose,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  const getVariantIcon = () => {
    const icons = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅',
    };
    return icons[variant];
  };

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} size="sm">
      <View style={styles.alertContent}>
        <Text style={styles.alertIcon}>{getVariantIcon()}</Text>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertMessage}>{message}</Text>

        <View style={styles.alertActions}>
          {onCancel && (
            <Button
              variant="tertiary"
              size="md"
              onPress={handleCancel}
              style={styles.alertButton}
            >
              {cancelLabel}
            </Button>
          )}
          <Button
            variant={variant === 'error' ? 'destructive' : 'primary'}
            size="md"
            onPress={handleConfirm}
            style={styles.alertButton}
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// CONFIRM DIALOG
// ============================================

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Alert
      visible={visible}
      onClose={onClose}
      title={title}
      message={message}
      variant={destructive ? 'error' : 'info'}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
};

// ============================================
// ACTION SHEET
// ============================================

interface ActionSheetOption {
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  options: ActionSheetOption[];
  cancelLabel?: string;
}

export const ActionSheet: React.FC<ActionSheetProps> = ({
  visible,
  onClose,
  title,
  message,
  options,
  cancelLabel = 'Cancel',
}) => {
  const theme = useTheme();

  const handleOptionPress = (option: ActionSheetOption) => {
    option.onPress();
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} showCloseButton={false} size="sm">
      <View
        style={[
          styles.actionSheet,
          { borderRadius: theme.radius.component.modal },
        ]}
      >
        {/* Header */}
        {(title || message) && (
          <View style={styles.actionSheetHeader}>
            {title && (
              <Text style={[styles.actionSheetTitle, { color: theme.colors.text.primary }]}>
                {title}
              </Text>
            )}
            {message && (
              <Text style={[styles.actionSheetMessage, { color: theme.colors.text.secondary }]}>
                {message}
              </Text>
            )}
          </View>
        )}

        {/* Options */}
        {options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => handleOptionPress(option)}
            disabled={option.disabled}
            style={[
              styles.actionSheetOption,
              {
                opacity: option.disabled ? 0.5 : 1,
                borderBottomWidth: index < options.length - 1 ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: theme.colors.border.default,
              },
            ]}
          >
            {option.icon && (
              <View style={styles.actionSheetIcon}>{option.icon}</View>
            )}
            <Text
              style={[
                styles.actionSheetOptionLabel,
                {
                  color: option.destructive
                    ? theme.colors.status.danger.DEFAULT
                    : theme.colors.text.primary,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}

        {/* Cancel */}
        <Pressable
          onPress={onClose}
          style={[
            styles.actionSheetCancel,
            {
              backgroundColor: theme.colors.surface.secondary,
              borderRadius: theme.radius.component.modal,
              marginTop: spacing[2],
            },
          ]}
        >
          <Text
            style={[
              styles.actionSheetCancelLabel,
              {
                fontWeight: fontWeight.semibold,
                color: theme.colors.text.primary,
              },
            ]}
          >
            {cancelLabel}
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    padding: spacing[6],
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  title: {},
  closeButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
  },
  description: {
    marginBottom: spacing[4],
  },
  content: {},

  // Alert
  alertContent: {
    alignItems: 'center',
  },
  alertIcon: {
    fontSize: 48,
    marginBottom: spacing[3],
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[6],
  },
  alertActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  alertButton: {
    flex: 1,
  },

  // Action Sheet
  actionSheet: {
    width: '100%',
  },
  actionSheetHeader: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  actionSheetTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionSheetMessage: {
    fontSize: 12,
    marginTop: spacing[1],
    textAlign: 'center',
  },
  actionSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing[4],
  },
  actionSheetIcon: {
    marginRight: spacing[2],
  },
  actionSheetOptionLabel: {
    fontSize: 17,
  },
  actionSheetCancel: {
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  actionSheetCancelLabel: {
    fontSize: 17,
  },
});

Modal.displayName = 'Modal';
Alert.displayName = 'Alert';
ConfirmDialog.displayName = 'ConfirmDialog';
ActionSheet.displayName = 'ActionSheet';
