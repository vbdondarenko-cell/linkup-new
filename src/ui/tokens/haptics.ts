/**
 * LinkUp Design System 2026
 * Haptic Feedback System
 * Every important interaction supports haptic feedback
 */

// ============================================
// HAPTIC TYPES
// ============================================

export const haptics = {
  // Selection - Light tap for selection changes
  selection: {
    type: 'selection' as const,
    description: 'Light tap for selection changes',
  },

  // Light impact - Subtle feedback
  light: {
    type: 'impactLight' as const,
    description: 'Light impact for subtle feedback',
  },

  // Medium impact - Standard feedback
  medium: {
    type: 'impactMedium' as const,
    description: 'Medium impact for standard feedback',
  },

  // Heavy impact - Significant actions
  heavy: {
    type: 'impactHeavy' as const,
    description: 'Heavy impact for significant actions',
  },

  // Success - Task completed
  success: {
    type: 'notificationSuccess' as const,
    description: 'Success notification for completed tasks',
  },

  // Warning - Caution needed
  warning: {
    type: 'notificationWarning' as const,
    description: 'Warning notification for caution',
  },

  // Error - Error occurred
  error: {
    type: 'notificationError' as const,
    description: 'Error notification for failures',
  },

  // Soft - Gentle feedback
  soft: {
    type: 'impactSoft' as const,
    description: 'Soft impact for gentle feedback',
  },

  // Rigid - Firm feedback
  rigid: {
    type: 'impactRigid' as const,
    description: 'Rigid impact for firm feedback',
  },
} as const;

// ============================================
// INTERACTION HAPTICS - Map interactions to haptics
// ============================================

export const interactionHaptics = {
  // Button interactions
  button: {
    tap: haptics.light,
    press: haptics.soft,
    longPress: haptics.medium,
  },

  // Toggle interactions
  toggle: {
    on: haptics.light,
    off: haptics.soft,
  },

  // Switch interactions
  switch: {
    on: haptics.medium,
    off: haptics.light,
  },

  // Selection interactions
  selection: {
    change: haptics.selection,
    confirm: haptics.light,
  },

  // Drag interactions
  drag: {
    start: haptics.soft,
    tick: haptics.selection,
    end: haptics.medium,
  },

  // Swipe interactions
  swipe: {
    threshold: haptics.selection,
    complete: haptics.light,
  },

  // Pull to refresh
  pullRefresh: {
    trigger: haptics.medium,
    complete: haptics.success,
  },

  // Like/heart animation
  like: {
    tap: haptics.medium,
    doubleTap: haptics.heavy,
  },

  // Tab change
  tab: {
    change: haptics.selection,
  },

  // Navigation
  nav: {
    back: haptics.soft,
    forward: haptics.selection,
  },

  // Modal/Bottom sheet
  sheet: {
    open: haptics.soft,
    close: haptics.selection,
    snap: haptics.light,
  },

  // Map interactions
  map: {
    markerTap: haptics.selection,
    markerSelect: haptics.light,
    regionChange: haptics.soft,
    compassTap: haptics.selection,
  },
} as const;

// ============================================
// FEEDBACK PATTERNS - Sequences of haptics
// ============================================

export const hapticPatterns = {
  // Task completed
  taskComplete: [
    haptics.success,
  ],

  // Action failed
  actionFailed: [
    haptics.error,
  ],

  // Achievement unlocked
  achievement: [
    haptics.success,
    { ...haptics.light, delay: 100 },
    { ...haptics.medium, delay: 200 },
  ],

  // Level up
  levelUp: [
    haptics.heavy,
    { ...haptics.success, delay: 150 },
  ],

  // Double tap like
  doubleTapLike: [
    haptics.medium,
    { ...haptics.success, delay: 100 },
  ],

  // Long press menu
  longPressMenu: [
    haptics.medium,
  ],

  // Tab switch
  tabSwitch: [
    haptics.selection,
  ],

  // Form validation error
  validationError: [
    haptics.warning,
    { ...haptics.warning, delay: 100 },
  ],

  // Form submit success
  formSuccess: [
    haptics.success,
  ],

  // Delete action
  delete: [
    haptics.heavy,
  ],

  // Confirm action
  confirm: [
    haptics.medium,
  ],
} as const;

// ============================================
// PLATFORM HAPTIC MAPPING
// ============================================

export const platformHaptics = {
  // iOS Haptic Engine mappings
  ios: {
    selection: 'UISelectionFeedbackGenerator',
    impactLight: 'UIImpactFeedbackGenerator.impactOccurred(.light)',
    impactMedium: 'UIImpactFeedbackGenerator.impactOccurred(.medium)',
    impactHeavy: 'UIImpactFeedbackGenerator.impactOccurred(.heavy)',
    impactSoft: 'UIImpactFeedbackGenerator.impactOccurred(.soft)',
    impactRigid: 'UIImpactFeedbackGenerator.impactOccurred(.rigid)',
    notificationSuccess: 'UINotificationFeedbackGenerator.notificationOccurred(.success)',
    notificationWarning: 'UINotificationFeedbackGenerator.notificationOccurred(.warning)',
    notificationError: 'UINotificationFeedbackGenerator.notificationOccurred(.error)',
  },

  // Android VibrationEffect mappings
  android: {
    selection: 'VibrationEffect.createOneShot(10, 50)',
    impactLight: 'VibrationEffect.createOneShot(20, 100)',
    impactMedium: 'VibrationEffect.createOneShot(30, 150)',
    impactHeavy: 'VibrationEffect.createOneShot(40, 200)',
    impactSoft: 'VibrationEffect.createOneShot(25, 80)',
    impactRigid: 'VibrationEffect.createOneShot(35, 180)',
    notificationSuccess: 'VibrationEffect.createWaveform([0, 50, 50, 50], [0, 100, 0, 100])',
    notificationWarning: 'VibrationEffect.createWaveform([0, 100, 50, 100], [0, 100, 0, 100])',
    notificationError: 'VibrationEffect.createWaveform([0, 50, 50, 50, 50, 50], [0, 100, 0, 100, 0, 100])',
  },

  // Web Vibration API fallback
  web: {
    selection: [5],
    impactLight: [10],
    impactMedium: [20],
    impactHeavy: [30],
    impactSoft: [8],
    impactRigid: [25],
    notificationSuccess: [50, 50, 50],
    notificationWarning: [100, 50, 100],
    notificationError: [50, 50, 50, 50, 50],
  },
} as const;

// ============================================
// HAPTIC SETTINGS - User preferences
// ============================================

export const hapticSettings = {
  // Enable/disable haptics
  enabled: true,

  // Intensity levels
  intensity: {
    light: 0.5,
    medium: 0.7,
    heavy: 1.0,
  },

  // Reduced motion preference disables haptics
  respectReducedMotion: true,
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type HapticType = keyof typeof haptics;
export type InteractionHaptic = keyof typeof interactionHaptics;
export type HapticPattern = keyof typeof hapticPatterns;
