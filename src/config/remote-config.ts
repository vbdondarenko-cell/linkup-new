/**
 * Remote Configuration System
 * 
 * Server-controlled configuration that doesn't require app updates.
 * Supports:
 * - Premium feature toggles
 * - Rate limits
 * - Seasonal events
 * - Recommendation tuning
 * - Notification rules
 */

export interface RemoteConfig {
  // Premium Configuration
  premium: {
    priceUSD: number;
    yearlyDiscount: number;
    features: {
      unlimitedEvents: boolean;
      priorityVisibility: boolean;
      analytics: boolean;
      customBranding: boolean;
    };
  };
  
  // Reward Premium Configuration
  rewardPremium: {
    enabled: boolean;
    xpPerEvent: number;
    xpPerJoin: number;
    xpPerRating: number;
    xpPerShare: number;
    xpToPremium: number;
    expirationDays: number;
  };
  
  // Rate Limits
  rateLimits: {
    eventsPerDay: {
      free: number;
      premium: number;
      organizer: number;
      business: number;
    };
    messagesPerHour: {
      free: number;
      premium: number;
    };
    searchPerMinute: {
      free: number;
      premium: number;
    };
  };
  
  // Recommendation Settings
  recommendations: {
    maxPerCategory: number;
    categories: string[];
    minTrustScore: number;
    maxDistanceKm: number;
    freshnessHours: number;
    personalizationEnabled: boolean;
  };
  
  // Notification Settings
  notifications: {
    eventReminderHours: number[];
    chatExpirationHours: number;
    maxPushPerDay: number;
    quietHoursStart: string;
    quietHoursEnd: string;
  };
  
  // Search Settings
  search: {
    maxResults: number;
    defaultRadiusKm: number;
    maxRadiusKm: number;
    fuzzyMatch: boolean;
    minQueryLength: number;
  };
  
  // Seasonal Events
  seasonal: {
    active: boolean;
    theme: string;
    bannerMessage: string;
    specialCategories: string[];
  };
  
  // Chat Settings
  chat: {
    expirationHours: number;
    maxParticipants: number;
    maxMessageLength: number;
    moderationEnabled: boolean;
  };
  
  // Trust System
  trustSystem: {
    minScore: number;
    maxScore: number;
    verificationBonus: number;
    attendanceBonus: number;
    reportPenalty: number;
  };
  
  // Version
  version: string;
  lastUpdated: string;
}

// Default configuration
export const DEFAULT_REMOTE_CONFIG: RemoteConfig = {
  premium: {
    priceUSD: 4.99,
    yearlyDiscount: 0.2,
    features: {
      unlimitedEvents: true,
      priorityVisibility: true,
      analytics: true,
      customBranding: false,
    },
  },
  
  rewardPremium: {
    enabled: true,
    xpPerEvent: 100,
    xpPerJoin: 50,
    xpPerRating: 25,
    xpPerShare: 75,
    xpToPremium: 10000,
    expirationDays: 365,
  },
  
  rateLimits: {
    eventsPerDay: {
      free: 3,
      premium: 10,
      organizer: 20,
      business: 50,
    },
    messagesPerHour: {
      free: 30,
      premium: 100,
    },
    searchPerMinute: {
      free: 10,
      premium: 50,
    },
  },
  
  recommendations: {
    maxPerCategory: 5,
    categories: [
      'recommended',
      'nearby',
      'startingSoon',
      'hiddenGems',
      'trending',
      'weekend',
      'afterWork',
    ],
    minTrustScore: 20,
    maxDistanceKm: 50,
    freshnessHours: 72,
    personalizationEnabled: true,
  },
  
  notifications: {
    eventReminderHours: [24, 2, 1],
    chatExpirationHours: 24,
    maxPushPerDay: 50,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  },
  
  search: {
    maxResults: 50,
    defaultRadiusKm: 10,
    maxRadiusKm: 100,
    fuzzyMatch: true,
    minQueryLength: 2,
  },
  
  seasonal: {
    active: false,
    theme: 'default',
    bannerMessage: '',
    specialCategories: [],
  },
  
  chat: {
    expirationHours: 24,
    maxParticipants: 100,
    maxMessageLength: 1000,
    moderationEnabled: true,
  },
  
  trustSystem: {
    minScore: 0,
    maxScore: 100,
    verificationBonus: 5,
    attendanceBonus: 10,
    reportPenalty: 5,
  },
  
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
};

// Remote config manager
export class RemoteConfigManager {
  private config: RemoteConfig;
  private listeners: ((config: RemoteConfig) => void)[] = [];
  
  constructor(initialConfig?: RemoteConfig) {
    this.config = initialConfig || DEFAULT_REMOTE_CONFIG;
  }
  
  get(): RemoteConfig {
    return this.config;
  }
  
  update(newConfig: Partial<RemoteConfig>): void {
    this.config = {
      ...this.config,
      ...newConfig,
      lastUpdated: new Date().toISOString(),
    };
    this.notifyListeners();
  }
  
  subscribe(listener: (config: RemoteConfig) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.config));
  }
  
  // Specific getters for common use cases
  getPremiumPrice(): number {
    return this.config.premium.priceUSD;
  }
  
  getXpRequired(): number {
    return this.config.rewardPremium.xpToPremium;
  }
  
  getEventRateLimit(userType: 'free' | 'premium' | 'organizer' | 'business'): number {
    return this.config.rateLimits.eventsPerDay[userType];
  }
  
  getChatExpirationHours(): number {
    return this.config.notifications.chatExpirationHours;
  }
}

// Singleton instance
export const remoteConfig = new RemoteConfigManager();
