/**
 * LinkUp Design System 2026
 * Premium Experience Types
 */

// Subscription Plan
export type PlanType = 'monthly' | 'yearly' | 'lifetime';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'grace_period';

export interface SubscriptionPlan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | 'one_time';
  savings?: number; // Percentage saved
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  startedAt: Date;
  expiresAt?: Date;
  autoRenew: boolean;
  paymentMethod?: string;
  lastPaymentAt?: Date;
  nextPaymentAt?: Date;
}

// Reward Premium
export interface RewardPremiumState {
  adsWatched: number;
  adsRequired: number;
  cooldownEndsAt?: Date;
  cooldownHours: number;
  isPremiumUnlocked: boolean;
  premiumExpiresAt?: Date;
  rewardHistory: RewardHistoryItem[];
}

export interface RewardHistoryItem {
  unlockedAt: Date;
  expiresAt: Date;
  source: 'reward' | 'purchase';
}

// Premium Themes
export type ThemeType = 'default' | 'light' | 'dark' | 'system' | 'midnight' | 'ocean' | 'forest' | 'sunrise' | 'graphite' | 'copper' | 'aurora';

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
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  premium: {
    gold: string;
    silver: string;
    bronze: string;
  };
}

export interface PremiumTheme {
  id: ThemeType;
  name: string;
  icon: string;
  colors: ThemeColors;
  isPremiumRequired: boolean;
  preview?: string;
}

// Benefit
export interface PremiumBenefit {
  id: string;
  icon: string;
  title: string;
  description: string;
  isFree: boolean;
  isPremium: boolean;
}

// Comparison Feature
export interface ComparisonFeature {
  id: string;
  name: string;
  free: boolean | string;
  premium: boolean | string;
}

// FAQ Item
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'subscription' | 'reward' | 'privacy' | 'refund';
}

// Purchase
export interface PurchaseState {
  isPurchasing: boolean;
  selectedPlan: SubscriptionPlan | null;
  error: string | null;
  isProcessing: boolean;
  success: boolean;
}

// Notification
export interface PremiumNotification {
  id: string;
  type: 'premium_activated' | 'premium_expiring' | 'subscription_renewed' | 'payment_failed' | 'reward_ready' | 'cooldown_finished';
  title: string;
  body: string;
  createdAt: Date;
  read: boolean;
}

// Quick Action
export interface PremiumQuickAction {
  id: string;
  label: string;
  icon: string;
  action: string;
}

// Navigation
export type PremiumScreen = 
  | 'premium-home'
  | 'plans'
  | 'comparison'
  | 'reward'
  | 'themes'
  | 'subscription'
  | 'billing'
  | 'faq'
  | 'settings'
  | 'notifications';

// Constants
export const REWARD_ADS_REQUIRED = 5;
export const REWARD_PREMIUM_DURATION_HOURS = 24;
export const REWARD_COOLDOWN_HOURS = 72;

export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'monthly',
    type: 'monthly',
    name: 'Premium Monthly',
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    features: [
      'Premium Themes',
      'Advanced Filters',
      'Extended Analytics',
      'Unlimited Events',
      'Priority Support',
    ],
  },
  {
    id: 'yearly',
    type: 'yearly',
    name: 'Premium Yearly',
    price: 79.99,
    currency: 'USD',
    interval: 'year',
    savings: 33,
    features: [
      'Everything in Monthly',
      '2 months free',
      'Early access to new features',
      'Exclusive badge',
    ],
    isPopular: true,
  },
];

export const PREMIUM_BENEFITS: PremiumBenefit[] = [
  { id: 'themes', icon: '🎨', title: 'Premium Themes', description: 'Express yourself with exclusive themes', isFree: false, isPremium: true },
  { id: 'filters', icon: '🔍', title: 'Advanced Filters', description: 'Find events your way with powerful filters', isFree: true, isPremium: true },
  { id: 'analytics', icon: '📊', title: 'Extended Analytics', description: 'Deep insights into your events', isFree: false, isPremium: true },
  { id: 'events', icon: '📅', title: 'Unlimited Events', description: 'Create more, connect more', isFree: false, isPremium: true },
  { id: 'support', icon: '💬', title: 'Priority Support', description: 'Get help when you need it', isFree: false, isPremium: true },
  { id: 'badge', icon: '⭐', title: 'Exclusive Badge', description: 'Stand out in the community', isFree: false, isPremium: true },
];

export const COMPARISON_FEATURES: ComparisonFeature[] = [
  { id: 'events', name: 'Event Creation', free: '3 per month', premium: 'Unlimited' },
  { id: 'themes', name: 'Themes', free: 'Default only', premium: '10+ Premium themes' },
  { id: 'filters', name: 'Event Filters', free: 'Basic', premium: 'Advanced' },
  { id: 'analytics', name: 'Analytics', free: 'Basic stats', premium: 'Deep insights' },
  { id: 'badges', name: 'Profile Badges', free: '1', premium: 'Unlimited' },
  { id: 'support', name: 'Support', free: 'Community', premium: 'Priority' },
];

