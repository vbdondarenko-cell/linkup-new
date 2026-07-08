/**
 * LinkUp Design System 2026
 * Business State Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { BusinessProfile, BusinessDashboardSummary, OfficialEvent, BusinessReview, BusinessAnalytics, BusinessCommunity, BusinessNotification, BusinessCustomer } from '../types';

// Mock data generator
const generateMockProfile = (): BusinessProfile => ({
  id: 'biz_1',
  ownerId: 'user_1',
  name: 'The Coffee Collective',
  description: 'A premium coffee experience in the heart of the city. Specializing in specialty coffee, artisan pastries, and a warm atmosphere for work and relaxation.',
  logoUrl: 'https://picsum.photos/seed/logo1/200/200',
  coverImageUrl: 'https://picsum.photos/seed/cover1/1200/400',
  website: 'https://coffeecollective.com',
  email: 'hello@coffeecollective.com',
  phone: '+1 555-0123',
  address: {
    street: '123 Main Street',
    city: 'San Francisco',
    country: 'USA',
    postalCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
  },
  category: { id: 'coffee_shop', name: 'Coffee Shop', icon: '☕', color: '#8B4513' },
  verificationStatus: 'verified',
  rank: 'featured',
  rankInfo: { label: 'Featured Business', color: '#8B5CF6', icon: '★' },
  totalEvents: 48,
  totalParticipants: 1250,
  averageRating: 4.7,
  totalReviews: 156,
  followers: 320,
  openingHours: {
    monday: { open: '07:00', close: '20:00' },
    tuesday: { open: '07:00', close: '20:00' },
    wednesday: { open: '07:00', close: '20:00' },
    thursday: { open: '07:00', close: '20:00' },
    friday: { open: '07:00', close: '22:00' },
    saturday: { open: '08:00', close: '22:00' },
    sunday: { open: '08:00', close: '18:00' },
  },
  amenities: ['WiFi', 'Power Outlets', 'Meeting Room', 'Outdoor Seating', 'Wheelchair Accessible'],
  languages: ['English', 'Spanish'],
  gallery: [
    'https://picsum.photos/seed/g1/800/600',
    'https://picsum.photos/seed/g2/800/600',
    'https://picsum.photos/seed/g3/800/600',
    'https://picsum.photos/seed/g4/800/600',
    'https://picsum.photos/seed/g5/800/600',
  ],
  isOpen: true,
  memberSince: '2024-01-15',
});

const generateMockSummary = (): BusinessDashboardSummary => ({
  totalViews: 12500,
  totalParticipants: 1250,
  totalEvents: 48,
  averageAttendance: 85,
  averageRating: 4.7,
  totalReviews: 156,
  followers: 320,
  growthRate: 15,
  conversionRate: 12,
  repeatVisitors: 68,
});

const generateMockEvents = (): OfficialEvent[] => [
  {
    id: 'event_1',
    title: 'Friday Jazz Night',
    description: 'Live jazz performances every Friday evening',
    coverImageUrl: 'https://picsum.photos/seed/be1/800/400',
    category: 'music',
    status: 'published',
    startDate: new Date(Date.now() + 86400000 * 3),
    endDate: new Date(Date.now() + 86400000 * 3 + 14400000),
    location: { name: 'The Coffee Collective', address: '123 Main St', latitude: 37.77, longitude: -122.41 },
    currentParticipants: 24,
    maxParticipants: 40,
    pendingRequests: 5,
    isPremium: false,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 42,
    views: 580,
  },
  {
    id: 'event_2',
    title: 'Barista Workshop',
    description: 'Learn the art of specialty coffee',
    coverImageUrl: 'https://picsum.photos/seed/be2/800/400',
    category: 'education',
    status: 'ongoing',
    startDate: new Date(Date.now() - 3600000),
    endDate: new Date(Date.now() + 7200000),
    location: { name: 'The Coffee Collective', address: '123 Main St', latitude: 37.77, longitude: -122.41 },
    currentParticipants: 12,
    maxParticipants: 15,
    pendingRequests: 0,
    isPremium: true,
    isFeatured: false,
    rating: 4.9,
    ratingCount: 28,
    views: 320,
  },
  {
    id: 'event_3',
    title: 'Monday Networking',
    description: 'Professional networking over great coffee',
    coverImageUrl: 'https://picsum.photos/seed/be3/800/400',
    category: 'networking',
    status: 'published',
    startDate: new Date(Date.now() + 86400000 * 5),
    endDate: new Date(Date.now() + 86400000 * 5 + 7200000),
    location: { name: 'The Coffee Collective', address: '123 Main St', latitude: 37.77, longitude: -122.41 },
    currentParticipants: 8,
    maxParticipants: 25,
    pendingRequests: 3,
    isPremium: false,
    isFeatured: false,
    views: 245,
  },
  {
    id: 'event_4',
    title: 'Weekend Brunch Social',
    description: 'Community brunch gathering',
    coverImageUrl: 'https://picsum.photos/seed/be4/800/400',
    category: 'social',
    status: 'completed',
    startDate: new Date(Date.now() - 86400000 * 2),
    endDate: new Date(Date.now() - 86400000 * 2 + 10800000),
    location: { name: 'The Coffee Collective', address: '123 Main St', latitude: 37.77, longitude: -122.41 },
    currentParticipants: 22,
    maxParticipants: 30,
    pendingRequests: 0,
    isPremium: false,
    isFeatured: false,
    rating: 4.6,
    ratingCount: 18,
    views: 420,
  },
];

const generateMockReviews = (): BusinessReview[] => [
  {
    id: 'rev_1',
    eventId: 'event_4',
    eventTitle: 'Weekend Brunch Social',
    userId: 'user_2',
    userName: 'Sarah M.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment: 'Amazing atmosphere and great coffee! The event was perfectly organized.',
    businessResponse: 'Thank you so much for joining us, Sarah! We loved having you.',
    createdAt: new Date(Date.now() - 86400000),
    helpful: 12,
  },
  {
    id: 'rev_2',
    eventId: 'event_1',
    eventTitle: 'Friday Jazz Night',
    userId: 'user_3',
    userName: 'Michael R.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    rating: 5,
    comment: 'The jazz was fantastic and the coffee selection was outstanding!',
    createdAt: new Date(Date.now() - 86400000 * 2),
    helpful: 8,
  },
  {
    id: 'rev_3',
    eventId: 'event_2',
    eventTitle: 'Barista Workshop',
    userId: 'user_4',
    userName: 'Emma L.',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    rating: 4,
    comment: 'Really informative workshop. Learned so much about coffee beans!',
    createdAt: new Date(Date.now() - 86400000 * 3),
    helpful: 5,
  },
];

const generateMockAnalytics = (): BusinessAnalytics => ({
  period: {
    start: new Date(Date.now() - 86400000 * 30),
    end: new Date(),
  },
  overview: {
    totalViews: 12500,
    uniqueVisitors: 8200,
    totalParticipants: 1250,
    averageAttendance: 85,
    averageRating: 4.7,
    conversionRate: 12,
  },
  growth: {
    views: 18,
    participants: 15,
    rating: 5,
    followers: 22,
  },
  viewsByDay: [
    { date: '2024-01-01', views: 320 },
    { date: '2024-01-02', views: 450 },
    { date: '2024-01-03', views: 380 },
    { date: '2024-01-04', views: 520 },
    { date: '2024-01-05', views: 480 },
    { date: '2024-01-06', views: 390 },
    { date: '2024-01-07', views: 350 },
  ],
  participantsByDay: [
    { date: '2024-01-01', participants: 28 },
    { date: '2024-01-02', participants: 42 },
    { date: '2024-01-03', participants: 35 },
    { date: '2024-01-04', participants: 52 },
    { date: '2024-01-05', participants: 45 },
    { date: '2024-01-06', participants: 38 },
    { date: '2024-01-07', participants: 32 },
  ],
  ratingDistribution: { 5: 85, 4: 45, 3: 18, 2: 5, 1: 3 },
  peakDays: ['Friday', 'Saturday', 'Monday'],
  popularCategories: [
    { category: 'Social', count: 15 },
    { category: 'Music', count: 12 },
    { category: 'Education', count: 8 },
    { category: 'Networking', count: 6 },
  ],
});

const generateMockCustomers = (): BusinessCustomer[] => [
  { id: 'cust_1', displayName: 'Sarah M.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', trustScore: 95, attendanceCount: 15, lastVisit: new Date(Date.now() - 86400000), averageRating: 4.9, isRegular: true },
  { id: 'cust_2', displayName: 'Michael R.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', trustScore: 88, attendanceCount: 12, lastVisit: new Date(Date.now() - 86400000 * 2), averageRating: 4.7, isRegular: true },
  { id: 'cust_3', displayName: 'Emma L.', avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', trustScore: 92, attendanceCount: 10, lastVisit: new Date(Date.now() - 86400000 * 3), averageRating: 4.8, isRegular: true },
];

interface BusinessState {
  profile: BusinessProfile | null;
  summary: BusinessDashboardSummary | null;
  events: OfficialEvent[];
  reviews: BusinessReview[];
  analytics: BusinessAnalytics | null;
  community: BusinessCommunity | null;
  customers: BusinessCustomer[];
  notifications: BusinessNotification[];
  isLoading: boolean;
  selectedEvent: OfficialEvent | null;
  filterStatus: string | null;
}

export const useBusinessState = () => {
  const [state, setState] = useState<BusinessState>({
    profile: null,
    summary: null,
    events: [],
    reviews: [],
    analytics: null,
    community: null,
    customers: [],
    notifications: [],
    isLoading: true,
    selectedEvent: null,
    filterStatus: null,
  });

  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        profile: generateMockProfile(),
        summary: generateMockSummary(),
        events: generateMockEvents(),
        reviews: generateMockReviews(),
        analytics: generateMockAnalytics(),
        customers: generateMockCustomers(),
        community: {
          returningParticipants: 320,
          regularVisitors: 85,
          newFollowers: 45,
          growthRate: 12,
          topAttendees: generateMockCustomers(),
          communityHealth: { engagement: 82, satisfaction: 91, retention: 78 },
        },
        isLoading: false,
      }));
    };
    
    loadData();
  }, []);

  const setSelectedEvent = useCallback((event: OfficialEvent | null) => {
    setState(prev => ({ ...prev, selectedEvent: event }));
  }, []);

  const setFilterStatus = useCallback((status: string | null) => {
    setState(prev => ({ ...prev, filterStatus: status }));
  }, []);

  const respondToReview = useCallback((reviewId: string, response: string) => {
    setState(prev => ({
      ...prev,
      reviews: prev.reviews.map(r => 
        r.id === reviewId ? { ...r, businessResponse: response } : r
      ),
    }));
  }, []);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return state.events.filter(e => 
      e.startDate > now && (e.status === 'published' || e.status === 'ongoing')
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [state.events]);

  const getFilteredEvents = useCallback(() => {
    if (!state.filterStatus) return state.events;
    return state.events.filter(e => e.status === state.filterStatus);
  }, [state.events, state.filterStatus]);

  return {
    ...state,
    setSelectedEvent,
    setFilterStatus,
    respondToReview,
    getUpcomingEvents,
    getFilteredEvents,
  };
};

export type UseBusinessStateReturn = ReturnType<typeof useBusinessState>;
