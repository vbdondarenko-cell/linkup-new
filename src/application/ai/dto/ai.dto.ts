import { EntityId } from '../../../domain/shared/types';
import { 
  ReportReason, 
  ReportTarget, 
  ContentType, 
  RiskLevel,
  TrustLevel 
} from '../../../domain/ai/types';

// Trust DTOs
export interface TrustScoreDTO {
  userId: string;
  score: number;
  level: TrustLevel;
  factors: {
    reliability: number;
    consistency: number;
    reputation: number;
    verification: number;
    community: number;
  };
  isExpired: boolean;
  lastUpdated: string;
}

export interface UserTrustSummaryDTO {
  userId: string;
  trustLevel: TrustLevel;
  badge?: string;
  joinedEvents: number;
  organizedEvents: number;
}

// Risk DTOs
export interface RiskAssessmentDTO {
  entityId: string;
  entityType: 'user' | 'event' | 'business' | 'organizer';
  riskScore: number;
  riskLevel: RiskLevel;
  flags: RiskFlagDTO[];
  recommendations: string[];
  confidence: number;
  createdAt: string;
}

export interface RiskFlagDTO {
  type: string;
  severity: number;
  description: string;
}

// Spam DTOs
export interface SpamStatusDTO {
  entityId: string;
  isSpam: boolean;
  spamScore: number;
  action: 'allow' | 'warn' | 'limit' | 'block' | 'review';
  violations: SpamViolationDTO[];
  expiresAt?: string;
}

export interface SpamViolationDTO {
  type: string;
  count: number;
  severity: number;
}

// Moderation DTOs
export interface ContentModerationRequestDTO {
  contentId: string;
  contentType: ContentType;
  content: string;
  userId?: string;
}

export interface ContentModerationResultDTO {
  contentId: string;
  result: 'approved' | 'rejected' | 'flagged' | 'pending_review';
  violations: ViolationDTO[];
  confidence: number;
  requiresHumanReview: boolean;
  reviewedAt: string;
}

export interface ViolationDTO {
  type: string;
  severity: number;
  details: string;
}

// Report DTOs
export interface CreateReportDTO {
  targetId: string;
  targetType: ReportTarget;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
}

export interface ReportDTO {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: ReportTarget;
  reason: ReportReason;
  description?: string;
  evidence: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'ai_reviewed' | 'human_review' | 'resolved' | 'dismissed';
  aiAnalysis?: {
    sentiment: number;
    urgency: number;
    confidence: number;
    recommendedAction: string;
  };
  createdAt: string;
}

// Device DTOs
export interface DeviceRegistrationDTO {
  deviceId: string;
  fingerprint?: string;
  userAgent?: string;
  ipAddress: string;
  location?: {
    latitude: number;
    longitude: number;
    city?: string;
  };
}

export interface DeviceInfoDTO {
  deviceId: string;
  isTrusted: boolean;
  reputation: number;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
  ipAddresses: string[];
}

export interface SessionRiskDTO {
  sessionId: string;
  riskScore: number;
  isSuspicious: boolean;
  warnings: string[];
}

// Recommendation DTOs
export interface RecommendationDTO {
  eventId: string;
  score: number;
  reasons: string[];
  reasonsKey: string[];
}

export interface DiscoveryCategoryDTO {
  category: string;
  title: string;
  description: string;
  recommendations: RecommendationDTO[];
}

export interface RecommendationsResponseDTO {
  userId: string;
  categories: DiscoveryCategoryDTO[];
  lastUpdated: string;
}

// Safety DTOs
export interface SafetyStatusDTO {
  entityId: string;
  overallRisk: number;
  activeSignals: number;
  isRestricted: boolean;
  canCreateEvents: boolean;
  canJoinEvents: boolean;
  canMessage: boolean;
  visibilityMultiplier: number;
}

export interface SafetySignalDTO {
  id: string;
  type: string;
  severity: number;
  description: string;
  detectedAt: string;
  isResolved: boolean;
}

// Organizer Intelligence DTOs
export interface OrganizerQualityDTO {
  organizerId: string;
  overallScore: number;
  badges: string[];
  attendanceRate: number;
  satisfactionScore: number;
  growthRate: number;
  recommendationWeight: number;
  explanations: string[];
}

// Business Intelligence DTOs
export interface BusinessHealthDTO {
  businessId: string;
  overallHealth: number;
  status: 'excellent' | 'good' | 'fair' | 'concerning' | 'critical';
  attendanceRate: number;
  reviewQuality: number;
  repeatVisitorRate: number;
  recommendations: string[];
}

// AI Stats DTOs
export interface AIStatsDTO {
  spamActiveCases: number;
  pendingModeration: number;
  highRiskEntities: number;
  unresolvedSafetySignals: number;
  avgProcessingTimeMs: number;
}
