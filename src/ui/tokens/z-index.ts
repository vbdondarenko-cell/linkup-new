/**
 * LinkUp Design System 2026
 * Z-Index System - Organized layering
 * Each layer has a purpose and clear boundaries
 */

// ============================================
// BASE LAYERS
// ============================================

export const zIndex = {
  // Base - content below everything
  base: 0,

  // Raised - content slightly above base
  raised: 1,

  // Floating - floating elements (FAB, etc)
  floating: 10,

  // Sticky - sticky headers, navigation
  sticky: 100,

  // Fixed - fixed position elements
  fixed: 200,
} as const;

// ============================================
// OVERLAY LAYERS
// ============================================

export const overlayZIndex = {
  // Backdrop - behind modals, sheets
  backdrop: 400,

  // Dropdown - dropdown menus
  dropdown: 500,

  // Popover - tooltips, popovers
  popover: 600,

  // Modal - modals, dialogs
  modal: 700,

  // Toast - notifications, toasts
  toast: 800,

  // Loading - loading screens, spinners
  loading: 900,

  // Debug - development tools only
  debug: 9999,
} as const;

// ============================================
// MAP-SPECIFIC Z-INDEX
// ============================================

export const mapZIndex = {
  // Base map layer
  base: 0,

  // Map decorations
  decoration: 5,

  // Map controls (zoom, compass)
  controls: 10,

  // Search overlay
  search: 20,

  // Markers
  marker: {
    default: 30,
    selected: 40,
    focused: 50,
  },

  // Clusters
  cluster: 35,

  // User location
  userLocation: 45,

  // Route/paths
  route: 25,

  // Bottom sheet (maps with sheets)
  bottomSheet: 100,

  // Map overlays (filters, etc)
  overlay: 110,
} as const;

// ============================================
// NAVIGATION Z-INDEX
// ============================================

export const navZIndex = {
  // Tab bar
  tabBar: 50,

  // Bottom nav
  bottomNav: 50,

  // Top nav (headers)
  topNav: 100,

  // Floating nav
  floatingNav: 100,

  // Dock
  dock: 90,
} as const;

// ============================================
// COMPLETE Z-INDEX SYSTEM
// ============================================

export const index = {
  ...zIndex,
  overlay: overlayZIndex,
  map: mapZIndex,
  nav: navZIndex,
} as const;

// ============================================
// TYPE EXPORTS
// ============================================

export type ZIndex = keyof typeof zIndex;
export type OverlayZIndex = keyof typeof overlayZIndex;
export type MapZIndex = keyof typeof mapZIndex;
