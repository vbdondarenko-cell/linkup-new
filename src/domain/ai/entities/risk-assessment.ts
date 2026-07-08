import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { RiskLevel, FraudSignals, RiskFlag } from '../types';

export type RiskEntityType = 'user' | 'event' | 'business' | 'organizer';

export interface RiskAssessmentProps {
  entityId: EntityId;
  entityType: RiskEntityType;
  riskScore: number;
  riskLevel: RiskLevel;
  signals: FraudSignals;
  flags: RiskFlag[];
  recommendations: string[];
  confidence: number;
  createdAt: Date;
}

export class RiskAssessmentEntity extends BaseEntity<EntityId> {
  private _entityId: EntityId;
  private _entityType: RiskEntityType;
  private _riskScore: number;
  private _riskLevel: RiskLevel;
  private _signals: FraudSignals;
  private _flags: RiskFlag[];
  private _recommendations: string[];
  private _confidence: number;
  private _createdAt: Date;

  constructor(props: RiskAssessmentProps & { id: EntityId }) {
    super(props.id);
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._riskScore = props.riskScore;
    this._riskLevel = props.riskLevel;
    this._signals = { ...props.signals };
    this._flags = [...props.flags];
    this._recommendations = [...props.recommendations];
    this._confidence = props.confidence;
    this._createdAt = new Date(props.createdAt);
  }

  static create(props: Omit<RiskAssessmentProps, 'id'>): RiskAssessmentEntity {
    return new RiskAssessmentEntity({
      id: `risk_${props.entityType}_${props.entityId}_${Date.now()}`,
      ...props,
    });
  }

  get entityId(): EntityId {
    return this._entityId;
  }

  get entityType(): RiskEntityType {
    return this._entityType;
  }

  get riskScore(): number {
    return this._riskScore;
  }

  get riskLevel(): RiskLevel {
    return this._riskLevel;
  }

  get signals(): FraudSignals {
    return { ...this._signals };
  }

  get flags(): RiskFlag[] {
    return [...this._flags];
  }

  get recommendations(): string[] {
    return [...this._recommendations];
  }

  get confidence(): number {
    return this._confidence;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get isExpired(): boolean {
    const hoursSinceCreation = (Date.now() - this._createdAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCreation > 1;
  }

  static calculateRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 30) return 'medium';
    return 'low';
  }

  static calculateRiskScore(signals: FraudSignals): number {
    let score = 0;

    // Account age factor (new accounts are riskier)
    if (signals.accountAge < 1) score += 20;
    else if (signals.accountAge < 7) score += 15;
    else if (signals.accountAge < 30) score += 10;

    // Event creation rate
    if (signals.eventCreationRate > 10) score += 25;
    else if (signals.eventCreationRate > 5) score += 15;
    else if (signals.eventCreationRate > 2) score += 10;

    // Join rate
    if (signals.joinRate > 50) score += 20;
    else if (signals.joinRate > 20) score += 10;

    // Message rate
    if (signals.messageRate > 100) score += 15;
    else if (signals.messageRate > 50) score += 10;

    // Report rate
    score += Math.min(30, signals.reportRate * 10);

    // Location changes
    if (signals.locationChanges > 10) score += 15;
    else if (signals.locationChanges > 5) score += 10;

    // Device count
    if (signals.deviceCount > 5) score += 15;
    else if (signals.deviceCount > 3) score += 10;

    // IP variety
    if (signals.ipVariety > 10) score += 10;
    else if (signals.ipVariety > 5) score += 5;

    // Suspicious patterns
    score += signals.suspiciousPatterns.length * 5;

    return Math.min(100, score);
  }

  updateRiskLevel(): void {
    this._riskLevel = RiskAssessmentEntity.calculateRiskLevel(this._riskScore);
    this.touch();
  }

  addFlag(flag: RiskFlag): void {
    this._flags.push(flag);
    this._riskScore = Math.min(100, this._riskScore + flag.severity);
    this._riskLevel = RiskAssessmentEntity.calculateRiskLevel(this._riskScore);
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      entityId: this._entityId,
      entityType: this._entityType,
      riskScore: this._riskScore,
      riskLevel: this._riskLevel,
      signals: this._signals,
      flags: this._flags,
      recommendations: this._recommendations,
      confidence: this._confidence,
      createdAt: this._createdAt.toISOString(),
    };
  }
}
