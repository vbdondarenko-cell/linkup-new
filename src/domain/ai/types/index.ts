import { EntityId } from '../../shared/types';

// AI Module Types
export type AIModuleType = 
  | 'recommendation'
  | 'trust'
  | 'fraud'
  | 'spam'
  | 'moderation'
  | 'device'
  | 'safety'
  | 'organizer'
  | 'business';

// Trust Types
export type TrustLevel = 'untrusted' | 'low' | 'medium' | 'high' | 'verified';

export interface TrustSignals {
  userId: EntityId;
  attendanceRate: number;
  completionRate: number;
  averageRating: number;
  totalEvents: number;
  successfulMeetups: number;
  reportsReceived: number;
  reportsFiled: number;
  accountAge: number;
  verificationLevel: number;
  socialConnections: number;
}

export interface TrustScore {
  userId: EntityId;
  score: number;
  level: TrustLevel;
  factors: TrustFactors;
  lastUpdated: Date;
  signals: TrustSignals;
}

export interface TrustFactors {
  reliability: number;
  consistency: number;
  reputation: number;
  verification: number;
  community: number;
}

// Fraud Types
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface FraudSignals {
  accountAge: number;
  eventCreationRate: number;
  joinRate: number;
  messageRate: number;
  reportRate: number;
  locationChanges: number;
  deviceCount: number;
  ipVariety: number;
  suspiciousPatterns: string[];
}

export interface RiskAssessment {
  entityId: EntityId;
  entityType: 'user' | 'event' | 'business' | 'organizer';
  riskScore: number;
  riskLevel: RiskLevel;
  signals: FraudSignals;
  flags: RiskFlag[];
  recommendations: string[];
  confidence: number;
  createdAt: Date;
}

export interface RiskFlag {
  type: RiskFlagType;
  severity: number;
  description: string;
  evidence: Record<string, unknown>;
}

export type RiskFlagType =
  | 'fake_account'
  | 'bot_behavior'
  | 'mass_invitation'
  | 'fake_event'
  | 'spam_organizer'
  | 'location_spoofing'
  | 'device_farm'
  | 'duplicate_account'
  | 'premium_abuse'
  | 'reward_abuse';

// Spam Types
export interface SpamSignals {
  eventFlooding: boolean;
  messageSpam: boolean;
  joinSpam: boolean;
  notificationSpam: boolean;
  repeatedReports: boolean;
  massAccountCreation: boolean;
  rateLimitViolations: number;
}

export interface SpamAssessment {
  entityId: EntityId;
  isSpam: boolean;
  spamScore: number;
  signals: SpamSignals;
  violations: SpamViolation[];
  action: SpamAction;
  expiresAt?: Date;
}

export type SpamViolationType =
  | 'event_flooding'
  | 'message_spam'
  | 'join_spam'
  | 'notification_spam'
  | 'repeated_reports'
  | 'mass_account_creation';

export interface SpamViolation {
  type: SpamViolationType;
  count: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  severity: number;
}

export type SpamAction = 'allow' | 'warn' | 'limit' | 'block' | 'review';

// Moderation Types
export type ContentType = 'event_title' | 'event_description' | 'profile' | 'business_profile' | 'message' | 'image';
export type ModerationResult = 'approved' | 'rejected' | 'flagged' | 'pending_review';
export type ViolationType = 'profanity' | 'scam' | 'harassment' | 'illegal' | 'nsfw' | 'hate_speech' | 'violence' | 'spam';

export interface ModerationRequest {
  contentId: EntityId;
  contentType: ContentType;
  content: string;
  userId?: EntityId;
  metadata?: Record<string, unknown>;
}

export interface ModerationResult_OLD {
  contentId: EntityId;
  result: ModerationResult;
  violations: Violation[];
  confidence: number;
  reviewedAt: Date;
  requiresHumanReview: boolean;
}

export interface Violation {
  type: ViolationType;
  severity: number;
  confidence: number;
  location?: { start: number; end: number };
  details: string;
}

// Report Types
export type ReportReason = 'spam' | 'harassment' | 'fake' | 'dangerous' | 'scam' | 'other';
export type ReportTarget = 'event' | 'user' | 'business' | 'message' | 'image' | 'organizer';
export type ReportPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Report {
  id: EntityId;
  reporterId: EntityId;
  targetId: EntityId;
  targetType: ReportTarget;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  priority: ReportPriority;
  status: ReportStatus;
  aiAnalysis?: AIAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportStatus = 'pending' | 'ai_reviewed' | 'human_review' | 'resolved' | 'dismissed';

export interface AIAnalysis {
  sentiment: number;
  urgency: number;
  confidence: number;
  similarReports: number;
  recommendedAction: ReportAction;
}

export type ReportAction = 'dismiss' | 'warn' | 'temp_ban' | 'perm_ban' | 'escalate';

// Device Intelligence Types
export interface DeviceInfo {
  deviceId: string;
  fingerprint?: string;
  userId?: EntityId;
  reputation: number;
  isTrusted: boolean;
  firstSeen: Date;
  lastSeen: Date;
  riskScore: number;
  sessionCount: number;
}

export interface SessionInfo {
  sessionId: EntityId;
  userId: EntityId;
  deviceId: string;
  ipAddress: string;
  location?: { latitude: number; longitude: number };
  userAgent: string;
  startedAt: Date;
  lastActivity: Date;
  riskScore: number;
  isSuspicious: boolean;
}

// Safety Types
export interface SafetySignal {
  type: SafetySignalType;
  severity: number;
  entityId: EntityId;
  entityType: 'user' | 'organizer' | 'business';
  description: string;
  detectedAt: Date;
}

export type SafetySignalType =
  | 'multiple_reports'
  | 'repeated_noshows'
  | 'lastminute_cancellations'
  | 'high_block_rate'
  | 'suspicious_event_creation'
  | 'location_manipulation';

// Organizer/Business Intelligence Types
export interface OrganizerMetrics {
  organizerId: EntityId;
  attendanceRate: number;
  satisfactionScore: number;
  growthRate: number;
  consistencyScore: number;
  trustTrend: number;
  repeatParticipants: number;
  totalEvents: number;
  qualityScore: number;
}

export interface BusinessMetrics {
  businessId: EntityId;
  attendanceRate: number;
  reviewQuality: number;
  eventSuccessRate: number;
  repeatVisitors: number;
  growthRate: number;
  trustTrend: number;
  healthScore: number;
}

// Background Job Types
export type BackgroundJobType =
  | 'refresh_recommendations'
  | 'update_trust_scores'
  | 'recalculate_risk'
  | 'detect_spam'
  | 'recalculate_rankings'
  | 'generate_suggestions'
  | 'analyze_reports'
  | 'clean_old_signals';

export interface BackgroundJob {
  id: EntityId;
  type: BackgroundJobType;
  targetId?: EntityId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  retryCount: number;
}

// AI Config
export interface AIConfig {
  recommendationTTLHours: number;
  trustRefreshIntervalHours: number;
  fraudCheckIntervalHours: number;
  spamCheckIntervalMinutes: number;
  moderationConfidenceThreshold: number;
  humanReviewThreshold: number;
  riskScoreCritical: number;
  riskScoreHigh: number;
  riskScoreMedium: number;
}
