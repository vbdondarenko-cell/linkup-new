/**
 * LinkUp Design System 2026
 * Realtime & Engagement State Hook
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  XPState,
  Level,
  Achievement,
  Badge,
  ReputationState,
  Notification,
  ActivityItem,
  StreakState,
  Celebration,
  RealtimeState,
  NotificationGroup,
  LEVELS,
  ACHIEVEMENTS,
  BADGES,
  REPUTATION_LEVELS,
  XPGain,
} from '../types';

// ==================== MAIN HOOK ====================
interface UseRealtimeStateReturn {
  // State
  realtime: RealtimeState;
  xp: XPState;
  achievements: Achievement[];
  badges: Badge[];
  reputation: ReputationState;
  notifications: Notification[];
  activity: ActivityItem[];
  streaks: StreakState;
  celebrations: Celebration[];
  
  // XP Actions
  addXP: (amount: number, reason: string) => void;
  getCurrentLevel: () => Level;
  getNextLevel: () => Level | null;
  
  // Achievement Actions
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  unlockAchievement: (achievementId: string) => void;
  getAchievementsByCategory: (category: string) => Achievement[];
  
  // Badge Actions
  equipBadge: (badgeId: string) => void;
  unequipBadge: (badgeId: string) => void;
  
  // Notification Actions
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  archiveNotification: (notificationId: string) => void;
  deleteNotification: (notificationId: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => void;
  getGroupedNotifications: () => NotificationGroup[];
  
  // Activity Actions
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp'>) => void;
  
  // Streak Actions
  updateStreaks: () => void;
  
  // Celebration Actions
  dismissCelebration: (celebrationId: string) => void;
  showCelebration: (celebration: Omit<Celebration, 'id'>) => void;
  
  // Realtime Actions
  connect: () => void;
  disconnect: () => void;
  sync: () => Promise<void>;
}

const INITIAL_XP: XPState = {
  currentXP: 0,
  totalXP: 0,
  level: 1,
  levelProgress: 0,
  recentGains: [],
};

const INITIAL_REPUTATION: ReputationState = {
  score: 50,
  level: 'medium',
  changeHistory: [],
};

const INITIAL_STREAKS: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  monthlyEvents: 0,
  yearlyEvents: 0,
  missedEvents: 0,
  completedEvents: 0,
};

const INITIAL_REALTIME: RealtimeState = {
  isConnected: false,
  pendingUpdates: 0,
};

export const useRealtimeState = (): UseRealtimeStateReturn => {
  // State
  const [realtime, setRealtime] = useState<RealtimeState>(INITIAL_REALTIME);
  const [xp, setXP] = useState<XPState>(INITIAL_XP);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [badges, setBadges] = useState<Badge[]>(BADGES);
  const [reputation, setReputation] = useState<ReputationState>(INITIAL_REPUTATION);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [streaks, setStreaks] = useState<StreakState>(INITIAL_STREAKS);
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);

  // Computed values
  const getCurrentLevel = useCallback((): Level => {
    return LEVELS.find(l => l.id === xp.level) || LEVELS[0];
  }, [xp.level]);

  const getNextLevel = useCallback((): Level | null => {
    return LEVELS.find(l => l.id === xp.level + 1) || null;
  }, [xp.level]);

  const getAchievementsByCategory = useCallback((category: string): Achievement[] => {
    return achievements.filter(a => a.category === category);
  }, [achievements]);

  const getGroupedNotifications = useCallback((): NotificationGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    
    const groups: { today: Notification[]; yesterday: Notification[]; earlier: Notification[] } = {
      today: [],
      yesterday: [],
      earlier: [],
    };
    
    notifications.forEach(notification => {
      const notifDate = new Date(notification.createdAt);
      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else {
        groups.earlier.push(notification);
      }
    });
    
    const result: NotificationGroup[] = [];
    if (groups.today.length > 0) result.push({ title: 'Today', data: groups.today });
    if (groups.yesterday.length > 0) result.push({ title: 'Yesterday', data: groups.yesterday });
    if (groups.earlier.length > 0) result.push({ title: 'Earlier', data: groups.earlier });
    
    return result;
  }, [notifications]);

  // XP Actions
  const addXP = useCallback((amount: number, reason: string) => {
    const gain: XPGain = {
      id: `xp_${Date.now()}`,
      amount,
      reason,
      timestamp: new Date(),
    };
    
    setXP(prev => {
      let newXP = prev.currentXP + amount;
      let totalXP = prev.totalXP + amount;
      let newLevel = prev.level;
      let levelProgress = prev.levelProgress;
      
      // Check for level up
      const nextLevel = LEVELS.find(l => l.id === prev.level + 1);
      if (nextLevel && totalXP >= nextLevel.requiredXP) {
        newLevel = prev.level + 1;
        levelProgress = 0;
        
        // Trigger celebration
        setCelebrations(c => [...c, {
          id: `level_${Date.now()}`,
          type: 'level_up',
          title: 'Level Up!',
          message: `You're now ${nextLevel.name}!`,
          icon: nextLevel.icon,
        }]);
      } else if (nextLevel) {
        const currentLevelData = LEVELS.find(l => l.id === prev.level)!;
        const xpInLevel = totalXP - currentLevelData.requiredXP;
        const xpForLevel = nextLevel.requiredXP - currentLevelData.requiredXP;
        levelProgress = Math.min(100, Math.round((xpInLevel / xpForLevel) * 100));
      }
      
      return {
        currentXP: newXP % 100,
        totalXP,
        level: newLevel,
        levelProgress,
        recentGains: [gain, ...prev.recentGains.slice(0, 9)],
      };
    });
    
    // Update reputation
    setReputation(prev => ({
      ...prev,
      score: Math.min(100, prev.score + amount * 0.01),
    }));
  }, []);

  // Achievement Actions
  const updateAchievementProgress = useCallback((achievementId: string, progress: number) => {
    setAchievements(prev => prev.map(a => {
      if (a.id === achievementId && a.status !== 'unlocked') {
        const newStatus = progress >= a.requirement ? 'unlocked' : 'in_progress';
        if (newStatus === 'unlocked' && a.status !== 'unlocked') {
          // Trigger celebration
          setCelebrations(c => [...c, {
            id: `achievement_${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked!',
            message: a.name,
            icon: a.icon,
          }]);
          // Award XP
          addXP(a.xpReward, `Achievement: ${a.name}`);
          // Add to activity
          setActivity(act => [{
            id: `activity_${Date.now()}`,
            type: 'achievement',
            title: 'Achievement Unlocked',
            description: a.name,
            icon: a.icon,
            timestamp: new Date(),
          }, ...act]);
        }
        return { ...a, progress, status: newStatus };
      }
      return a;
    }));
  }, [addXP]);

  const unlockAchievement = useCallback((achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.status !== 'unlocked') {
      updateAchievementProgress(achievementId, achievement.requirement);
    }
  }, [achievements, updateAchievementProgress]);

  // Badge Actions
  const equipBadge = useCallback((badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && b.earnedAt) {
        return { ...b, isEquipped: true };
      }
      return b;
    }));
  }, []);

  const unequipBadge = useCallback((badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId) {
        return { ...b, isEquipped: false };
      }
      return b;
    }));
  }, []);

  // Notification Actions
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, isRead: true };
      }
      return n;
    }));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  }, []);

  const archiveNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => {
      if (n.id === notificationId) {
        return { ...n, isArchived: true };
      }
      return n;
    }));
  }, []);

  const deleteNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      createdAt: new Date(),
      isRead: false,
      isArchived: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // Activity Actions
  const addActivity = useCallback((activityItem: Omit<ActivityItem, 'id' | 'timestamp'>) => {
    const newActivity: ActivityItem = {
      ...activityItem,
      id: `activity_${Date.now()}`,
      timestamp: new Date(),
    };
    setActivity(prev => [newActivity, ...prev.slice(0, 49)]);
  }, []);

  // Streak Actions
  const updateStreaks = useCallback(() => {
    const now = new Date();
    setStreaks(prev => {
      const lastDate = prev.lastEventDate ? new Date(prev.lastEventDate) : null;
      let newStreak = prev.currentStreak;
      
      if (lastDate) {
        const daysSinceLastEvent = Math.floor((now.getTime() - lastDate.getTime()) / 86400000);
        
        if (daysSinceLastEvent === 0) {
          // Same day, no change
        } else if (daysSinceLastEvent === 1) {
          // Consecutive day
          newStreak += 1;
        } else {
          // Streak broken
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
      
      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastEventDate: now,
        completedEvents: prev.completedEvents + 1,
        monthlyEvents: prev.monthlyEvents + 1,
        yearlyEvents: prev.yearlyEvents + 1,
      };
    });
  }, []);

  // Celebration Actions
  const dismissCelebration = useCallback((celebrationId: string) => {
    setCelebrations(prev => prev.filter(c => c.id !== celebrationId));
  }, []);

  const showCelebration = useCallback((celebration: Omit<Celebration, 'id'>) => {
    setCelebrations(prev => [...prev, { ...celebration, id: `celebration_${Date.now()}` }]);
  }, []);

  // Realtime Actions
  const connect = useCallback(() => {
    setRealtime(prev => ({ ...prev, isConnected: true, lastSyncAt: new Date() }));
  }, []);

  const disconnect = useCallback(() => {
    setRealtime(prev => ({ ...prev, isConnected: false }));
  }, []);

  const sync = useCallback(async () => {
    setRealtime(prev => ({ ...prev, pendingUpdates: prev.pendingUpdates + 1 }));
    await new Promise(resolve => setTimeout(resolve, 500));
    setRealtime(prev => ({ ...prev, pendingUpdates: Math.max(0, prev.pendingUpdates - 1), lastSyncAt: new Date() }));
  }, []);

  // Auto-dismiss celebrations after 5 seconds
  useEffect(() => {
    if (celebrations.length > 0) {
      const timer = setTimeout(() => {
        setCelebrations(prev => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [celebrations.length]);

  return {
    // State
    realtime,
    xp,
    achievements,
    badges,
    reputation,
    notifications,
    activity,
    streaks,
    celebrations,
    
    // XP Actions
    addXP,
    getCurrentLevel,
    getNextLevel,
    
    // Achievement Actions
    updateAchievementProgress,
    unlockAchievement,
    getAchievementsByCategory,
    
    // Badge Actions
    equipBadge,
    unequipBadge,
    
    // Notification Actions
    markAsRead,
    markAllAsRead,
    archiveNotification,
    deleteNotification,
    addNotification,
    getGroupedNotifications,
    
    // Activity Actions
    addActivity,
    
    // Streak Actions
    updateStreaks,
    
    // Celebration Actions
    dismissCelebration,
    showCelebration,
    
    // Realtime Actions
    connect,
    disconnect,
    sync,
  };
};

export type UseRealtimeStateReturnType = ReturnType<typeof useRealtimeState>;
