/**
 * LinkUp Design System 2026
 * Organizer Experience Types
 */

import { OrganizerRank, OrganizerStatus } from '../../../domain/organizer';

// Organizer Profile
export interface OrganizerProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  status: OrganizerStatus;
  rank: OrganizerRank;
  level: number;
  xp: number;
  rankProgress: number;
  trustScore: number;
  currentStreak: number;
  longestStreak: number;
  isVerified: boolean;
  isFeatured: boolean;
  memberSince: string;
}

// Dashboard Summary
export interface DashboardSummary {
  hostedEvents: number;
  upcomingEvents: number;
  totalParticipants: number;
  attendanceRate: number;
  averageRating: number;
  communityGrowth: number;
  monthlyActivity: number;
}

// Event Status
export type EventManagementStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'archived';

export interface ManagedEvent {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  category: string;
  status: EventManagementStatus;
  startDate: Date;
  endDate: Date;
  location?: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  currentParticipants: number;
  maxParticipants?: number;
  pendingRequests: number;
  isPremium: boolean;
  isFeatured: boolean;
  seriesId?: string;
  rating?: number;
  ratingCount?: number;
}

// Participant
export interface EventParticipant {
  id: string;
  eventId: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  trustScore: number;
  status: 'pending' | 'accepted' | 'declined' | 'waitlisted' | 'attended' | 'no_show';
  joinedAt: Date;
  checkedInAt?: Date;
  rating?: number;
  attendanceHistory: number;
}

// Join Request
export interface JoinRequest {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  trustScore: number;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  requestedAt: Date;
  respondedAt?: Date;
}

// Analytics Data
export interface OrganizerAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  overview: {
    totalEvents: number;
    totalParticipants: number;
    averageAttendance: number;
    averageRating: number;
    completionRate: number;
  };
  growth: {
    participants: number;
    events: number;
    rating: number;
    trust: number;
  };
  eventsByStatus: {
    draft: number;
    published: number;
    ongoing: number;
    completed: number;
    cancelled: number;
    archived: number;
  };
  topEvents: Array<{
    id: string;
    title: string;
    participants: number;
    rating: number;
  }>;
  participantRetention: number;
}

// Calendar Event
export interface CalendarEvent {
  id: string;
  title: string;
  status: EventManagementStatus;
  startDate: Date;
  endDate: Date;
  isAllDay: boolean;
  participants?: number;
  maxParticipants?: number;
}

// Template
export interface EventTemplateData {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryInfo: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  defaultDuration: number;
  defaultCapacity?: number;
  coverImageUrl?: string;
  isFavorite: boolean;
  useCount: number;
  lastUsedAt?: Date;
  createdAt: Date;
}

// Community Stats
export interface CommunityStats {
  returningParticipants: number;
  topAttendees: Array<{
    id: string;
    displayName: string;
    avatarUrl?: string;
    attendanceCount: number;
    trustScore: number;
  }>;
  newMembers: number;
  growthRate: number;
}

// Notification
export interface OrganizerNotification {
  id: string;
  type: 'join_request' | 'participant_accepted' | 'participant_declined' | 'event_reminder' | 'event_started' | 'event_finished' | 'statistics_ready';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// Quick Action
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: string;
}

// Navigation
export type OrganizerScreen = 
  | 'dashboard'
  | 'events'
  | 'event-details'
  | 'event-edit'
  | 'participants'
  | 'requests'
  | 'calendar'
  | 'analytics'
  | 'templates'
  | 'community'
  | 'notifications'
  | 'settings';

export interface OrganizerNavigationParams {
  screen: OrganizerScreen;
  params?: Record<string, unknown>;
}
