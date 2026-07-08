/**
 * LinkUp Design System 2026
 * Navigation Module - Main exports
 */

// Floating Dock
export { FloatingDock, useDockAutoHide } from './floating-dock/floating-dock';
export type { DockTab, FloatingDockProps } from './floating-dock/floating-dock';

// Navigation Stack
export { NavigationProvider, Navigator, useNavigation } from './navigation-stack/navigation-stack';
export type {
  NavigationRoute,
  NavigationMode,
  NavigationState,
  NavigationContextValue,
  ScreenConfig,
} from './navigation-stack/navigation-stack';

// Bottom Sheet
export { BottomSheet, SnapIndicator } from './bottom-sheet/bottom-sheet';
export type { SnapPoint, BottomSheetProps } from './bottom-sheet/bottom-sheet';

// Transitions
export {
  transitions,
  useFadeTransition,
  useScaleTransition,
  useSlideTransition,
  useBottomSheetTransition,
  useModalTransition,
  usePressTransition,
  useTabSwitchAnimation,
  useStaggerAnimation,
  motionUtils,
  easings,
} from './transitions/transitions';
export type { TransitionType, TransitionConfig } from './transitions/transitions';

// Hero Animations
export {
  HeroProvider,
  HeroView,
  HeroImage,
  useHero,
  calculateHeroTransition,
  createHeroSpringConfig,
  eventCardToDetailsHero,
  avatarToProfileHero,
  businessToDashboardHero,
  markerToSheetHero,
} from './hero/hero';
export type { HeroType, HeroConfig, HeroContextValue } from './hero/hero';

// Gesture Handlers
export {
  SwipeBackHandler,
  DragHandler,
  LongPressHandler,
  TapHandler,
  PinchToZoomHandler,
} from './gestures/gesture-handlers';

// Modals
export {
  Modal,
  Alert,
  ConfirmDialog,
  ActionSheet,
  PremiumModal,
} from './modals/modals';
export type {
  ModalProps,
  AlertProps,
  ConfirmDialogProps,
  ActionSheetOption,
  ActionSheetProps,
  PremiumModalProps,
} from './modals/modals';
