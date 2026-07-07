// Z-index tokens
// Organized, predictable layering

export const zIndex = {
  // Base
  base: 0,
  
  // Elevated
  elevated: 1,
  
  // Dropdown
  dropdown: 100,
  
  // Sticky
  sticky: 200,
  
  // Fixed
  fixed: 300,
  
  // Modal Backdrop
  modalBackdrop: 400,
  
  // Modal
  modal: 500,
  
  // Popover
  popover: 600,
  
  // Tooltip
  tooltip: 700,
  
  // Toast
  toast: 800,
  
  // Loading/Overlay
  loading: 900,
  
  // Maximum (for special cases)
  max: 9999,
} as const;

export const mapZIndex = {
  // Map controls
  controls: 10,
  search: 20,
  bottomSheet: 100,
  
  // Map markers
  markerDefault: 30,
  markerSelected: 40,
  markerCluster: 35,
  
  // Map overlays
  attribution: 5,
  scale: 10,
} as const;

export type ZIndex = keyof typeof zIndex;