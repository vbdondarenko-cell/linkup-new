/**
 * LinkUp Design System 2026
 * Shared Enums - Single Source of Truth
 * 
 * These enums are the authoritative definitions used across the entire codebase.
 * All imports should reference these enums instead of duplicating definitions.
 */

// ==================== REPORT ENUMS ====================

/**
 * Reason for reporting content or users
 */
export type ReportReason = 
  | 'spam'
  | 'fake_profile'
  | 'harassment'
  | 'inappropriate_content'
  | 'dangerous_behavior'
  | 'scam'
  | 'other';

/**
 * Status of a report in the review pipeline
 */
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

/**
 * Type of entity being reported
 */
export type ReportTarget = 'event' | 'user' | 'business' | 'message' | 'image' | 'organizer' | 'content';


// ==================== NOTIFICATION ENUMS ====================

/**
 * Types of notifications in the system
 */
export type NotificationType = 
  | 'join_request'
  | 'request_accepted'
  | 'request_declined'
  | 'new_message'
  | 'upcoming_event'
  | 'event_reminder'
  | 'event_started'
  | 'event_finished'
  | 'event_invite'
  | 'event_update'
  | 'event_cancelled'
  | 'participant_joined'
  | 'participant_left'
  | 'chat_message'
  | 'achievement_earned'
  | 'badge_unlocked'
  | 'badge_earned'
  | 'level_up'
  | 'xp_earned'
  | 'trust_increased'
  | 'organizer_promotion'
  | 'business_verified'
  | 'premium_activated'
  | 'premium_unlock'
  | 'reward_premium_ready'
  | 'system'
  | 'system_announcement';


// ==================== CHAT ENUMS ====================

/**
 * Status of a chat/conversation
 */
export type ChatStatus = 'upcoming' | 'active' | 'countdown' | 'expired' | 'deleted';


// ==================== HELPER CONSTANTS ====================

/**
 * Display metadata for report reasons
 */
export const REPORT_REASONS: Array<{ value: ReportReason; label: string; icon: string }> = [
  { value: 'spam', label: 'Spam', icon: '📧' },
  { value: 'fake_profile', label: 'Fake Profile', icon: '🎭' },
  { value: 'harassment', label: 'Harassment', icon: '😠' },
  { value: 'inappropriate_content', label: 'Inappropriate Content', icon: '🚫' },
  { value: 'dangerous_behavior', label: 'Dangerous Behavior', icon: '⚠️' },
  { value: 'scam', label: 'Scam', icon: '🎪' },
  { value: 'other', label: 'Other', icon: '❓' },
];

/**
 * Display metadata for report statuses
 */
export const REPORT_STATUSES: Array<{ value: ReportStatus; label: string; color: string }> = [
  { value: 'pending', label: 'Pending', color: '#F59E0B' },
  { value: 'reviewed', label: 'Reviewed', color: '#3B82F6' },
  { value: 'resolved', label: 'Resolved', color: '#10B981' },
  { value: 'dismissed', label: 'Dismissed', color: '#6B7280' },
];

/**
 * Display metadata for notification types
 */
export const NOTIFICATION_TYPES: Array<{ value: NotificationType; label: string; icon: string }> = [
  { value: 'join_request', label: 'Join Request', icon: '👋' },
  { value: 'request_accepted', label: 'Request Accepted', icon: '✅' },
  { value: 'request_declined', label: 'Request Declined', icon: '❌' },
  { value: 'new_message', label: 'New Message', icon: '💬' },
  { value: 'upcoming_event', label: 'Upcoming Event', icon: '📅' },
  { value: 'event_reminder', label: 'Event Reminder', icon: '⏰' },
  { value: 'event_started', label: 'Event Started', icon: '🚀' },
  { value: 'event_finished', label: 'Event Finished', icon: '🏁' },
  { value: 'event_invite', label: 'Event Invite', icon: '📨' },
  { value: 'event_update', label: 'Event Update', icon: '🔄' },
  { value: 'event_cancelled', label: 'Event Cancelled', icon: '🚫' },
  { value: 'participant_joined', label: 'Participant Joined', icon: '👥' },
  { value: 'participant_left', label: 'Participant Left', icon: '👤' },
  { value: 'chat_message', label: 'Chat Message', icon: '💭' },
  { value: 'achievement_earned', label: 'Achievement Earned', icon: '🏆' },
  { value: 'badge_unlocked', label: 'Badge Unlocked', icon: '🎖️' },
  { value: 'badge_earned', label: 'Badge Earned', icon: '🏅' },
  { value: 'level_up', label: 'Level Up', icon: '⬆️' },
  { value: 'xp_earned', label: 'XP Earned', icon: '⭐' },
  { value: 'trust_increased', label: 'Trust Increased', icon: '🛡️' },
  { value: 'organizer_promotion', label: 'Organizer Promotion', icon: '📣' },
  { value: 'business_verified', label: 'Business Verified', icon: '✅' },
  { value: 'premium_activated', label: 'Premium Activated', icon: '💎' },
  { value: 'premium_unlock', label: 'Premium Unlock', icon: '🔓' },
  { value: 'reward_premium_ready', label: 'Premium Reward Ready', icon: '🎁' },
  { value: 'system', label: 'System', icon: '⚙️' },
  { value: 'system_announcement', label: 'System Announcement', icon: '📢' },
];

/**
 * Display metadata for chat statuses
 */
export const CHAT_STATUSES: Array<{ value: ChatStatus; label: string; color: string }> = [
  { value: 'upcoming', label: 'Upcoming', color: '#3B82F6' },
  { value: 'active', label: 'Active', color: '#10B981' },
  { value: 'countdown', label: 'Starting Soon', color: '#F59E0B' },
  { value: 'expired', label: 'Expired', color: '#6B7280' },
  { value: 'deleted', label: 'Deleted', color: '#EF4444' },
];
