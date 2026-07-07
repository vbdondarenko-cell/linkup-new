/**
 * LinkUp Design System 2026
 * Haptics Hook
 * Purposeful haptic feedback using design tokens
 */

import { useCallback } from 'react';
import { Platform } from 'react-native';
import { haptics, interactionHaptics, hapticSettings } from '../tokens/haptics';

// Haptic feedback types
export type HapticType = 
  | 'selection'
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'soft'
  | 'rigid';

export interface UseHapticsOptions {
  enabled?: boolean;
  respectReducedMotion?: boolean;
}

export const useHaptics = (options?: UseHapticsOptions) => {
  const { 
    enabled = hapticSettings.enabled, 
    respectReducedMotion = hapticSettings.respectReducedMotion 
  } = options || {};

  const trigger = useCallback(
    (type: HapticType) => {
      if (!enabled) return;

      // Respect reduced motion setting
      if (respectReducedMotion && Platform.OS === 'ios') {
        // Could check AccessibilityInfo here
      }

      // iOS: Use UIImpactFeedbackGenerator, UINotificationFeedbackGenerator
      if (Platform.OS === 'ios') {
        // In production with react-native-haptic-feedback:
        // ReactNativeHapticFeedback.trigger(type, {
        //   enableVibrateFallback: true,
        //   ignoreAndroidSystemSettings: false,
        // });
        console.log(`[Haptic] ${type}`);
      }

      // Android: Use Vibration API or react-native-haptic-feedback
      if (Platform.OS === 'android') {
        // In production with react-native-haptic-feedback:
        // ReactNativeHapticFeedback.trigger(type);
        console.log(`[Haptic] ${type}`);
      }
    },
    [enabled, respectReducedMotion]
  );

  // Individual haptic methods
  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);
  const success = useCallback(() => trigger('success'), [trigger]);
  const warning = useCallback(() => trigger('warning'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);
  const selection = useCallback(() => trigger('selection'), [trigger]);
  const soft = useCallback(() => trigger('soft'), [trigger]);
  const rigid = useCallback(() => trigger('rigid'), [trigger]);

  // Semantic interaction haptics
  const buttonTap = useCallback(() => trigger(interactionHaptics.button.tap.type), [trigger]);
  const toggleOn = useCallback(() => trigger(interactionHaptics.toggle.on.type), [trigger]);
  const toggleOff = useCallback(() => trigger(interactionHaptics.toggle.off.type), [trigger]);
  const likeDoubleTap = useCallback(() => trigger(interactionHaptics.like.doubleTap.type), [trigger]);
  const sheetOpen = useCallback(() => trigger(interactionHaptics.sheet.open.type), [trigger]);
  const sheetClose = useCallback(() => trigger(interactionHaptics.sheet.close.type), [trigger]);

  return {
    // Base haptics
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
    soft,
    rigid,

    // Interaction haptics
    buttonTap,
    toggleOn,
    toggleOff,
    likeDoubleTap,
    sheetOpen,
    sheetClose,
  };
};
