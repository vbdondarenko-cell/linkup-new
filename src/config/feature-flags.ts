/**
 * Feature Flags System
 * 
 * Supports:
 * - Gradual rollouts (percentage)
 * - Beta features
 * - Internal features
 * - A/B testing
 * - Regional rollouts
 * - Instant rollback
 */

export type FeatureFlagKey =
  // Core Features
  | 'FEATURE_CHAT'
  | 'FEATURE_PREMIUM'
  | 'FEATURE_REWARD_PREMIUM'
  | 'FEATURE_ORGANIZER'
  | 'FEATURE_BUSINESS'
  | 'FEATURE_VERIFICATION'
  
  // AI Features
  | 'FEATURE_AI_RECOMMENDATIONS'
  | 'FEATURE_AI_SEARCH'
  | 'FEATURE_AI_MODERATION'
  
  // Advanced Features
  | 'FEATURE_RECURRING_EVENTS'
  | 'FEATURE_EVENT_SERIES'
  | 'FEATURE_CLUBS'
  | 'FEATURE_COMMUNITIES'
  
  // Experimental
  | 'FEATURE_MAP_V2'
  | 'FEATURE_CHAT_V2'
  | 'FEATURE_NOTIFICATIONS_V2';

export interface FeatureFlag {
  key: FeatureFlagKey;
  enabled: boolean;
  rolloutPercentage?: number;
  beta?: boolean;
  internal?: boolean;
  description: string;
  version?: string; // Min version to enable
  userGroups?: ('free' | 'premium' | 'organizer' | 'business')[];
  regions?: string[];
  expiresAt?: string;
}

export interface FeatureFlagConfig {
  flags: Record<FeatureFlagKey, FeatureFlag>;
  lastUpdated: string;
  version: string;
}

// Default feature flags - all V1 features enabled
export const DEFAULT_FEATURE_FLAGS: FeatureFlagConfig = {
  version: '1.0.0',
  lastUpdated: new Date().toISOString(),
  flags: {
    // Core Features
    FEATURE_CHAT: {
      key: 'FEATURE_CHAT',
      enabled: true,
      description: 'Real-time chat for events',
      userGroups: ['free', 'premium', 'organizer', 'business'],
    },
    FEATURE_PREMIUM: {
      key: 'FEATURE_PREMIUM',
      enabled: true,
      description: 'Premium subscription features',
    },
    FEATURE_REWARD_PREMIUM: {
      key: 'FEATURE_REWARD_PREMIUM',
      enabled: true,
      description: 'Reward premium from engagement',
    },
    FEATURE_ORGANIZER: {
      key: 'FEATURE_ORGANIZER',
      enabled: true,
      description: 'Organizer dashboard and tools',
      userGroups: ['organizer', 'business'],
    },
    FEATURE_BUSINESS: {
      key: 'FEATURE_BUSINESS',
      enabled: true,
      description: 'Verified business features',
      userGroups: ['business'],
    },
    FEATURE_VERIFICATION: {
      key: 'FEATURE_VERIFICATION',
      enabled: true,
      description: 'User verification system',
    },
    
    // AI Features
    FEATURE_AI_RECOMMENDATIONS: {
      key: 'FEATURE_AI_RECOMMENDATIONS',
      enabled: true,
      description: 'AI-powered event recommendations',
      beta: true,
    },
    FEATURE_AI_SEARCH: {
      key: 'FEATURE_AI_SEARCH',
      enabled: false,
      description: 'AI-powered semantic search',
      version: '2.0',
    },
    FEATURE_AI_MODERATION: {
      key: 'FEATURE_AI_MODERATION',
      enabled: true,
      description: 'AI content moderation',
      internal: true,
    },
    
    // Advanced Features
    FEATURE_RECURRING_EVENTS: {
      key: 'FEATURE_RECURRING_EVENTS',
      enabled: false,
      rolloutPercentage: 0,
      description: 'Recurring event support',
      version: '2.0',
      userGroups: ['organizer', 'business'],
    },
    FEATURE_EVENT_SERIES: {
      key: 'FEATURE_EVENT_SERIES',
      enabled: false,
      rolloutPercentage: 0,
      description: 'Event series management',
      version: '2.0',
      userGroups: ['organizer', 'business'],
    },
    FEATURE_CLUBS: {
      key: 'FEATURE_CLUBS',
      enabled: false,
      rolloutPercentage: 0,
      description: 'Community clubs',
      version: '4.0',
    },
    FEATURE_COMMUNITIES: {
      key: 'FEATURE_COMMUNITIES',
      enabled: false,
      rolloutPercentage: 0,
      description: 'Community groups',
      version: '4.0',
    },
    
    // Experimental
    FEATURE_MAP_V2: {
      key: 'FEATURE_MAP_V2',
      enabled: false,
      beta: true,
      rolloutPercentage: 10,
      description: 'New map experience',
    },
    FEATURE_CHAT_V2: {
      key: 'FEATURE_CHAT_V2',
      enabled: false,
      beta: true,
      rolloutPercentage: 10,
      description: 'New chat experience',
    },
    FEATURE_NOTIFICATIONS_V2: {
      key: 'FEATURE_NOTIFICATIONS_V2',
      enabled: false,
      beta: true,
      rolloutPercentage: 10,
      description: 'New notification system',
    },
  },
};

// Feature flag evaluation
export class FeatureFlagService {
  private flags: FeatureFlagConfig;
  
  constructor(initialFlags?: FeatureFlagConfig) {
    this.flags = initialFlags || DEFAULT_FEATURE_FLAGS;
  }
  
  isEnabled(key: FeatureFlagKey, userContext?: {
    userId?: string;
    userType?: 'free' | 'premium' | 'organizer' | 'business';
    region?: string;
    version?: string;
  }): boolean {
    const flag = this.flags.flags[key];
    
    if (!flag) return false;
    if (!flag.enabled) return false;
    
    // Check version requirement
    if (flag.version && userContext?.version) {
      const requiredVersion = flag.version;
      const userVersion = userContext.version;
      if (requiredVersion > userVersion) return false;
    }
    
    // Check user group
    if (flag.userGroups && userContext?.userType) {
      if (!flag.userGroups.includes(userContext.userType)) return false;
    }
    
    // Check region
    if (flag.regions && userContext?.region) {
      if (!flag.regions.includes(userContext.region)) return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      if (userContext?.userId) {
        const hash = this.hashUserId(userContext.userId);
        if (hash > flag.rolloutPercentage) return false;
      } else {
        return Math.random() * 100 < flag.rolloutPercentage;
      }
    }
    
    return true;
  }
  
  getFlag(key: FeatureFlagKey): FeatureFlag | undefined {
    return this.flags.flags[key];
  }
  
  getAllFlags(): FeatureFlagConfig {
    return this.flags;
  }
  
  updateFlags(newFlags: Partial<FeatureFlagConfig>): void {
    this.flags = {
      ...this.flags,
      ...newFlags,
      lastUpdated: new Date().toISOString(),
    };
  }
  
  // Simple hash for consistent user bucketing
  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      hash = ((hash << 5) - hash) + userId.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash % 100);
  }
}

// Singleton instance
export const featureFlags = new FeatureFlagService();
