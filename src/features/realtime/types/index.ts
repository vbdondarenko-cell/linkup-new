/**
 * LinkUp Design System 2026
 * Realtime & Engagement Types
 */

// ==================== XP ENGINE ====================
export interface XPRule {
  id: string;
  action: string;
  xpAmount: number;
  description: string;
  cooldown?: number; // in milliseconds
}

export const XP_RULES: XPRule[] = [
  { id: 'join_event', action: 'join_event', xpAmount: 10, description: 'Joining an event' },
  { id: 'complete_event', action: 'complete_event', xpAmount: 50, description: 'Completing an event', cooldown: 86400000 },
  { id: 'host_event', action: 'host_event', xpAmount: 100, description: 'Hosting an event', cooldown: 86400000 },
  { id: 'rate_organizer', action: 'rate_organizer', xpAmount: 5, description: 'Rating an organizer' },
  { id: 'rate_event', action: 'rate_event', xpAmount: 5, description: 'Rating an event' },
  { id: 'maintain_attendance', action: 'maintain_attendance', xpAmount: 25, description: 'Maintaining 100% attendance', cooldown: 604800000 },
  { id: 'earn_badge', action: 'earn_badge', xpAmount: 20, description: 'Earning a badge' },
  { id: 'earn_achievement', action: 'earn_achievement', xpAmount: 50, description: 'Earning an achievement' },
  { id: 'organizer_milestone', action: 'organizer_milestone', xpAmount: 100, description: 'Organizer milestone reached' },
  { id: 'community_participation', action: 'community_participation', xpAmount: 15, description: 'Participating in community events' },
  { id: 'streak_7', action: 'streak_7', xpAmount: 75, description: '7-day event attendance streak', cooldown: 604800000 },
  { id: 'streak_30', action: 'streak_30', xpAmount: 200, description: '30-day event attendance streak', cooldown: 2592000000 },
];

export interface XPState {
  currentXP: number;
  totalXP: number;
  level: number;
  levelProgress: number; // 0-100
  recentGains: XPGain[];
}

export interface XPGain {
  id: string;
  amount: number;
  reason: string;
  timestamp: Date;
}

// ==================== LEVEL ENGINE ====================
export interface Level {
  id: number;
  name: string;
  icon: string;
  requiredXP: number;
  rewards: LevelReward[];
  color: string;
}

export interface LevelReward {
  type: 'badge' | 'feature' | 'cosmetic';
  item: string;
  description: string;
}

export const LEVELS: Level[] = [
  { id: 1, name: 'Explorer', icon: '🧭', requiredXP: 0, rewards: [{ type: 'badge', item: 'newcomer', description: 'Welcome badge' }], color: '#94A3B8' },
  { id: 2, name: 'Connector', icon: '🤝', requiredXP: 100, rewards: [{ type: 'badge', item: 'connector_10', description: 'Connected with 10 people' }], color: '#22C55E' },
  { id: 3, name: 'Host', icon: '🏠', requiredXP: 300, rewards: [{ type: 'feature', item: 'host_events', description: 'Can host events' }], color: '#3B82F6' },
  { id: 4, name: 'Leader', icon: '⭐', requiredXP: 750, rewards: [{ type: 'badge', item: 'leader', description: 'Leadership badge' }], color: '#8B5CF6' },
  { id: 5, name: 'Ambassador', icon: '🌟', requiredXP: 1500, rewards: [{ type: 'feature', item: 'verified_organizer', description: 'Verified organizer status' }], color: '#F59E0B' },
  { id: 6, name: 'Legend', icon: '👑', requiredXP: 3000, rewards: [{ type: 'cosmetic', item: 'legend_profile', description: 'Legendary profile theme' }], color: '#EC4899' },
];

