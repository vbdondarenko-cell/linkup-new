/**
 * LinkUp Design System 2026
 * Premium State Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  UserSubscription, 
  RewardPremiumState, 
  ThemeType, 
  PremiumTheme,
  PremiumNotification,
  SubscriptionPlan,
  PurchaseState,
  REWARD_ADS_REQUIRED,
  REWARD_PREMIUM_DURATION_HOURS,
  REWARD_COOLDOWN_HOURS,
  PREMIUM_THEMES,
  DEFAULT_PLANS,
} from '../types';

interface PremiumState {
  isPremium: boolean;
  subscription: UserSubscription | null;
  rewardState: RewardPremiumState;
  currentTheme: ThemeType;
  themes: PremiumTheme[];
  notifications: PremiumNotification[];
  isLoading: boolean;
  purchaseState: PurchaseState;
  availablePlans: SubscriptionPlan[];
}

// Mock subscription data
const generateMockSubscription = (): UserSubscription => ({
  id: 'sub_1',
  userId: 'user_1',
  planId: 'monthly',
  status: 'active',
  startedAt: new Date(Date.now() - 86400000 * 15),
  expiresAt: new Date(Date.now() + 86400000 * 15),
  autoRenew: true,
  paymentMethod: 'Visa •••• 4242',
  lastPaymentAt: new Date(Date.now() - 86400000 * 15),
  nextPaymentAt: new Date(Date.now() + 86400000 * 15),
});

const generateMockRewardState = (): RewardPremiumState => ({
  adsWatched: 3,
  adsRequired: REWARD_ADS_REQUIRED,
  cooldownHours: REWARD_COOLDOWN_HOURS,
  isPremiumUnlocked: false,
  rewardHistory: [
    { unlockedAt: new Date(Date.now() - 86400000 * 7), expiresAt: new Date(Date.now() - 86400000 * 6), source: 'reward' },
    { unlockedAt: new Date(Date.now() - 86400000 * 14), expiresAt: new Date(Date.now() - 86400000 * 13), source: 'reward' },
  ],
});

const generateMockNotifications = (): PremiumNotification[] => [
  { id: 'n1', type: 'premium_expiring', title: 'Premium Expiring Soon', body: 'Your Premium subscription expires in 15 days', createdAt: new Date(Date.now() - 3600000), read: false },
  { id: 'n2', type: 'reward_ready', title: 'Reward Ready!', body: 'Watch an ad to unlock 24h of Premium', createdAt: new Date(Date.now() - 7200000), read: true },
];

export const usePremiumState = () => {
  const [state, setState] = useState<PremiumState>({
    isPremium: true,
    subscription: null,
    rewardState: {
      adsWatched: 0,
      adsRequired: REWARD_ADS_REQUIRED,
      cooldownHours: REWARD_COOLDOWN_HOURS,
      isPremiumUnlocked: false,
      rewardHistory: [],
    },
    currentTheme: 'system',
    themes: PREMIUM_THEMES,
    notifications: [],
    isLoading: true,
    purchaseState: {
      isPurchasing: false,
      selectedPlan: null,
      error: null,
      isProcessing: false,
      success: false,
    },
    availablePlans: DEFAULT_PLANS,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        subscription: generateMockSubscription(),
        rewardState: generateMockRewardState(),
        notifications: generateMockNotifications(),
        isPremium: true,
        isLoading: false,
      }));
    };
    
    loadData();
  }, []);

  // Actions
  const selectPlan = useCallback((plan: SubscriptionPlan) => {
    setState(prev => ({
      ...prev,
      purchaseState: { ...prev.purchaseState, selectedPlan: plan, error: null },
    }));
  }, []);

  const purchaseSubscription = useCallback(async () => {
    setState(prev => ({
      ...prev,
      purchaseState: { ...prev.purchaseState, isProcessing: true, error: null },
    }));

    // Simulate purchase
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    setState(prev => ({
      ...prev,
      isPremium: true,
      subscription: {
        id: 'sub_new',
        userId: 'user_1',
        planId: prev.purchaseState.selectedPlan?.id || 'monthly',
        status: 'active',
        startedAt: new Date(),
        expiresAt: new Date(Date.now() + 86400000 * 30),
        autoRenew: true,
        paymentMethod: 'Visa •••• 4242',
      },
      purchaseState: { isPurchasing: false, selectedPlan: null, error: null, isProcessing: false, success: true },
    }));
  }, []);

  const cancelSubscription = useCallback(() => {
    setState(prev => ({
      ...prev,
      subscription: prev.subscription ? { ...prev.subscription, autoRenew: false } : null,
    }));
  }, []);

  const restorePurchase = useCallback(async () => {
    setState(prev => ({
      ...prev,
      purchaseState: { ...prev.purchaseState, isProcessing: true, error: null },
    }));

    await new Promise(resolve => setTimeout(resolve, 1500));

    setState(prev => ({
      ...prev,
      isPremium: true,
      subscription: generateMockSubscription(),
      purchaseState: { isPurchasing: false, selectedPlan: null, error: null, isProcessing: false, success: true },
    }));
  }, []);

  const setTheme = useCallback((themeId: ThemeType) => {
    const theme = PREMIUM_THEMES.find(t => t.id === themeId);
    if (theme && (!theme.isPremiumRequired || state.isPremium)) {
      setState(prev => ({ ...prev, currentTheme: themeId }));
    }
  }, [state.isPremium]);

  const watchAd = useCallback(async () => {
    if (state.rewardState.cooldownEndsAt && new Date() < state.rewardState.cooldownEndsAt) {
      return;
    }

    // Simulate watching ad
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newAdsWatched = state.rewardState.adsWatched + 1;
    const isUnlocked = newAdsWatched >= REWARD_ADS_REQUIRED;

    if (isUnlocked) {
      setState(prev => ({
        ...prev,
        isPremium: true,
        rewardState: {
          ...prev.rewardState,
          adsWatched: 0,
          isPremiumUnlocked: true,
          premiumExpiresAt: new Date(Date.now() + REWARD_PREMIUM_DURATION_HOURS * 3600000),
          cooldownEndsAt: new Date(Date.now() + REWARD_COOLDOWN_HOURS * 3600000),
          rewardHistory: [
            ...prev.rewardState.rewardHistory,
            {
              unlockedAt: new Date(),
              expiresAt: new Date(Date.now() + REWARD_PREMIUM_DURATION_HOURS * 3600000),
              source: 'reward' as const,
            },
          ],
        },
      }));
    } else {
      setState(prev => ({
        ...prev,
        rewardState: { ...prev.rewardState, adsWatched: newAdsWatched },
      }));
    }
  }, [state.rewardState]);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const resetPurchaseState = useCallback(() => {
    setState(prev => ({
      ...prev,
      purchaseState: { isPurchasing: false, selectedPlan: null, error: null, isProcessing: false, success: false },
    }));
  }, []);

  return {
    ...state,
    selectPlan,
    purchaseSubscription,
    cancelSubscription,
    restorePurchase,
    setTheme,
    watchAd,
    markNotificationRead,
    resetPurchaseState,
  };
};

export type UsePremiumStateReturn = ReturnType<typeof usePremiumState>;
