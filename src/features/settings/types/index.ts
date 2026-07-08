/**
 * LinkUp Design System 2026
 * Settings Types
 */

// User Account
export interface UserAccount {
  id: string;
  telegramId?: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  email?: string;
  phone?: string;
  memberSince: Date;
  isPremium: boolean;
  isOrganizer: boolean;
  isBusiness: boolean;
}

// Appearance
export type ThemeType = 'system' | 'light' | 'dark' | 'midnight' | 'ocean' | 'forest' | 'sunrise' | 'graphite' | 'copper' | 'aurora';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  border: string;
}

export interface Theme {
  id: ThemeType;
  name: string;
  icon: string;
  isPremium: boolean;
  colors: ThemeColors;
}

export interface AppearanceSettings {
  theme: ThemeType;
  dynamicType: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
}

// Language
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', direction: 'ltr', flag: '🇺🇦' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', direction: 'ltr', flag: '🇵🇱' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', direction: 'ltr', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', direction: 'ltr', flag: '🇮🇹' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', flag: '🇹🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', flag: '🇷🇺' },
];

export interface LanguageSettings {
  language: string;
  autoDetect: boolean;
  useDeviceLanguage: boolean;
}

// Location
export interface LocationSettings {
  currentCity?: string;
  latitude?: number;
  longitude?: number;
  radius: number; // in km
  useGPS: boolean;
  savedPlaces: SavedPlace[];
}

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

// Notifications
export type NotificationType = 
  | 'join_requests'
  | 'messages'
  | 'accepted_requests'
  | 'declined_requests'
  | 'upcoming_events'
  | 'event_reminders'
  | 'recommendations'
  | 'achievements'
  | 'premium'
  | 'business'
  | 'organizer';

export interface NotificationSettings {
  push: boolean;
  inApp: boolean;
  sound: boolean;
  vibration: boolean;
  quietHours: QuietHours;
  focusMode: boolean;
  categories: Record<NotificationType, CategoryNotificationSettings>;
}

export interface CategoryNotificationSettings {
  enabled: boolean;
  push: boolean;
  sound: boolean;
}

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:mm
  end: string; // HH:mm
}

// Privacy
export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showStatistics: boolean;
  showAchievements: boolean;
  showInterests: boolean;
  activityVisibility: 'public' | 'hidden';
  organizerVisibility: 'public' | 'hidden';
  blockedUsers: BlockedUser[];
  mutedUsers: string[];
}

export interface BlockedUser {
  id: string;
  displayName: string;
  avatarUrl?: string;
  blockedAt: Date;
  reason?: string;
}

// Safety
export interface SafetySettings {
  emergencyContacts: EmergencyContact[];
  meetingSafetyTips: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship?: string;
}

export type ReportReason = 
  | 'spam'
  | 'fake_profile'
  | 'harassment'
  | 'inappropriate_content'
  | 'dangerous_behavior'
  | 'other';

export const REPORT_REASONS: Array<{ value: ReportReason; label: string; icon: string }> = [
  { value: 'spam', label: 'Spam', icon: '📧' },
  { value: 'fake_profile', label: 'Fake Profile', icon: '🎭' },
  { value: 'harassment', label: 'Harassment', icon: '😠' },
  { value: 'inappropriate_content', label: 'Inappropriate Content', icon: '🚫' },
  { value: 'dangerous_behavior', label: 'Dangerous Behavior', icon: '⚠️' },
  { value: 'other', label: 'Other', icon: '❓' },
];

// Devices
export interface ConnectedDevice {
  id: string;
  name: string;
  type: 'mobile' | 'tablet' | 'desktop' | 'web';
  isCurrent: boolean;
  lastActive: Date;
  location?: string;
}

// Storage
export interface StorageSettings {
  cacheSize: number; // in bytes
  offlineDataSize: number;
  downloadedImagesSize: number;
  autoDownload: boolean;
  wifiOnly: boolean;
}

// Support
export interface SupportSettings {
  helpCenter: string;
  faq: string;
  contactEmail: string;
}

// About
export interface AppInfo {
  version: string;
  buildNumber: string;
  termsUrl: string;
  privacyPolicyUrl: string;
  licensesUrl: string;
}