// ==================== ACHIEVEMENT ENGINE ====================
export type AchievementStatus = 'locked' | 'in_progress' | 'unlocked';
export type AchievementType = 'community' | 'coffee' | 'sports' | 'travel' | 'music' | 'food' | 'gaming' | 'volunteer' | 'business' | 'culture' | 'education' | 'nightlife' | 'organizer' | 'explorer' | 'premium';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementType;
  xpReward: number;
  requirement: number;
  progress: number;
  status: AchievementStatus;
  isSecret: boolean;
  isLimitedTime: boolean;
  expiresAt?: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Community
  { id: 'first_event', name: 'First Step', description: 'Join your first event', icon: '🎉', category: 'community', xpReward: 50, requirement: 1, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'attend_10', name: 'Getting Started', description: 'Attend 10 events', icon: '🎊', category: 'community', xpReward: 100, requirement: 10, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'attend_50', name: 'Regular', description: 'Attend 50 events', icon: '🏅', category: 'community', xpReward: 250, requirement: 50, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'attend_100', name: 'Dedicated', description: 'Attend 100 events', icon: '🥇', category: 'community', xpReward: 500, requirement: 100, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'perfect_attendance', name: 'Never Late', description: '100% attendance rate for 30 days', icon: '💯', category: 'community', xpReward: 200, requirement: 30, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  
  // Explorer
  { id: 'explorer_5_cities', name: 'Wanderer', description: 'Attend events in 5 different cities', icon: '🌍', category: 'explorer', xpReward: 150, requirement: 5, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'explorer_all_categories', name: 'Well-Rounded', description: 'Attend all event categories', icon: '🎯', category: 'explorer', xpReward: 300, requirement: 20, progress: 0, status: 'locked', isSecret: true, isLimitedTime: false },
  
  // Host
  { id: 'first_host', name: 'Host Debut', description: 'Host your first event', icon: '🎤', category: 'organizer', xpReward: 100, requirement: 1, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'host_10', name: 'Pro Host', description: 'Host 10 events', icon: '🎪', category: 'organizer', xpReward: 300, requirement: 10, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'host_50', name: 'Master Organizer', description: 'Host 50 events', icon: '🏟️', category: 'organizer', xpReward: 750, requirement: 50, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  
  // Premium
  { id: 'premium_member', name: 'Premium Supporter', description: 'Subscribe to Premium', icon: '⭐', category: 'premium', xpReward: 100, requirement: 1, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'premium_year', name: 'Premium Year', description: 'Keep Premium for 1 year', icon: '💎', category: 'premium', xpReward: 500, requirement: 365, progress: 0, status: 'locked', isSecret: true, isLimitedTime: false },
  
  // Streaks
  { id: 'streak_7', name: 'Week Warrior', description: '7-day event streak', icon: '🔥', category: 'community', xpReward: 100, requirement: 7, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'streak_30', name: 'Month Master', description: '30-day event streak', icon: '⚡', category: 'community', xpReward: 300, requirement: 30, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  
  // Social
  { id: 'connections_10', name: 'Social Butterfly', description: 'Connect with 10 people', icon: '🦋', category: 'community', xpReward: 50, requirement: 10, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
  { id: 'five_star', name: 'Perfectionist', description: 'Get five 5-star ratings', icon: '💎', category: 'organizer', xpReward: 100, requirement: 5, progress: 0, status: 'locked', isSecret: false, isLimitedTime: false },
];

// ==================== BADGE ENGINE ====================
export type BadgeType = 'community' | 'verified' | 'organizer' | 'premium' | 'business' | 'legend' | 'ambassador' | 'seasonal' | 'milestone' | 'special';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: BadgeType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: Date;
  isEquipped: boolean;
}

export const BADGES: Badge[] = [
  { id: 'newcomer', name: 'Newcomer', description: 'Welcome to LinkUp', icon: '👋', type: 'community', rarity: 'common', isEquipped: false },
  { id: 'early_adopter', name: 'Early Adopter', description: 'Joined in beta', icon: '🚀', type: 'community', rarity: 'rare', isEquipped: false },
  { id: 'verified', name: 'Verified', description: 'Identity verified', icon: '✓', type: 'verified', rarity: 'rare', isEquipped: false },
  { id: 'premium', name: 'Premium', description: 'Premium subscriber', icon: '⭐', type: 'premium', rarity: 'rare', isEquipped: false },
  { id: 'organizer', name: 'Organizer', description: 'Hosted first event', icon: '🎤', type: 'organizer', rarity: 'rare', isEquipped: false },
  { id: 'pro_organizer', name: 'Pro Organizer', description: 'Hosted 10 events', icon: '🎪', type: 'organizer', rarity: 'epic', isEquipped: false },
  { id: 'legend_organizer', name: 'Legend Organizer', description: 'Hosted 50 events', icon: '🏟️', type: 'organizer', rarity: 'legendary', isEquipped: false },
  { id: 'connector', name: 'Connector', description: 'Made 50 connections', icon: '🤝', type: 'community', rarity: 'rare', isEquipped: false },
  { id: 'ambassador', name: 'Ambassador', description: 'Community ambassador', icon: '🌟', type: 'ambassador', rarity: 'epic', isEquipped: false },
  { id: 'legend', name: 'Legend', description: 'Legendary member', icon: '👑', type: 'legend', rarity: 'legendary', isEquipped: false },
  { id: 'business', name: 'Business Partner', description: 'Business verified', icon: '🏢', type: 'business', rarity: 'rare', isEquipped: false },
  { id: 'streak_7', name: '7-Day Streak', description: '7 days in a row', icon: '🔥', type: 'milestone', rarity: 'common', isEquipped: false },
  { id: 'streak_30', name: '30-Day Streak', description: '30 days in a row', icon: '⚡', type: 'milestone', rarity: 'epic', isEquipped: false },
  { id: 'five_star', name: 'Five Star', description: '5-star rated host', icon: '💎', type: 'milestone', rarity: 'rare', isEquipped: false },
];

// ==================== REPUTATION ENGINE ====================
export interface ReputationState {
  score: number;
  level: ReputationLevel;
  changeHistory: ReputationChange[];
}

export type ReputationLevel = 'new' | 'low' | 'medium' | 'high' | 'trusted' | 'elite';

export interface ReputationChange {
  id: string;
  change: number;
  reason: string;
  timestamp: Date;
}

export const REPUTATION_LEVELS: Array<{ level: ReputationLevel; minScore: number; maxScore: number; color: string }> = [
  { level: 'new', minScore: 0, maxScore: 20, color: '#94A3B8' },
  { level: 'low', minScore: 20, maxScore: 40, color: '#EF4444' },
  { level: 'medium', minScore: 40, maxScore: 60, color: '#F59E0B' },
  { level: 'high', minScore: 60, maxScore: 80, color: '#22C55E' },
  { level: 'trusted', minScore: 80, maxScore: 95, color: '#3B82F6' },
  { level: 'elite', minScore: 95, maxScore: 100, color: '#8B5CF6' },
];

// ==================== NOTIFICATIONS ====================
export type NotificationType = 
  | 'join_request'
  | 'request_accepted'
  | 'request_declined'
  | 'new_message'
  | 'upcoming_event'
  | 'event_reminder'
  | 'event_started'
  | 'event_finished'
  | 'achievement_earned'
  | 'badge_unlocked'
  | 'level_up'
  | 'trust_increased'
  | 'organizer_promotion'
  | 'business_verified'
  | 'premium_activated'
  | 'reward_premium_ready'
  | 'system_announcement';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  imageUrl?: string;
  deepLink?: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isArchived: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationGroup {
  title: string;
  data: Notification[];
}

// ==================== ACTIVITY TIMELINE ====================
export type ActivityType = 'joined_event' | 'hosted_event' | 'achievement' | 'badge' | 'level_up' | 'trust_increase' | 'premium_activated' | 'streak';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  icon: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// ==================== STREAKS ====================
export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastEventDate?: Date;
  monthlyEvents: number;
  yearlyEvents: number;
  missedEvents: number;
  completedEvents: number;
}

// ==================== REALTIME ====================
export type RealtimeEvent = 
  | 'new_event'
  | 'updated_event'
  | 'deleted_event'
  | 'join_request'
  | 'accepted_request'
  | 'declined_request'
  | 'new_message'
  | 'participant_count'
  | 'organizer_change'
  | 'business_update'
  | 'notification'
  | 'achievement'
  | 'xp_update'
  | 'trust_update'
  | 'premium_status';

export interface RealtimeState {
  isConnected: boolean;
  lastSyncAt?: Date;
  pendingUpdates: number;
  error?: string;
}

// ==================== CELEBRATION ====================
export interface Celebration {
  id: string;
  type: 'xp_gain' | 'level_up' | 'achievement' | 'badge' | 'streak';
  title: string;
  message: string;
  icon: string;
  data?: Record<string, unknown>;
}
