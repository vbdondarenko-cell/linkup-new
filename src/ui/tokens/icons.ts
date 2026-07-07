/**
 * LinkUp Design System 2026
 * Icon System - Consistent, premium icons
 * Choose one icon family and use it consistently
 */

// ============================================
// ICON FAMILIES - Supported icon libraries
// ============================================

export const iconFamilies = {
  // Lucide Icons - Open source, consistent
  // Recommended for LinkUp
  lucide: {
    name: 'Lucide',
    style: 'outline',
    strokeWidth: 1.5,
    url: 'https://lucide.dev/',
  },

  // SF Symbols - Apple native
  sfSymbols: {
    name: 'SF Symbols',
    style: 'mixed',
    weight: 'regular',
    url: 'https://developer.apple.com/sf-symbols/',
  },

  // Heroicons - Tailwind CSS
  heroicons: {
    name: 'Heroicons',
    style: 'outline',
    strokeWidth: 1.5,
    url: 'https://heroicons.com/',
  },

  // Phosphor Icons
  phosphor: {
    name: 'Phosphor',
    style: 'regular',
    url: 'https://phosphoricons.com/',
  },
} as const;

// ============================================
// ICON SIZES
// ============================================

export const iconSize = {
  // Extra small - inline text
  xs: '12px',

  // Small - badges, tags
  sm: '16px',

  // Medium - buttons, inputs (default)
  md: '20px',

  // Large - section headers
  lg: '24px',

  // Extra large - empty states
  xl: '32px',

  // 2XL - featured icons
  '2xl': '40px',

  // 3XL - hero icons
  '3xl': '48px',
} as const;

// ============================================
// ICON PROPERTIES
// ============================================

export const iconProperties = {
  // Stroke width (Lucide/Heroicons)
  strokeWidth: 1.5,

  // Line cap
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,

  // Default padding (space around icon)
  padding: 2,

  // Optical alignment offset
  opticalAlignment: {
    // Icons that need vertical adjustment
    up: -0.5,
    down: 0.5,
    none: 0,
  },
} as const;

// ============================================
// ICON COLOR TOKENS
// ============================================

export const iconColor = {
  // Primary - main actions
  primary: 'currentColor',

  // Secondary - secondary actions
  secondary: 'currentColor',

  // Muted - disabled, tertiary
  muted: 'currentColor',

  // Inverse - on dark backgrounds
  inverse: 'currentColor',

  // Semantic colors
  success: 'currentColor',
  warning: 'currentColor',
  danger: 'currentColor',
  info: 'currentColor',

  // Premium
  premium: 'currentColor',
} as const;

// ============================================
// CATEGORY ICONS - Semantic naming
// ============================================

export const categoryIcons = {
  // Navigation
  navigation: {
    home: 'Home',
    back: 'ArrowLeft',
    forward: 'ArrowRight',
    close: 'X',
    menu: 'Menu',
    more: 'MoreHorizontal',
  },

  // Actions
  actions: {
    add: 'Plus',
    edit: 'Pencil',
    delete: 'Trash2',
    share: 'Share',
    copy: 'Copy',
    paste: 'Clipboard',
    cut: 'Scissors',
    download: 'Download',
    upload: 'Upload',
    refresh: 'RefreshCw',
    settings: 'Settings',
  },

  // Social
  social: {
    user: 'User',
    users: 'Users',
    profile: 'UserCircle',
    like: 'Heart',
    comment: 'MessageCircle',
    bookmark: 'Bookmark',
    send: 'Send',
    chat: 'MessageSquare',
  },

  // Events
  events: {
    calendar: 'Calendar',
    clock: 'Clock',
    location: 'MapPin',
    ticket: 'Ticket',
    star: 'Star',
    tag: 'Tag',
  },

  // Status
  status: {
    check: 'Check',
    checkCircle: 'CheckCircle2',
    warning: 'AlertTriangle',
    error: 'AlertCircle',
    info: 'Info',
    help: 'HelpCircle',
  },

  // Media
  media: {
    camera: 'Camera',
    image: 'Image',
    play: 'Play',
    pause: 'Pause',
    music: 'Music',
  },

  // UI
  ui: {
    search: 'Search',
    filter: 'Filter',
    sort: 'ArrowUpDown',
    list: 'List',
    grid: 'Grid3X3',
    eye: 'Eye',
    eyeOff: 'EyeOff',
    lock: 'Lock',
    unlock: 'Unlock',
  },

  // Maps
  maps: {
    map: 'Map',
    compass: 'Compass',
    navigation: 'Navigation',
    route: 'Route',
    layers: 'Layers',
  },
} as const;

// ============================================
// INTERACTIVE ICON STATES
// ============================================

export const iconStates = {
  default: {
    opacity: 1,
  },
  hover: {
    opacity: 0.8,
  },
  active: {
    opacity: 0.6,
    scale: 0.95,
  },
  disabled: {
    opacity: 0.4,
  },
} as const;

// ============================================
// ICON WRAPPER PROPS
// ============================================

export const iconWrapper = {
  // Container sizing
  containerSize: {
    sm: '24px',
    md: '32px',
    lg: '40px',
    xl: '48px',
  },

  // Minimum touch target (accessibility)
  minTouchTarget: '44px',

  // Icon container gap
  gap: 4,
} as const;

// ============================================
// EXPORTS
// ============================================

export type IconFamily = keyof typeof iconFamilies;
export type IconSize = keyof typeof iconSize;
