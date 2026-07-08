/**
 * LinkUp Design System 2026
 * Auth & Onboarding State Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { 
  OnboardingState, 
  OnboardingStep, 
  TelegramUser, 
  Interest, 
  UserProfile,
  INTEREST_SELECTION,
  ALL_INTERESTS,
} from '../types';

interface UseAuthStateReturn {
  // State
  state: OnboardingState;
  isOnboardingComplete: boolean;
  canProceed: boolean;
  interestsProgress: { current: number; min: number; max: number };
  
  // Actions
  startTelegramLogin: () => Promise<void>;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  previousStep: () => void;
  selectInterest: (interest: Interest) => void;
  deselectInterest: (interestId: string) => void;
  setRadius: (radius: number) => void;
  setLocation: (location: { latitude: number; longitude: number; city?: string }) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  completeOnboarding: () => Promise<void>;
  skipStep: (step: OnboardingStep) => void;
  retry: () => void;
  reset: () => void;
  
  // Utilities
  getInterestsByCategory: (categoryId: string) => Interest[];
  searchInterests: (query: string) => Interest[];
  getPopularInterests: () => Interest[];
}

const INITIAL_STATE: OnboardingState = {
  currentStep: 'splash',
  telegramUser: null,
  profile: {},
  selectedInterests: [],
  radius: 5,
  location: null,
  notificationsEnabled: false,
  isLoading: false,
  error: null,
};

const STEP_ORDER: OnboardingStep[] = [
  'splash',
  'welcome',
  'telegram-login',
  'loading',
  'location',
  'interests',
  'radius',
  'notifications',
  'profile-preview',
  'welcome-home',
];

export const useAuthState = (): UseAuthStateReturn => {
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);

  // Computed values
  const interestsProgress = {
    current: state.selectedInterests.length,
    min: INTEREST_SELECTION.MIN,
    max: INTEREST_SELECTION.MAX,
  };

  const canProceed = {
    interests: state.selectedInterests.length >= INTEREST_SELECTION.MIN,
    radius: state.radius > 0,
    location: true, // Location can be skipped
    notifications: true, // Notifications can be skipped
  };

  const isOnboardingComplete = state.currentStep === 'welcome-home';

  // Actions
  const setStep = useCallback((step: OnboardingStep) => {
    setState(prev => ({ ...prev, currentStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEP_ORDER.length - 1) {
      setStep(STEP_ORDER[currentIndex + 1]);
    }
  }, [state.currentStep, setStep]);

  const previousStep = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [state.currentStep, setStep]);

  const startTelegramLogin = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate Telegram login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock Telegram user data
      const mockTelegramUser: TelegramUser = {
        id: '123456789',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        photoUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        languageCode: 'en',
      };
      
      setState(prev => ({
        ...prev,
        telegramUser: mockTelegramUser,
        profile: {
          id: `user_${Date.now()}`,
          telegramId: mockTelegramUser.id,
          displayName: `${mockTelegramUser.firstName}${mockTelegramUser.lastName ? ` ${mockTelegramUser.lastName}` : ''}`,
          username: mockTelegramUser.username,
          avatarUrl: mockTelegramUser.photoUrl,
          language: mockTelegramUser.languageCode || 'en',
          memberSince: new Date(),
        },
        isLoading: false,
      }));
      
      nextStep();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to connect to Telegram. Please try again.',
      }));
    }
  }, [nextStep]);

  const selectInterest = useCallback((interest: Interest) => {
    setState(prev => {
      if (prev.selectedInterests.length >= INTEREST_SELECTION.MAX) {
        return prev;
      }
      if (prev.selectedInterests.find(i => i.id === interest.id)) {
        return prev;
      }
      return {
        ...prev,
        selectedInterests: [...prev.selectedInterests, interest],
      };
    });
  }, []);

  const deselectInterest = useCallback((interestId: string) => {
    setState(prev => ({
      ...prev,
      selectedInterests: prev.selectedInterests.filter(i => i.id !== interestId),
    }));
  }, []);

  const setRadius = useCallback((radius: number) => {
    setState(prev => ({ ...prev, radius }));
  }, []);

  const setLocation = useCallback((location: { latitude: number; longitude: number; city?: string }) => {
    setState(prev => ({ ...prev, location, profile: { ...prev.profile, location } }));
  }, []);

  const setNotificationsEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, notificationsEnabled: enabled }));
  }, []);

  const completeOnboarding = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Simulate API call to save profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        currentStep: 'welcome-home',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to save your profile. Please try again.',
      }));
    }
  }, []);

  const skipStep = useCallback((step: OnboardingStep) => {
    // Skip to next required step
    const stepIndex = STEP_ORDER.indexOf(step);
    for (let i = stepIndex + 1; i < STEP_ORDER.length; i++) {
      const nextStep = STEP_ORDER[i];
      if (nextStep !== 'loading') {
        setStep(nextStep);
        break;
      }
    }
  }, [setStep]);

  const retry = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  // Utilities
  const getInterestsByCategory = useCallback((categoryId: string): Interest[] => {
    return ALL_INTERESTS.filter(i => i.category === categoryId);
  }, []);

  const searchInterests = useCallback((query: string): Interest[] => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return ALL_INTERESTS.filter(i => 
      i.name.toLowerCase().includes(lowerQuery) ||
      i.category.toLowerCase().includes(lowerQuery)
    );
  }, []);

  const getPopularInterests = useCallback((): Interest[] => {
    // Return some default popular interests
    return ALL_INTERESTS.slice(0, 12);
  }, []);

  // Auto-advance from splash
  useEffect(() => {
    if (state.currentStep === 'splash') {
      const timer = setTimeout(() => {
        setStep('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.currentStep, setStep]);

  return {
    state,
    isOnboardingComplete,
    canProceed,
    interestsProgress,
    startTelegramLogin,
    setStep,
    nextStep,
    previousStep,
    selectInterest,
    deselectInterest,
    setRadius,
    setLocation,
    setNotificationsEnabled,
    completeOnboarding,
    skipStep,
    retry,
    reset,
    getInterestsByCategory,
    searchInterests,
    getPopularInterests,
  };
};

export type UseAuthStateReturnType = ReturnType<typeof useAuthState>;
