/**
 * LinkUp Design System 2026
 * Modals - Premium modal components
 * Alert, Confirmation, Dialog, Action Sheet
 */

'use client';

import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
  BackHandler,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '../../providers/theme-provider';
import { useHaptics } from '../../hooks/use-haptics';
import { spacing, touchTarget } from '../../tokens/spacing';
import { fontSize, fontWeight } from '../../tokens/typography';
import { spring, duration } from '../../tokens/animation';
import { Button } from '../../components/buttons';

// ============================================
// BASE MODAL
// ============================================

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'fullscreen';
  dismissible?: boolean;
  showCloseButton?: boolean;
  style?: ViewStyle;
}

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  description,
  children,
  size = 'md',
  dismissible = true,
  showCloseButton = true,
  style,
}) => {
  const theme = useTheme();
  const haptics = useHaptics();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const translateY = useSharedValue(20);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: duration.fast });
      scale.value = withSpring(1, {
        damping: spring.default.damping,
        stiffness: spring.default.stiffness,
      });
      translateY.value = withSpring(0, {
        damping: spring.gentle.damping,
        stiffness: spring.gentle.stiffness,
      });
    } else {
      opacity.value = withTiming(0, { duration: duration.fast });
      scale.value = withTiming(0.95, { duration: duration.fast });
      translateY.value = withTiming(20, { duration: duration.fast });
    }
  }, [visible, opacity, scale, translateY]);

  useEffect(() => {
    if (visible && dismissible) {
      const handler = BackHandler.addEventListener('hardwareBackPress', () => {
        handleClose();
        return true;
      });
      return () => handler.remove();
    }
  }, [visible, dismissible]);

  const handleClose = useCallback(() => {
    haptics.light();
    onClose();
  }, [haptics, onClose]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.5,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
    ],
  }));

  const getWidth = () => {
    switch (size) {
      case 'sm': return '80%';
      case 'lg': return '95%';
      case 'fullscreen': return '100%';
      default: return '90%';
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={dismissible ? handleClose : undefined}
        />
      </Animated.View>

      {/* Modal */}
      <Animated.View
        style={[
          styles.modal,
          {
            width: size === 'fullscreen' ? '100%' : getWidth(),
            backgroundColor: theme.colors.surface.primary,
            borderRadius: size === 'fullscreen' ? 0 : theme.radius.component.modal,
            padding: size === 'fullscreen' ? 0 : spacing[6],
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
                  { color: theme.colors.text.primary },
                ]}
              >
                {title}
              </Text>
            )}
            {showCloseButton && (
              <Pressable
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
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
              { color: theme.colors.text.secondary },
            ]}
          >
            {description}
          </Text>
        )}

        {/* Content */}
        {children && (
          <View style={styles.content}>{children}</View>
        )}
      </Animated.View>
    </View>
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
}

const variantIcons = {
  info: 'ℹ️',
  warning: '⚠️',
  error: '❌',
  success: '✅',
};

export const Alert: React.FC<AlertProps> = ({
  visible,
  onClose,
  title,
  message,
  variant = 'info',
  confirmLabel = 'OK',
}) => {
  const theme = useTheme();
  const handleConfirm = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} onClose={onClose} size="sm">
      <View style={styles.alertContent}>
        <Text style={styles.alertIcon}>{variantIcons[variant]}</Text>
        <Text style={[styles.alertTitle, { color: theme.colors?.text?.primary }]}>
          {title}
        </Text>
        <Text style={styles.alertMessage}>{message}</Text>
        <Button
          variant={variant === 'error' ? 'destructive' : 'primary'}
          onPress={handleConfirm}
          fullWidth
        >
          {confirmLabel}
        </Button>
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
  const theme = useTheme();
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal visible={visible} onClose={onClose} size="sm">
      <View style={styles.dialogContent}>
        <Text style={[styles.dialogTitle, { color: theme.colors?.text?.primary }]}>
          {title}
        </Text>
        <Text style={styles.dialogMessage}>{message}</Text>
        
        <View style={styles.dialogActions}>
          <Button
            variant="tertiary"
            onPress={handleCancel}
            style={styles.dialogButton}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            onPress={handleConfirm}
            style={styles.dialogButton}
          >
            {confirmLabel}
          </Button>
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// ACTION SHEET
// ============================================

interface ActionSheetOption {
  label: string;
  icon?: string;
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
  const haptics = useHaptics();

  const handleOptionPress = useCallback(
    (option: ActionSheetOption) => {
      haptics.light();
      option.onPress();
      onClose();
    },
    [haptics, onClose]
  );

  const handleCancel = useCallback(() => {
    haptics.selection();
    onClose();
  }, [haptics, onClose]);

