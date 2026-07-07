import { useCallback } from 'react';
import { Platform } from 'react-native';

// Haptic feedback types
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

// Note: In production, this would use react-native-haptic-feedback
// For now, this is a stub implementation

export interface UseHapticsOptions {
  enabled?: boolean;
}

export const useHaptics = (options?: UseHapticsOptions) => {
  const { enabled = true } = options || {};

  const trigger = useCallback(
    (type: HapticType) => {
      if (!enabled || Platform.OS !== 'ios') return;

      // In production, this would call:
      // ReactNativeHapticFeedback.trigger(type, {
      //   enableVibrateFallback: true,
      //   ignoreAndroidSystemSettings: false,
      // });

      // Stub: Just log for development
      console.log(`[Haptic] ${type}`);
    },
    [enabled]
  );

  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);
  const success = useCallback(() => trigger('success'), [trigger]);
  const warning = useCallback(() => trigger('warning'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);
  const selection = useCallback(() => trigger('selection'), [trigger]);

  return {
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
  };
};
