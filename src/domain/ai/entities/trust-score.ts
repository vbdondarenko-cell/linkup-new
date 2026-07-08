import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { TrustLevel, TrustSignals, TrustFactors } from '../types';

export interface TrustScoreProps {
  userId: EntityId;
  score: number;
  level: TrustLevel;
  factors: TrustFactors;
  signals: TrustSignals;
  lastUpdated: Date;
}

export class TrustScoreEntity extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _score: number;
  private _level: TrustLevel;
  private _factors: TrustFactors;
  private _signals: TrustSignals;
  private _lastUpdated: Date;

  constructor(props: TrustScoreProps & { id: EntityId }) {
    super(props.id);
    this._userId = props.userId;
    this._score = props.score;
    this._level = props.level;
    this._factors = { ...props.factors };
    this._signals = { ...props.signals };
    this._lastUpdated = new Date(props.lastUpdated);
  }

  static create(props: Omit<TrustScoreProps, 'id'>): TrustScoreEntity {
    return new TrustScoreEntity({
      id: `trust_${props.userId}`,
      ...props,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get score(): number {
    return this._score;
  }

  get level(): TrustLevel {
    return this._level;
  }

  get factors(): TrustFactors {
    return { ...this._factors };
  }

  get signals(): TrustSignals {
    return { ...this._signals };
  }

  get lastUpdated(): Date {
    return new Date(this._lastUpdated);
  }

  get isExpired(): boolean {
    const hoursSinceUpdate = (Date.now() - this._lastUpdated.getTime()) / (1000 * 60 * 60);
    return hoursSinceUpdate > 24;
  }

  calculateLevel(score: number): TrustLevel {
    if (score >= 90) return 'verified';
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'untrusted';
  }

  updateScore(newScore: number, signals: TrustSignals): void {
    this._score = Math.max(0, Math.min(100, newScore));
    this._level = this.calculateLevel(this._score);
    this._signals = { ...signals };
    this._factors = this.calculateFactors(signals);
    this._lastUpdated = new Date();
    this.touch();
  }

  private calculateFactors(signals: TrustSignals): TrustFactors {
    // Reliability: Based on attendance and completion rates
    const reliability = Math.min(100, (
      signals.attendanceRate * 0.5 +
      signals.completionRate * 0.5
    ));

    // Consistency: Based on account age and activity
    const consistency = Math.min(100, (
      Math.min(signals.accountAge / 365, 1) * 30 +
      Math.min(signals.totalEvents / 50, 1) * 40 +
      Math.min(signals.successfulMeetups / 20, 1) * 30
    ));

    // Reputation: Based on ratings and reports
    const reputation = Math.min(100, (
      signals.averageRating * 20 +
      Math.max(0, 100 - signals.reportsReceived * 10)
    ));

    // Verification: Based on verification level
    const verification = Math.min(100, signals.verificationLevel * 20);

    // Community: Based on social connections and engagement
    const community = Math.min(100, (
      Math.min(signals.socialConnections / 50, 1) * 50 +
      Math.min(signals.reportsFiled / 10, 1) * 50
    ));

    return {
      reliability: Math.round(reliability * 100) / 100,
      consistency: Math.round(consistency * 100) / 100,
      reputation: Math.round(reputation * 100) / 100,
      verification: Math.round(verification * 100) / 100,
      community: Math.round(community * 100) / 100,
    };
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      score: this._score,
      level: this._level,
      factors: this._factors,
      signals: this._signals,
      lastUpdated: this._lastUpdated.toISOString(),
    };
  }
}