  return (
    <Modal visible={visible} onClose={onClose} size="sm">
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
              <Text
                style={[
                  styles.actionSheetTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                {title}
              </Text>
            )}
            {message && (
              <Text
                style={[
                  styles.actionSheetMessage,
                  { color: theme.colors.text.secondary },
                ]}
              >
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
                borderBottomWidth:
                  index < options.length - 1 ? StyleSheet.hairlineWidth : 0,
                borderBottomColor: theme.colors.border.default,
                opacity: option.disabled ? 0.5 : 1,
              },
            ]}
          >
            {option.icon && (
              <Text style={styles.actionSheetIcon}>{option.icon}</Text>
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
          onPress={handleCancel}
          style={[
            styles.actionSheetCancel,
            {
              backgroundColor: theme.colors.surface.secondary,
              borderRadius: theme.radius.component.button,
            },
          ]}
        >
          <Text
            style={[
              styles.actionSheetCancelLabel,
              { color: theme.colors.text.primary },
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
// PREMIUM MODAL
// ============================================

interface PremiumModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  price?: string;
  features?: string[];
  onSubscribe: () => void;
  onMaybeLater?: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  visible,
  onClose,
  title,
  description,
  price,
  features = [],
  onSubscribe,
  onMaybeLater,
}) => {
  const theme = useTheme();

  return (
    <Modal visible={visible} onClose={onClose} size="md">
      <View style={styles.premiumContent}>
        <Text style={styles.premiumIcon}>⭐</Text>
        <Text
          style={[
            styles.premiumTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.premiumDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {description}
        </Text>

        {price && (
          <View style={styles.premiumPrice}>
            <Text
              style={[
                styles.premiumPriceText,
                { color: theme.colors.premium.gold.DEFAULT },
              ]}
            >
              {price}
            </Text>
          </View>
        )}

        {features.length > 0 && (
          <View style={styles.premiumFeatures}>
            {features.map((feature, index) => (
              <View key={index} style={styles.premiumFeature}>
                <Text style={styles.premiumFeatureIcon}>✓</Text>
                <Text
                  style={[
                    styles.premiumFeatureText,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        )}

        <Button variant="primary" onPress={onSubscribe} fullWidth>
          Subscribe
        </Button>

        {onMaybeLater && (
          <Pressable onPress={onMaybeLater} style={styles.premiumLater}>
            <Text
              style={[
                styles.premiumLaterText,
                { color: theme.colors.text.tertiary },
              ]}
            >
              Maybe Later
            </Text>
          </Pressable>
        )}
      </View>
    </Modal>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modal: {
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  title: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  closeButton: {
    padding: spacing[1],
    marginLeft: spacing[2],
  },
  closeText: {
    fontSize: 24,
    fontWeight: '300',
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
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
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  alertMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[6],
  },

  // Dialog
  dialogContent: {},
  dialogTitle: {
    fontSize: 18,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing[2],
  },
  dialogMessage: {
    fontSize: 14,
    marginBottom: spacing[6],
  },
  dialogActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  dialogButton: {
    flex: 1,
  },

  // Action Sheet
  actionSheet: {
    overflow: 'hidden',
  },
  actionSheetHeader: {
    alignItems: 'center',
    paddingVertical: spacing[3],
  },
  actionSheetTitle: {
    fontSize: 14,
    fontWeight: fontWeight.semibold,
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
    fontSize: 20,
    marginRight: spacing[2],
  },
  actionSheetOptionLabel: {
    fontSize: 17,
  },
  actionSheetCancel: {
    marginTop: spacing[2],
    paddingVertical: spacing[4],
    alignItems: 'center',
  },
  actionSheetCancelLabel: {
    fontSize: 17,
    fontWeight: fontWeight.semibold,
  },

  // Premium
  premiumContent: {
    alignItems: 'center',
  },
  premiumIcon: {
    fontSize: 64,
    marginBottom: spacing[3],
  },
  premiumTitle: {
    fontSize: 24,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  premiumDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  premiumPrice: {
    marginBottom: spacing[4],
  },
  premiumPriceText: {
    fontSize: 32,
    fontWeight: fontWeight.bold,
  },
  premiumFeatures: {
    width: '100%',
    marginBottom: spacing[6],
  },
  premiumFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  premiumFeatureIcon: {
    fontSize: 16,
    color: '#10B981',
    marginRight: spacing[2],
  },
  premiumFeatureText: {
    fontSize: 14,
  },
  premiumLater: {
    marginTop: spacing[3],
    padding: spacing[2],
  },
  premiumLaterText: {
    fontSize: 14,
  },
});

Modal.displayName = 'Modal';
Alert.displayName = 'Alert';
ConfirmDialog.displayName = 'ConfirmDialog';
ActionSheet.displayName = 'ActionSheet';
PremiumModal.displayName = 'PremiumModal';
