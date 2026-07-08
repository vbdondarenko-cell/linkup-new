/**
 * LinkUp Design System 2026
 * Backend Types
 */

// =====================================================
// DATABASE TYPES
// =====================================================

export type UUID = string;

export interface Timestamp {
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface CreatedBy {
  created_by: UUID;
}

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'guest' | 'user' | 'organizer' | 'business' | 'moderator' | 'admin' | 'super_admin';

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';

export type RequestStatus = 'pending' | 'accepted' | 'declined';

export type PremiumPlan = 'monthly' | 'yearly';

export type PremiumStatus = 'active' | 'expired' | 'cancelled' | 'trial';

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

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export type ReportReason = 
  | 'spam'
  | 'fake_profile'
  | 'harassment'
  | 'inappropriate_content'
  | 'dangerous_behavior'
  | 'other';

export type BusinessRank = 'verified' | 'featured' | 'premium' | 'hub' | 'ambassador';

export type OrganizerRank = 'newcomer' | 'rising' | 'pro' | 'community' | 'elite' | 'legend';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export type BadgeType = 
  | 'community' 
  | 'verified' 
  | 'organizer' 
  | 'premium' 
  | 'business' 
  | 'legend' 
  | 'ambassador' 
  | 'seasonal' 
  | 'milestone' 
  | 'special';

// =====================================================
// PROFILES
// =====================================================

export interface Profile {
  id: UUID;
  telegram_id?: string;
  telegram_username?: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  language: string;
  timezone: string;
  latitude?: number;
  longitude?: number;
  current_city?: string;
  radius: number;
  trust_score: number;
  xp_total: number;
  xp_current: number;
  level: number;
  is_premium: boolean;
  is_organizer: boolean;
  is_business: boolean;
  is_verified: boolean;
  member_since: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// =====================================================
// RBAC
// =====================================================

export interface Role {
  id: UUID;
  name: UserRole;
  display_name: string;
  description?: string;
  priority: number;
  created_at: string;
}

export interface Permission {
  id: UUID;
  name: string;
  resource: string;
  action: string;
  description?: string;
  created_at: string;
}

export interface UserRoleAssignment {
  user_id: UUID;
  role_id: UUID;
  assigned_at: string;
  assigned_by?: UUID;
}

export interface RolePermission {
  role_id: UUID;
  permission_id: UUID;
}

// =====================================================
// INTERESTS
// =====================================================

export interface InterestCategory {
  id: UUID;
  name: string;
  icon?: string;
  color?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Interest {
  id: UUID;
  category_id: UUID;
  name: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserInterest {
  user_id: UUID;
  interest_id: UUID;
  created_at: string;
}

// =====================================================
// EVENTS
// =====================================================

export interface Event {
  id: UUID;
  title: string;
  description?: string;
  cover_image_url?: string;
  category_id?: UUID;
  start_date: string;
  end_date: string;
  all_day: boolean;
  location_name?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  max_participants?: number;
  current_participants: number;
  min_participants: number;
  price: number;
  is_free: boolean;
  currency: string;
  organizer_id: UUID;
  business_id?: UUID;
  status: EventStatus;
  is_featured: boolean;
  is_trending: boolean;
  is_premium: boolean;
  average_rating: number;
  rating_count: number;
  view_count: number;
  share_count: number;
  save_count: number;
  requires_approval: boolean;
  allow_cancelled: boolean;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface EventParticipant {
  id: UUID;
  event_id: UUID;
  user_id: UUID;
  status: RequestStatus;
  checked_in_at?: string;
  checked_out_at?: string;
  was_present: boolean;
  rating?: number;
  rating_given_at?: string;
  joined_at: string;
  updated_at: string;
}

export interface EventRequest {
  id: UUID;
  event_id: UUID;
  user_id: UUID;
  message?: string;
  status: RequestStatus;
  responded_at?: string;
  responded_by?: UUID;
  response_message?: string;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: UUID;
  name: string;
  icon?: string;
  color?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// BUSINESS
// =====================================================

export interface BusinessProfile {
  id: UUID;
  profile_id: UUID;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  business_website?: string;
  address?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  category_id?: UUID;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: UUID;
  rank: BusinessRank;
  total_events: number;
  total_participants: number;
  average_rating: number;
  total_reviews: number;
  followers: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

// =====================================================
// ORGANIZER
// =====================================================

export interface OrganizerProfile {
  id: UUID;
  profile_id: UUID;
  display_name?: string;
  bio?: string;
  rank: OrganizerRank;
  promoted_at?: string;
  total_events: number;
  total_participants: number;
  completed_events: number;
  cancelled_events: number;
  average_rating: number;
  total_reviews: number;
  current_streak: number;
  longest_streak: number;
  last_event_date?: string;
  trust_score: number;
  created_at: string;
  updated_at: string;
}

// =====================================================
// CHATS
// =====================================================

export interface Chat {
  id: UUID;
  type: 'direct' | 'event' | 'group';
  event_id?: UUID;
  name?: string;
  description?: string;
  avatar_url?: string;
  is_active: boolean;
  requires_approval: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface ChatMember {
  chat_id: UUID;
  user_id: UUID;
  role: 'owner' | 'admin' | 'member';
  notifications_enabled: boolean;
  last_read_at?: string;
  unread_count: number;
  is_active: boolean;
  joined_at: string;
  left_at?: string;
}

export interface Message {
  id: UUID;
  chat_id: UUID;
  sender_id: UUID;
  content: string;
  content_type: 'text' | 'image' | 'file' | 'system';
  media_url?: string;
  reply_to_id?: UUID;
  reactions: Reaction[];
  is_edited: boolean;
  is_deleted: boolean;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Reaction {
  emoji: string;
  user_id: UUID;
  created_at: string;
}

// =====================================================
// NOTIFICATIONS
// =====================================================

export interface Notification {
  id: UUID;
  user_id: UUID;
  type: NotificationType;
  title: string;
  body?: string;
  image_url?: string;
  deep_link?: string;
  data: Record<string, unknown>;
  is_read: boolean;
  is_archived: boolean;
  read_at?: string;
  push_sent: boolean;
  push_sent_at?: string;
  expires_at?: string;
  created_at: string;
}

// =====================================================
// ACHIEVEMENTS & BADGES
// =====================================================

export interface Achievement {
  id: UUID;
  name: string;
  description?: string;
  icon?: string;
  category?: string;
  requirement_type: 'count' | 'streak' | 'rating';
  requirement_value: number;
  xp_reward: number;
  is_secret: boolean;
  is_limited_time: boolean;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface UserAchievement {
  user_id: UUID;
  achievement_id: UUID;
  progress: number;
  is_completed: boolean;
  completed_at?: string;
}

export interface Badge {
  id: UUID;
  name: string;
  description?: string;
  icon?: string;
  type: BadgeType;
  rarity: BadgeRarity;
  requirement_type?: string;
  requirement_value?: number;
  is_active: boolean;
  created_at: string;
}

export interface UserBadge {
  user_id: UUID;
  badge_id: UUID;
  earned_at: string;
  is_equipped: boolean;
}

// =====================================================
// XP & REPUTATION
// =====================================================

export interface XPHistoryEntry {
  id: UUID;
  user_id: UUID;
  amount: number;
  reason: string;
  source?: string;
  source_id?: UUID;
  created_at: string;
}

export interface ReputationHistoryEntry {
  id: UUID;
  user_id: UUID;
  score_change: number;
  new_score: number;
  reason: string;
  source?: string;
  source_id?: UUID;
  created_at: string;
}

// =====================================================
// REPORTS
// =====================================================

export interface Report {
  id: UUID;
  reporter_id: UUID;
  reported_user_id?: UUID;
  reported_event_id?: UUID;
  reported_business_id?: UUID;
  reported_chat_id?: UUID;
  reason: ReportReason;
  description?: string;
  evidence_urls?: string[];
  status: ReportStatus;
  reviewed_by?: UUID;
  reviewed_at?: string;
  resolution_notes?: string;
  created_at: string;
}

export interface Block {
  blocker_id: UUID;
  blocked_id: UUID;
  reason?: string;
  created_at: string;
}

export interface Mute {
  muter_id: UUID;
  muted_id: UUID;
  created_at: string;
}

// =====================================================
// FAVORITES & PLACES
// =====================================================

export interface Favorite {
  user_id: UUID;
  favorited_event_id?: UUID;
  favorited_business_id?: UUID;
  favorited_organizer_id?: UUID;
  notes?: string;
  created_at: string;
}

export interface SavedPlace {
  user_id: UUID;
  id: UUID;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  is_default: boolean;
  created_at: string;
}

// =====================================================
// PREMIUM
// =====================================================

export interface Premium {
  id: UUID;
  user_id: UUID;
  plan: PremiumPlan;
  status: PremiumStatus;
  price: number;
  currency: string;
  starts_at: string;
  expires_at: string;
  cancelled_at?: string;
  payment_method?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PremiumTransaction {
  id: UUID;
  premium_id: UUID;
  amount: number;
  currency: string;
  status: string;
  payment_method?: string;
  payment_id?: string;
  created_at: string;
}

// =====================================================
// DEVICES & SESSIONS
// =====================================================

export interface Device {
  id: UUID;
  user_id: UUID;
  device_type?: 'ios' | 'android' | 'web' | 'desktop';
  device_name?: string;
  device_token?: string;
  last_ip?: string;
  last_city?: string;
  last_country?: string;
  is_active: boolean;
  last_active_at: string;
  created_at: string;
}

export interface Session {
  id: UUID;
  user_id: UUID;
  device_id?: UUID;
  token_hash: string;
  refresh_token_hash?: string;
  expires_at: string;
  last_used_at?: string;
  is_active: boolean;
  created_at: string;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface DiscoveryFeedItem {
  id: UUID;
  title: string;
  description?: string;
  cover_image_url?: string;
  start_date: string;
  end_date: string;
  latitude?: number;
  longitude?: number;
  distance_meters: number;
  category_name?: string;
  category_icon?: string;
  organizer_name: string;
  organizer_trust_score: number;
  current_participants: number;
  max_participants?: number;
  is_free: boolean;
  price: number;
  average_rating: number;
  is_featured: boolean;
  is_trending: boolean;
  score: number;
}

export interface EventDetails {
  id: UUID;
  title: string;
  description?: string;
  cover_image_url?: string;
  category_id?: UUID;
  category_name?: string;
  category_icon?: string;
  start_date: string;
  end_date: string;
  location_name?: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  max_participants?: number;
  current_participants: number;
  price: number;
  is_free: boolean;
  status: EventStatus;
  is_featured: boolean;
  is_trending: boolean;
  average_rating: number;
  rating_count: number;
  view_count: number;
  organizer_id: UUID;
  organizer_name: string;
  organizer_avatar_url?: string;
  organizer_trust_score: number;
  is_organizer_verified: boolean;
  business_id?: UUID;
  business_name?: string;
  business_logo_url?: string;
  is_business_verified: boolean;
  user_is_participant: boolean;
  user_request_status?: RequestStatus;
  user_can_join: boolean;
  user_can_request: boolean;
}

export interface UserStats {
  events_attended: number;
  events_hosted: number;
  total_xp: number;
  current_level: number;
  trust_score: number;
  achievements_unlocked: number;
  badges_earned: number;
  current_streak: number;
  longest_streak: number;
}

// =====================================================
// SEARCH
// =====================================================

export interface SearchResult {
  result_type: 'event' | 'business' | 'organizer';
  result_id: UUID;
  title: string;
  subtitle?: string;
  image_url?: string;
  relevance_score: number;
}

// =====================================================
// REALTIME
// =====================================================

export type RealtimeChannel = 
  | 'events'
  | 'messages'
  | 'notifications'
  | 'presence'
  | 'participants';

export interface RealtimePayload<T> {
  event: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: T;
  old_record?: T;
}

// =====================================================
// VALIDATION
// =====================================================

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors?: ValidationError[];
}

// =====================================================
// ANALYTICS
// =====================================================

export interface AnalyticsEvent {
  id: UUID;
  event_type: string;
  user_id?: UUID;
  session_id?: UUID;
  device_id?: UUID;
  event_data: Record<string, unknown>;
  platform?: string;
  app_version?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}
