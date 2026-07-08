/**
 * LinkUp Design System 2026
 * Organizer State Hook
 */

import { useState, useCallback, useEffect } from 'react';
import { OrganizerProfile, DashboardSummary, ManagedEvent, JoinRequest, OrganizerAnalytics, CalendarEvent, EventTemplateData, CommunityStats, OrganizerNotification } from '../types';

// Mock data generator
const generateMockProfile = (): OrganizerProfile => ({
  id: 'org_1',
  userId: 'user_1',
  displayName: 'Alex Thompson',
  avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Building communities through meaningful experiences',
  status: 'active',
  rank: 'pro',
  level: 12,
  xp: 8500,
  rankProgress: 65,
  trustScore: 87,
  currentStreak: 8,
  longestStreak: 15,
  isVerified: true,
  isFeatured: false,
  memberSince: '2024-03-15',
});

const generateMockSummary = (): DashboardSummary => ({
  hostedEvents: 24,
  upcomingEvents: 3,
  totalParticipants: 456,
  attendanceRate: 92,
  averageRating: 4.7,
  communityGrowth: 12,
  monthlyActivity: 18,
});

const generateMockEvents = (): ManagedEvent[] => [
  {
    id: 'event_1',
    title: 'Tech Meetup: React Native Deep Dive',
    description: 'Join us for an evening of React Native insights',
    coverImageUrl: 'https://picsum.photos/seed/event1/800/400',
    category: 'tech',
    status: 'published',
    startDate: new Date(Date.now() + 86400000 * 2),
    endDate: new Date(Date.now() + 86400000 * 2 + 7200000),
    location: { name: 'TechHub Coworking', address: '123 Innovation St', latitude: 50.45, longitude: 30.52 },
    currentParticipants: 18,
    maxParticipants: 30,
    pendingRequests: 5,
    isPremium: false,
    isFeatured: true,
    rating: 4.8,
    ratingCount: 24,
  },
  {
    id: 'event_2',
    title: 'Weekend Photography Walk',
    description: 'Explore the city through your lens',
    coverImageUrl: 'https://picsum.photos/seed/event2/800/400',
    category: 'arts',
    status: 'ongoing',
    startDate: new Date(Date.now() - 3600000),
    endDate: new Date(Date.now() + 7200000),
    location: { name: 'Central Park', address: '456 Park Ave', latitude: 50.46, longitude: 30.53 },
    currentParticipants: 12,
    maxParticipants: 15,
    pendingRequests: 0,
    isPremium: false,
    isFeatured: false,
    rating: 4.6,
    ratingCount: 18,
  },
  {
    id: 'event_3',
    title: 'Networking Brunch',
    description: 'Connect with professionals over great food',
    coverImageUrl: 'https://picsum.photos/seed/event3/800/400',
    category: 'social',
    status: 'draft',
    startDate: new Date(Date.now() + 86400000 * 5),
    endDate: new Date(Date.now() + 86400000 * 5 + 5400000),
    location: { name: 'Café Milano', address: '789 Main St', latitude: 50.44, longitude: 30.51 },
    currentParticipants: 0,
    maxParticipants: 20,
    pendingRequests: 0,
    isPremium: false,
    isFeatured: false,
  },
  {
    id: 'event_4',
    title: 'Morning Yoga in the Park',
    description: 'Start your day with mindfulness',
    coverImageUrl: 'https://picsum.photos/seed/event4/800/400',
    category: 'wellness',
    status: 'completed',
    startDate: new Date(Date.now() - 86400000 * 2),
    endDate: new Date(Date.now() - 86400000 * 2 + 3600000),
    location: { name: 'Riverside Park', address: '321 River Rd', latitude: 50.47, longitude: 30.54 },
    currentParticipants: 14,
    maxParticipants: 15,
    pendingRequests: 0,
    isPremium: false,
    isFeatured: false,
    rating: 4.9,
    ratingCount: 32,
  },
  {
    id: 'event_5',
    title: 'Startup Pitch Night',
    description: 'Watch founders pitch their ideas',
    category: 'tech',
    status: 'published',
    startDate: new Date(Date.now() + 86400000 * 7),
    endDate: new Date(Date.now() + 86400000 * 7 + 10800000),
    location: { name: 'Innovation Center', address: '555 Tech Blvd', latitude: 50.43, longitude: 30.50 },
    currentParticipants: 45,
    maxParticipants: 100,
    pendingRequests: 12,
    isPremium: true,
    isFeatured: true,
  },
];

