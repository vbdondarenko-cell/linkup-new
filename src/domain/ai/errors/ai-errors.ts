export class AIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AIError';
  }
}

export class TrustIntelligenceError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'TRUST_ERROR', details);
    this.name = 'TrustIntelligenceError';
  }
}

export class FraudDetectionError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'FRAUD_ERROR', details);
    this.name = 'FraudDetectionError';
  }
}

export class AntiSpamError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SPAM_ERROR', details);
    this.name = 'AntiSpamError';
  }
}

export class ContentModerationError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'MODERATION_ERROR', details);
    this.name = 'ContentModerationError';
  }
}

export class DeviceIntelligenceError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DEVICE_ERROR', details);
    this.name = 'DeviceIntelligenceError';
  }
}

export class SafetyIntelligenceError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SAFETY_ERROR', details);
    this.name = 'SafetyIntelligenceError';
  }
}

export class RecommendationError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'RECOMMENDATION_ERROR', details);
    this.name = 'RecommendationError';
  }
}

export class AIOrchestratorError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'ORCHESTRATOR_ERROR', details);
    this.name = 'AIOrchestratorError';
  }
}
