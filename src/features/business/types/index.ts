/**
 * LinkUp Design System 2026
 * Business Experience Types
 */

import { BusinessRank } from '../../../domain/business';

// Business Profile
export interface BusinessProfile {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  verificationStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  rank: BusinessRank;
  rankInfo: {
    label: string;
    color: string;
    icon: string;
  };
  totalEvents: number;
  totalParticipants: number;
  averageRating: number;
  totalReviews: number;
  followers: number;
  openingHours?: {
    [day: string]: { open: string; close: string } | null;
  };
  amenities?: string[];
  languages?: string[];
  gallery?: string[];
  isOpen: boolean;
  memberSince: string;
}

// Dashboard Summary
export interface BusinessDashboardSummary {
  totalViews: number;
  totalParticipants: number;
  totalEvents: number;
  averageAttendance: number;
  averageRating: number;
  totalReviews: number;
  followers: number;
  growthRate: number;
  conversionRate: number;
  repeatVisitors: number;
}

// Official Event
export type OfficialEventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'archived';

export interface OfficialEvent {
  id: string;
  title: string;
  description?: string;
  coverImageUrl?: string;
  category: string;
  status: OfficialEventStatus;
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
  views: number;
}

// Event Series
export interface EventSeries {
  id: string;
  title: string;
  description?: string;
  category: string;
  recurrencePattern: 'daily' | 'weekly' | 'monthly' | 'custom';
  events: OfficialEvent[];
  isActive: boolean;
}

// Review
export interface BusinessReview {
  id: string;
  eventId: string;
  eventTitle: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment?: string;
  businessResponse?: string;
  createdAt: Date;
  helpful: number;
}

// Customer
export interface BusinessCustomer {
  id: string;
  displayName: string;
  avatarUrl?: string;
  trustScore: number;
  attendanceCount: number;
  lastVisit?: Date;
  averageRating: number;
  isRegular: boolean;
}

// Analytics
export interface BusinessAnalytics {
  period: {
    start: Date;
    end: Date;
  };
  overview: {
    totalViews: number;
    uniqueVisitors: number;
    totalParticipants: number;
    averageAttendance: number;
    averageRating: number;
    conversionRate: number;
  };
  growth: {
    views: number;
    participants: number;
    rating: number;
    followers: number;
  };
  viewsByDay: Array<{ date: string; views: number }>;
  participantsByDay: Array<{ date: string; participants: number }>;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  peakDays: string[];
  popularCategories: Array<{ category: string; count: number }>;
}

// Community
export interface BusinessCommunity {
  returningParticipants: number;
  regularVisitors: number;
  newFollowers: number;
  growthRate: number;
  topAttendees: BusinessCustomer[];
  communityHealth: {
    engagement: number;
    satisfaction: number;
    retention: number;
  };
}

// Gallery Image
export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

// Notification
export interface BusinessNotification {
  id: string;
  type: 'new_participant' | 'new_review' | 'upcoming_event' | 'event_started' | 'event_finished' | 'verification_update' | 'business_insight';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

// Quick Action
export interface BusinessQuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  action: string;
}

// Settings
export interface BusinessSettings {
  businessInfo: {
    name: string;
    description: string;
    website?: string;
    phone?: string;
  };
  openingHours: {
    [day: string]: { open: string; close: string } | null;
  };
  contact: {
    email: string;
    phone?: string;
    address?: string;
  };
  notifications: {
    newParticipants: boolean;
    newReviews: boolean;
    eventReminders: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    showContact: boolean;
    showReviews: boolean;
    allowMessages: boolean;
  };
}

// Navigation
export type BusinessScreen = 
  | 'dashboard'
  | 'profile'
  | 'events'
  | 'event-details'
  | 'event-edit'
  | 'analytics'
  | 'reviews'
  | 'community'
  | 'participants'
  | 'settings'
  | 'gallery'
  | 'notifications';

export interface BusinessNavigationParams {
  screen: BusinessScreen;
  params?: Record<string, unknown>;
}