const generateMockRequests = (): JoinRequest[] => [
  {
    id: 'req_1',
    eventId: 'event_1',
    eventTitle: 'Tech Meetup: React Native Deep Dive',
    userId: 'user_2',
    displayName: 'Sarah Chen',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    trustScore: 92,
    status: 'pending',
    message: 'Would love to learn more about React Native performance optimization!',
    requestedAt: new Date(Date.now() - 3600000 * 2),
  },
  {
    id: 'req_2',
    eventId: 'event_1',
    eventTitle: 'Tech Meetup: React Native Deep Dive',
    userId: 'user_3',
    displayName: 'Mike Johnson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    trustScore: 78,
    status: 'pending',
    requestedAt: new Date(Date.now() - 3600000 * 5),
  },
  {
    id: 'req_3',
    eventId: 'event_5',
    eventTitle: 'Startup Pitch Night',
    userId: 'user_4',
    displayName: 'Emma Wilson',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    trustScore: 85,
    status: 'pending',
    message: 'I run a fintech startup and would love to present!',
    requestedAt: new Date(Date.now() - 86400000),
  },
];

interface OrganizerState {
  profile: OrganizerProfile | null;
  summary: DashboardSummary | null;
  events: ManagedEvent[];
  requests: JoinRequest[];
  analytics: OrganizerAnalytics | null;
  calendarEvents: CalendarEvent[];
  templates: EventTemplateData[];
  community: CommunityStats | null;
  notifications: OrganizerNotification[];
  isLoading: boolean;
  selectedEvent: ManagedEvent | null;
  filterStatus: string | null;
}

export const useOrganizerState = () => {
  const [state, setState] = useState<OrganizerState>({
    profile: null,
    summary: null,
    events: [],
    requests: [],
    analytics: null,
    calendarEvents: [],
    templates: [],
    community: null,
    notifications: [],
    isLoading: true,
    selectedEvent: null,
    filterStatus: null,
  });

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setState(prev => ({
        ...prev,
        profile: generateMockProfile(),
        summary: generateMockSummary(),
        events: generateMockEvents(),
        requests: generateMockRequests(),
        isLoading: false,
      }));
    };
    
    loadData();
  }, []);

  // Actions
  const setSelectedEvent = useCallback((event: ManagedEvent | null) => {
    setState(prev => ({ ...prev, selectedEvent: event }));
  }, []);

  const setFilterStatus = useCallback((status: string | null) => {
    setState(prev => ({ ...prev, filterStatus: status }));
  }, []);

  const acceptRequest = useCallback((requestId: string) => {
    setState(prev => ({
      ...prev,
      requests: prev.requests.map(r => 
        r.id === requestId ? { ...r, status: 'accepted' as const, respondedAt: new Date() } : r
      ),
    }));
  }, []);

  const declineRequest = useCallback((requestId: string) => {
    setState(prev => ({
      ...prev,
      requests: prev.requests.map(r => 
        r.id === requestId ? { ...r, status: 'declined' as const, respondedAt: new Date() } : r
      ),
    }));
  }, []);

  const toggleEventStatus = useCallback((eventId: string, newStatus: ManagedEvent['status']) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => 
        e.id === eventId ? { ...e, status: newStatus } : e
      ),
    }));
  }, []);

  const markNotificationRead = useCallback((notificationId: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  }, []);

  const getFilteredEvents = useCallback(() => {
    if (!state.filterStatus) return state.events;
    return state.events.filter(e => e.status === state.filterStatus);
  }, [state.events, state.filterStatus]);

  const getPendingRequestsCount = useCallback(() => {
    return state.requests.filter(r => r.status === 'pending').length;
  }, [state.requests]);

  const getUpcomingEvents = useCallback(() => {
    const now = new Date();
    return state.events.filter(e => 
      e.startDate > now && (e.status === 'published' || e.status === 'ongoing')
    ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }, [state.events]);

  return {
    ...state,
    setSelectedEvent,
    setFilterStatus,
    acceptRequest,
    declineRequest,
    toggleEventStatus,
    markNotificationRead,
    getFilteredEvents,
    getPendingRequestsCount,
    getUpcomingEvents,
  };
};

export type UseOrganizerStateReturn = ReturnType<typeof useOrganizerState>;
