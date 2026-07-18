/**
 * LinkUp Design System 2026
 * Telegram WebApp Provider
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Telegram WebApp types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramWebApp {
  ready: () => void;
  close: () => void;
  expand: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (event: string, callback: () => void) => void;
  offEvent: (event: string, callback: () => void) => void;
  MainButton: {
    show: () => void;
    hide: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: { color?: string; text_color?: string }) => void;
  };
  BackButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  SettingsButton: {
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style?: 'light' | 'medium' | 'heavy') => void;
    notificationOccurred: (type: 'success' | 'warning' | 'error') => void;
    selectionChanged: () => void;
  };
  initData: string;
  initDataUnsafe: {
    query_id?: string;
    user?: TelegramUser;
    receiver?: TelegramUser;
    start_param?: string;
    chat_type?: string;
    chat_instance?: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  platform: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramContextValue {
  webApp: TelegramWebApp | null;
  user: TelegramUser | null;
  isReady: boolean;
  isExpanded: boolean;
  platform: string;
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  haptic: () => {
    impact: (style?: 'light' | 'medium' | 'heavy') => void;
    notification: (type: 'success' | 'warning' | 'error') => void;
    selection: () => void;
  };
  expand: () => void;
  close: () => void;
  showMainButton: () => void;
  hideMainButton: () => void;
  setMainButtonText: (text: string) => void;
  onMainButtonClick: (callback: () => void) => void;
  showBackButton: () => void;
  hideBackButton: () => void;
  onBackButtonClick: (callback: () => void) => void;
}

const TelegramContext = createContext<TelegramContextValue | undefined>(undefined);

interface TelegramProviderProps {
  children: ReactNode;
  onReady?: () => void;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({
  children,
  onReady,
}) => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if running in Telegram WebApp
    const initTelegram = () => {
      // For development/testing without Telegram WebApp
      if (typeof window !== 'undefined') {
        // Check for real Telegram WebApp
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          setWebApp(tg);
          setUser(tg.initDataUnsafe.user || null);
          tg.ready();
          setIsReady(true);
          onReady?.();
        } else {
          // Development mode - create mock WebApp
          const mockWebApp: TelegramWebApp = {
            ready: () => {
              console.log('[Telegram Mock] App ready');
            },
            close: () => {
              console.log('[Telegram Mock] App close');
            },
            expand: () => {
              console.log('[Telegram Mock] App expand');
            },
            enableClosingConfirmation: () => {},
            disableClosingConfirmation: () => {},
            onEvent: () => {},
            offEvent: () => {},
            MainButton: {
              show: () => {},
              hide: () => {},
              setText: () => {},
              onClick: () => {},
              offClick: () => {},
              showProgress: () => {},
              hideProgress: () => {},
              setParams: () => {},
            },
            BackButton: {
              show: () => {},
              hide: () => {},
              onClick: () => {},
              offClick: () => {},
            },
            SettingsButton: {
              show: () => {},
              hide: () => {},
              onClick: () => {},
              offClick: () => {},
            },
            HapticFeedback: {
              impactOccurred: (style = 'medium') => {
                console.log(`[Haptic Mock] Impact: ${style}`);
              },
              notificationOccurred: (type) => {
                console.log(`[Haptic Mock] Notification: ${type}`);
              },
              selectionChanged: () => {
                console.log('[Haptic Mock] Selection changed');
              },
            },
            initData: '',
            initDataUnsafe: {
              user: {
                id: 123456789,
                first_name: 'Demo',
                last_name: 'User',
                username: 'demo_user',
                language_code: 'en',
                is_premium: true,
              },
            },
            colorScheme: 'dark',
            themeParams: {
              bg_color: '#1c1c1e',
              text_color: '#ffffff',
              button_color: '#3399ff',
              button_text_color: '#ffffff',
              secondary_bg_color: '#2c2c2e',
            },
            viewportHeight: 800,
            viewportStableHeight: 700,
            isExpanded: true,
            platform: 'TEST',
          };
          setWebApp(mockWebApp);
          setUser(mockWebApp.initDataUnsafe.user || null);
          setIsReady(true);
          onReady?.();
        }
      }
    };

    initTelegram();
  }, [onReady]);

  const haptic = useCallback(
    () => ({
      impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
        webApp?.HapticFeedback.impactOccurred(style);
      },
      notification: (type: 'success' | 'warning' | 'error') => {
        webApp?.HapticFeedback.notificationOccurred(type);
      },
      selection: () => {
        webApp?.HapticFeedback.selectionChanged();
      },
    }),
    [webApp]
  );

  const expand = useCallback(() => {
    webApp?.expand();
  }, [webApp]);

  const close = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  const showMainButton = useCallback(() => {
    webApp?.MainButton.show();
  }, [webApp]);

  const hideMainButton = useCallback(() => {
    webApp?.MainButton.hide();
  }, [webApp]);

  const setMainButtonText = useCallback((text: string) => {
    webApp?.MainButton.setText(text);
  }, [webApp]);

  const onMainButtonClick = useCallback((callback: () => void) => {
    webApp?.MainButton.onClick(callback);
  }, [webApp]);

  const showBackButton = useCallback(() => {
    webApp?.BackButton.show();
  }, [webApp]);

  const hideBackButton = useCallback(() => {
    webApp?.BackButton.hide();
  }, [webApp]);

  const onBackButtonClick = useCallback((callback: () => void) => {
    webApp?.BackButton.onClick(callback);
  }, [webApp]);

  const value: TelegramContextValue = {
    webApp,
    user,
    isReady,
    isExpanded: webApp?.isExpanded ?? true,
    platform: webApp?.platform ?? 'unknown',
    colorScheme: webApp?.colorScheme ?? 'dark',
    viewportHeight: webApp?.viewportHeight ?? 800,
    haptic,
    expand,
    close,
    showMainButton,
    hideMainButton,
    setMainButtonText,
    onMainButtonClick,
    showBackButton,
    hideBackButton,
    onBackButtonClick,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};

export function useTelegram(): TelegramContextValue {
  const context = useContext(TelegramContext);
  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }
  return context;
}