// Settings Navigation
export type SettingsScreen =
  | 'settings-home'
  | 'account'
  | 'appearance'
  | 'language'
  | 'location'
  | 'notifications'
  | 'privacy'
  | 'safety'
  | 'premium'
  | 'support'
  | 'about'
  | 'devices'
  | 'storage';

export interface SettingsSection {
  id: string;
  title: string;
  icon: string;
  screen: SettingsScreen;
  badge?: string;
  beta?: boolean;
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: 'account', title: 'Account', icon: '👤', screen: 'account' },
  { id: 'appearance', title: 'Appearance', icon: '🎨', screen: 'appearance' },
  { id: 'language', title: 'Language', icon: '🌐', screen: 'language' },
  { id: 'location', title: 'Location', icon: '📍', screen: 'location' },
  { id: 'notifications', title: 'Notifications', icon: '🔔', screen: 'notifications' },
  { id: 'privacy', title: 'Privacy', icon: '🔒', screen: 'privacy' },
  { id: 'safety', title: 'Safety Center', icon: '🛡️', screen: 'safety' },
  { id: 'premium', title: 'Premium', icon: '⭐', screen: 'premium' },
  { id: 'support', title: 'Support', icon: '💬', screen: 'support' },
  { id: 'about', title: 'About', icon: 'ℹ️', screen: 'about' },
];

// Theme definitions
export const THEMES: Theme[] = [
  { id: 'system', name: 'System', icon: '🖥️', isPremium: false, colors: { primary: '#3B82F6', secondary: '#8B5CF6', background: '#FFFFFF', surface: '#F3F4F6', text: { primary: '#111827', secondary: '#4B5563', tertiary: '#9CA3AF' }, border: '#E5E7EB' } },
  { id: 'dark', name: 'Dark', icon: '🌙', isPremium: false, colors: { primary: '#60A5FA', secondary: '#A78BFA', background: '#111827', surface: '#1F2937', text: { primary: '#F9FAFB', secondary: '#D1D5DB', tertiary: '#6B7280' }, border: '#374151' } },
  { id: 'midnight', name: 'Midnight', icon: '🌌', isPremium: true, colors: { primary: '#818CF8', secondary: '#C084FC', background: '#0F0F23', surface: '#1A1A2E', text: { primary: '#F8F8FF', secondary: '#B8B8D1', tertiary: '#6B6B8D' }, border: '#2D2D4A' } },
  { id: 'ocean', name: 'Ocean', icon: '🌊', isPremium: true, colors: { primary: '#06B6D4', secondary: '#0EA5E9', background: '#F0F9FF', surface: '#E0F2FE', text: { primary: '#0C4A6E', secondary: '#0369A1', tertiary: '#7DD3FC' }, border: '#BAE6FD' } },
  { id: 'forest', name: 'Forest', icon: '🌲', isPremium: true, colors: { primary: '#22C55E', secondary: '#16A34A', background: '#F0FDF4', surface: '#DCFCE7', text: { primary: '#14532D', secondary: '#166534', tertiary: '#86EFAC' }, border: '#BBF7D0' } },
  { id: 'sunrise', name: 'Sunrise', icon: '🌅', isPremium: true, colors: { primary: '#F97316', secondary: '#FB923C', background: '#FFFBEB', surface: '#FEF3C7', text: { primary: '#78350F', secondary: '#92400E', tertiary: '#FDBA74' }, border: '#FDE68A' } },
  { id: 'graphite', name: 'Graphite', icon: '⬛', isPremium: true, colors: { primary: '#6366F1', secondary: '#4F46E5', background: '#18181B', surface: '#27272A', text: { primary: '#FAFAFA', secondary: '#A1A1AA', tertiary: '#71717A' }, border: '#3F3F46' } },
  { id: 'copper', name: 'Copper', icon: '🟤', isPremium: true, colors: { primary: '#D97706', secondary: '#B45309', background: '#FFFBEB', surface: '#FEF3C7', text: { primary: '#78350F', secondary: '#92400E', tertiary: '#FCD34D' }, border: '#FDE68A' } },
  { id: 'aurora', name: 'Aurora', icon: '✨', isPremium: true, colors: { primary: '#EC4899', secondary: '#D946EF', background: '#FDF2F8', surface: '#FCE7F3', text: { primary: '#831843', secondary: '#9D174D', tertiary: '#F9A8D4' }, border: '#FBCFE8' } },
];
