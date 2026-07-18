/**
 * LinkUp Design System 2026
 * App State Store - Global application state management
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// User types
export interface User {
  id: string;
  telegramId: string;
  displayName: string;
  username?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  language: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
  radius: number;
  interests: string[];
  memberSince: Date;
  trustScore: number;
  xp: number;
  level: number;
  isPremium: boolean;
  isOrganizer: boolean;
  isBusiness: boolean;
  isVerified: boolean;
}

// App screens
export type AppScreen = 
  | 'onboarding'
  | 'main'
  | 'event-details'
  | 'chat'
  | 'profile-edit'
  | 'create-event'
  | 'settings'
  | 'premium';

// Main tabs
export type MainTab = 'map' | 'discovery' | 'chats' | 'profile';

// Event types
export interface Event {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  category: string;
  categoryIcon?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  locationName?: string;
  locationAddress?: string;
  latitude: number;
  longitude: number;
  maxParticipants?: number;
  currentParticipants: number;
  minParticipants: number;
  price: number;
  isFree: boolean;
  currency: string;
  organizerId: string;
  organizerName: string;
  organizerAvatar?: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  isFeatured: boolean;
  isTrending: boolean;
  isPremium: boolean;
  averageRating: number;
  ratingCount: number;
  requiresApproval: boolean;
  distance?: string;
}

// Chat types
import { ChatStatus } from '../../shared/types/enums';

export interface Chat {
  id: string;
  eventId: string;
  eventTitle: string;
  participantIds: string[];
  createdAt: Date;
  expiresAt: Date;
  status: ChatStatus;
  lastMessage?: {
    text: string;
    senderId: string;
    senderName: string;
    createdAt: Date;
  };
  unreadCount: number;
  eventImage?: string;
  organizerName?: string;
  organizerAvatar?: string;
  participantCount?: number;
  countdownEndsAt?: Date;
  eventStartsAt?: Date;
  distance?: string;
  category?: string;
  categoryIcon?: string;
}

// App State
interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isOnboardingComplete: boolean;
  
  // Navigation state
  currentScreen: AppScreen;
  currentTab: MainTab;
  
  // Selected items
  selectedEventId: string | null;
  selectedChatId: string | null;
  
  // Events cache
  events: Event[];
  
  // Chats cache
  chats: Chat[];
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuth: boolean) => void;
  setOnboardingComplete: (isComplete: boolean) => void;
  
  setCurrentScreen: (screen: AppScreen) => void;
  setCurrentTab: (tab: MainTab) => void;
  
  setSelectedEventId: (eventId: string | null) => void;
  setSelectedChatId: (chatId: string | null) => void;
  
  setEvents: (events: Event[]) => void;
  addEvent: (event: Event) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  
  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  
  setLoading: (isLoading: boolean) => void;
  setInitialized: (isInitialized: boolean) => void;
  
  reset: () => void;
}

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isOnboardingComplete: false,
  currentScreen: 'onboarding' as AppScreen,
  currentTab: 'map' as MainTab,
  selectedEventId: null,
  selectedChatId: null,
  events: [],
  chats: [],
  isLoading: false,
  isInitialized: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // User actions
      setUser: (user) => set({ user }),
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setOnboardingComplete: (isOnboardingComplete) => set({ isOnboardingComplete }),
      
      // Navigation actions
      setCurrentScreen: (currentScreen) => set({ currentScreen }),
      setCurrentTab: (currentTab) => set({ currentTab }),
      
      // Selection actions
      setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
      setSelectedChatId: (selectedChatId) => set({ selectedChatId }),
      
      // Events actions
      setEvents: (events) => set({ events }),
      addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
      updateEvent: (eventId, updates) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, ...updates } : e
          ),
        })),
      
      // Chats actions
      setChats: (chats) => set({ chats }),
      addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c.id === chatId ? { ...c, ...updates } : c
          ),
        })),
      
      // Loading actions
      setLoading: (isLoading) => set({ isLoading }),
      setInitialized: (isInitialized) => set({ isInitialized }),
      
      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'linkup-app-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isOnboardingComplete: state.isOnboardingComplete,
        events: state.events,
        chats: state.chats,
      }),
    }
  )
);

// Selector hooks
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const useCurrentScreen = () => useAppStore((state) => state.currentScreen);
export const useCurrentTab = () => useAppStore((state) => state.currentTab);
export const useEvents = () => useAppStore((state) => state.events);
export const useChats = () => useAppStore((state) => state.chats);
