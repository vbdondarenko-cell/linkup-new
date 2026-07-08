/**
 * LinkUp Design System 2026
 * Settings State Hook
 */

import { useState, useCallback, useEffect } from 'react';
import {
  UserAccount,
  AppearanceSettings,
  LanguageSettings,
  LocationSettings,
  NotificationSettings,
  PrivacySettings,
  SafetySettings,
  ConnectedDevice,
  StorageSettings,
  ThemeType,
  NotificationType,
  SUPPORTED_LANGUAGES,
} from '../types';

interface SettingsState {
  account: UserAccount | null;
  appearance: AppearanceSettings;
  language: LanguageSettings;
  location: LocationSettings;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  safety: SafetySettings;
  devices: ConnectedDevice[];
  storage: StorageSettings;
  isLoading: boolean;
}

// Mock data
const generateMockAccount = (): UserAccount => ({
  id: 'user_1',
  telegramId: '123456789',
  displayName: 'John Doe',
  username: 'johndoe',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  memberSince: new Date('2024-01-15'),
  isPremium: true,
  isOrganizer: true,
  isBusiness: false,
});

const generateMockDevices = (): ConnectedDevice[] => [
  { id: 'dev_1', name: 'iPhone 15 Pro', type: 'mobile', isCurrent: true, lastActive: new Date(), location: 'San Francisco, CA' },
  { id: 'dev_2', name: 'MacBook Pro', type: 'desktop', isCurrent: false, lastActive: new Date(Date.now() - 86400000 * 2), location: 'San Francisco, CA' },
  { id: 'dev_3', name: 'iPad Pro', type: 'tablet', isCurrent: false, lastActive: new Date(Date.now() - 86400000 * 7), location: 'New York, NY' },
];

const generateMockStorage = (): StorageSettings => ({
  cacheSize: 256 * 1024 * 1024, // 256 MB
  offlineDataSize: 128 * 1024 * 1024, // 128 MB
  downloadedImagesSize: 64 * 1024 * 1024, // 64 MB
  autoDownload: true,
  wifiOnly: true,
});

const defaultNotificationSettings: NotificationSettings = {
  push: true,
  inApp: true,
  sound: true,
  vibration: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  focusMode: false,
  categories: {
    join_requests: { enabled: true, push: true, sound: true },
    messages: { enabled: true, push: true, sound: true },
    accepted_requests: { enabled: true, push: true, sound: true },
    declined_requests: { enabled: false, push: false, sound: false },
    upcoming_events: { enabled: true, push: true, sound: true },
    event_reminders: { enabled: true, push: true, sound: true },
    recommendations: { enabled: true, push: false, sound: false },
    achievements: { enabled: true, push: false, sound: false },
    premium: { enabled: true, push: true, sound: true },
    business: { enabled: true, push: true, sound: true },
    organizer: { enabled: true, push: true, sound: true },
  },
};

export const useSettingsState = () => {
  const [state, setState] = useState<SettingsState>({
    account: null,
    appearance: { theme: 'system', dynamicType: true, reduceMotion: false, highContrast: false },
    language: { language: 'en', autoDetect: true, useDeviceLanguage: true },
    location: { radius: 10, useGPS: true, savedPlaces: [] },
    notifications: defaultNotificationSettings,
    privacy: {
      profileVisibility: 'public',
      showStatistics: true,
      showAchievements: true,
      showInterests: true,
      activityVisibility: 'public',
      organizerVisibility: 'public',
      blockedUsers: [],
      mutedUsers: [],
    },
    safety: { emergencyContacts: [], meetingSafetyTips: true },
    devices: [],
    storage: generateMockStorage(),
    isLoading: true,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        account: generateMockAccount(),
        devices: generateMockDevices(),
        isLoading: false,
      }));
    };
    
    loadData();
  }, []);

  // Appearance actions
  const setTheme = useCallback((theme: ThemeType) => {
    setState(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme },
    }));
  }, []);

  const setAppearanceSetting = useCallback(<K extends keyof AppearanceSettings>(key: K, value: AppearanceSettings[K]) => {
    setState(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value },
    }));
  }, []);

  // Language actions
  const setLanguage = useCallback((languageCode: string) => {
    setState(prev => ({
      ...prev,
      language: { ...prev.language, language: languageCode, autoDetect: false },
    }));
  }, []);

  // Location actions
  const setLocationRadius = useCallback((radius: number) => {
    setState(prev => ({
      ...prev,
      location: { ...prev.location, radius },
    }));
  }, []);

  const setUseGPS = useCallback((useGPS: boolean) => {
    setState(prev => ({
      ...prev,
      location: { ...prev.location, useGPS },
    }));
  }, []);

  // Notification actions
  const setNotificationSetting = useCallback(<K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    setState(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
  }, []);

  const setCategoryNotification = useCallback((category: NotificationType, enabled: boolean) => {
    setState(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        categories: {
          ...prev.notifications.categories,
          [category]: { ...prev.notifications.categories[category], enabled },
        },
      },
    }));
  }, []);

  // Privacy actions
  const setPrivacySetting = useCallback(<K extends keyof PrivacySettings>(key: K, value: PrivacySettings[K]) => {
    setState(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value },
    }));
  }, []);

  const blockUser = useCallback((userId: string, displayName: string, reason?: string) => {
    setState(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedUsers: [
          ...prev.privacy.blockedUsers,
          { id: userId, displayName, blockedAt: new Date(), reason },
        ],
      },
    }));
  }, []);

  const unblockUser = useCallback((userId: string) => {
    setState(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        blockedUsers: prev.privacy.blockedUsers.filter(u => u.id !== userId),
      },
    }));
  }, []);

  // Storage actions
  const clearCache = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setState(prev => ({
      ...prev,
      storage: { ...prev.storage, cacheSize: 0 },
    }));
  }, []);

  const resetOfflineData = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setState(prev => ({
      ...prev,
      storage: { ...prev.storage, offlineDataSize: 0, downloadedImagesSize: 0 },
    }));
  }, []);

  // Device actions
  const logoutDevice = useCallback((deviceId: string) => {
    setState(prev => ({
      ...prev,
      devices: prev.devices.filter(d => d.id !== deviceId),
    }));
  }, []);

  const logoutAllDevices = useCallback(() => {
    setState(prev => ({
      ...prev,
      devices: prev.devices.filter(d => d.isCurrent),
    }));
  }, []);

  return {
    ...state,
    setTheme,
    setAppearanceSetting,
    setLanguage,
    setLocationRadius,
    setUseGPS,
    setNotificationSetting,
    setCategoryNotification,
    setPrivacySetting,
    blockUser,
    unblockUser,
    clearCache,
    resetOfflineData,
    logoutDevice,
    logoutAllDevices,
  };
};

export type UseSettingsStateReturn = ReturnType<typeof useSettingsState>;