export const PREMIUM_THEMES: PremiumTheme[] = [
  { id: 'system', name: 'System', icon: '🖥️', isPremiumRequired: false, colors: { primary: '#3B82F6', secondary: '#8B5CF6', background: '#FFFFFF', surface: '#F3F4F6', text: { primary: '#111827', secondary: '#4B5563', tertiary: '#9CA3AF' }, border: '#E5E7EB', status: { success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#3B82F6' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'dark', name: 'Dark', icon: '🌙', isPremiumRequired: false, colors: { primary: '#60A5FA', secondary: '#A78BFA', background: '#111827', surface: '#1F2937', text: { primary: '#F9FAFB', secondary: '#D1D5DB', tertiary: '#6B7280' }, border: '#374151', status: { success: '#34D399', warning: '#FBBF24', error: '#F87171', info: '#60A5FA' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'midnight', name: 'Midnight', icon: '🌌', isPremiumRequired: true, colors: { primary: '#818CF8', secondary: '#C084FC', background: '#0F0F23', surface: '#1A1A2E', text: { primary: '#F8F8FF', secondary: '#B8B8D1', tertiary: '#6B6B8D' }, border: '#2D2D4A', status: { success: '#4ADE80', warning: '#FBBF24', error: '#F87171', info: '#818CF8' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'ocean', name: 'Ocean', icon: '🌊', isPremiumRequired: true, colors: { primary: '#06B6D4', secondary: '#0EA5E9', background: '#F0F9FF', surface: '#E0F2FE', text: { primary: '#0C4A6E', secondary: '#0369A1', tertiary: '#7DD3FC' }, border: '#BAE6FD', status: { success: '#10B981', warning: '#F59E0B', error: '#EF4444', info: '#0EA5E9' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'forest', name: 'Forest', icon: '🌲', isPremiumRequired: true, colors: { primary: '#22C55E', secondary: '#16A34A', background: '#F0FDF4', surface: '#DCFCE7', text: { primary: '#14532D', secondary: '#166534', tertiary: '#86EFAC' }, border: '#BBF7D0', status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#22C55E' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'sunrise', name: 'Sunrise', icon: '🌅', isPremiumRequired: true, colors: { primary: '#F97316', secondary: '#FB923C', background: '#FFFBEB', surface: '#FEF3C7', text: { primary: '#78350F', secondary: '#92400E', tertiary: '#FDBA74' }, border: '#FDE68A', status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#F97316' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'graphite', name: 'Graphite', icon: '⬛', isPremiumRequired: true, colors: { primary: '#6366F1', secondary: '#4F46E5', background: '#18181B', surface: '#27272A', text: { primary: '#FAFAFA', secondary: '#A1A1AA', tertiary: '#71717A' }, border: '#3F3F46', status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#6366F1' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'copper', name: 'Copper', icon: '🟤', isPremiumRequired: true, colors: { primary: '#D97706', secondary: '#B45309', background: '#FFFBEB', surface: '#FEF3C7', text: { primary: '#78350F', secondary: '#92400E', tertiary: '#FCD34D' }, border: '#FDE68A', status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#D97706' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
  { id: 'aurora', name: 'Aurora', icon: '✨', isPremiumRequired: true, colors: { primary: '#EC4899', secondary: '#D946EF', background: '#FDF2F8', surface: '#FCE7F3', text: { primary: '#831843', secondary: '#9D174D', tertiary: '#F9A8D4' }, border: '#FBCFE8', status: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#EC4899' }, premium: { gold: '#FFD700', silver: '#C0C0C0', bronze: '#CD7F32' } },
];

export const FAQ_ITEMS: FAQItem[] = [
  { id: '1', question: 'What is Premium?', answer: 'Premium is an optional subscription that enhances your LinkUp experience with exclusive themes, advanced features, and priority support. Free users always have a complete experience.', category: 'general' },
  { id: '2', question: 'What does Premium include?', answer: 'Premium includes: Premium Themes, Advanced Filters, Extended Analytics, Unlimited Events, Priority Support, and Exclusive Badges. Nothing affects event ranking or recommendations unfairly.', category: 'general' },
  { id: '3', question: 'How does Reward Premium work?', answer: 'Watch 5 rewarded advertisements to unlock 24 hours of Premium for free. After claiming your reward, there\'s a 72-hour cooldown before you can earn another reward.', category: 'reward' },
  { id: '4', question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription anytime. You\'ll continue to have Premium access until the end of your billing period.', category: 'subscription' },
  { id: '5', question: 'Is there a refund policy?', answer: 'We offer refunds within 14 days of purchase if you\'re not satisfied. Contact support for assistance.', category: 'refund' },
  { id: '6', question: 'Does Premium affect my visibility?', answer: 'No. Premium never affects event ranking, recommendations, or search results. It\'s purely about convenience and personalization.', category: 'general' },
];
