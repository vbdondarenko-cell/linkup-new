import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

export interface TrustScore {
  overall: number;
  events: number;
  social: number;
  verified: number;
}

export interface ReputationProps {
  userId: EntityId;
  trustScore: TrustScore;
  totalRatings: number;
  averageRating: number;
  successfulEvents: number;
  completedTransactions: number;
  createdAt?: Date;
}

export class Reputation extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _trustScore: TrustScore;
  private _totalRatings: number;
  private _averageRating: number;
  private _successfulEvents: number;
  private _completedTransactions: number;

  constructor(props: ReputationProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._trustScore = { ...props.trustScore };
    this._totalRatings = props.totalRatings;
    this._averageRating = props.averageRating;
    this._successfulEvents = props.successfulEvents;
    this._completedTransactions = props.completedTransactions;
  }

  static create(userId: EntityId): Reputation {
    return new Reputation({
      id: `rep_${userId}`,
      userId,
      trustScore: { overall: 50, events: 50, social: 50, verified: 0 },
      totalRatings: 0,
      averageRating: 0,
      successfulEvents: 0,
      completedTransactions: 0,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get trustScore(): TrustScore {
    return { ...this._trustScore };
  }

  get overallTrust(): number {
    return this._trustScore.overall;
  }

  get totalRatings(): number {
    return this._totalRatings;
  }

  get averageRating(): number {
    return this._averageRating;
  }

  get successfulEvents(): number {
    return this._successfulEvents;
  }

  get completedTransactions(): number {
    return this._completedTransactions;
  }

  updateTrustScore(newScore: Partial<TrustScore>): void {
    if (newScore.overall !== undefined) this._trustScore.overall = this.clampScore(newScore.overall);
    if (newScore.events !== undefined) this._trustScore.events = this.clampScore(newScore.events);
    if (newScore.social !== undefined) this._trustScore.social = this.clampScore(newScore.social);
    if (newScore.verified !== undefined) this._trustScore.verified = this.clampScore(newScore.verified);
    this.touch();
  }

  applyRating(newRating: number): void {
    const totalScore = this._averageRating * this._totalRatings + newRating;
    this._totalRatings += 1;
    this._averageRating = Math.round((totalScore / this._totalRatings) * 10) / 10;
    this.updateTrustFromRating();
    this.touch();
  }

  applyAttendance(): void {
    this._successfulEvents += 1;
    this._trustScore.events = Math.min(100, this._trustScore.events + 1);
    this.recalculateOverall();
    this.touch();
  }

  applyReport(severity: 'minor' | 'moderate' | 'severe'): void {
    const penalty = severity === 'severe' ? 20 : severity === 'moderate' ? 10 : 5;
    this._trustScore.overall = Math.max(0, this._trustScore.overall - penalty);
    this._trustScore.social = Math.max(0, this._trustScore.social - penalty);
    this.touch();
  }

  applyVerification(): void {
    this._trustScore.verified = 100;
    this.recalculateOverall();
    this.touch();
  }

  private clampScore(score: number): number {
    return Math.max(0, Math.min(100, score));
  }

  private updateTrustFromRating(): void {
    if (this._averageRating >= 4.5) {
      this._trustScore.events = Math.min(100, this._trustScore.events + 5);
    } else if (this._averageRating < 3) {
      this._trustScore.events = Math.max(0, this._trustScore.events - 5);
    }
    this.recalculateOverall();
  }

  private recalculateOverall(): void {
    this._trustScore.overall = Math.round(
      (this._trustScore.events * 0.4 +
        this._trustScore.social * 0.3 +
        this._trustScore.verified * 0.3)
    );
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      trustScore: this.trustScore,
      totalRatings: this._totalRatings,
      averageRating: this._averageRating,
      successfulEvents: this._successfulEvents,
      completedTransactions: this._completedTransactions,
    };
  }
}