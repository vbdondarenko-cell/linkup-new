import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { SpamSignals, SpamViolation, SpamAction } from '../types';

export interface SpamAssessmentProps {
  entityId: EntityId;
  isSpam: boolean;
  spamScore: number;
  signals: SpamSignals;
  violations: SpamViolation[];
  action: SpamAction;
  expiresAt?: Date;
  createdAt: Date;
}

export class SpamAssessmentEntity extends BaseEntity<EntityId> {
  private _entityId: EntityId;
  private _isSpam: boolean;
  private _spamScore: number;
  private _signals: SpamSignals;
  private _violations: SpamViolation[];
  private _action: SpamAction;
  private _expiresAt?: Date;
  private _createdAt: Date;

  constructor(props: SpamAssessmentProps & { id: EntityId }) {
    super(props.id);
    this._entityId = props.entityId;
    this._isSpam = props.isSpam;
    this._spamScore = props.spamScore;
    this._signals = { ...props.signals };
    this._violations = [...props.violations];
    this._action = props.action;
    this._expiresAt = props.expiresAt ? new Date(props.expiresAt) : undefined;
    this._createdAt = new Date(props.createdAt);
  }

  static create(props: Omit<SpamAssessmentProps, 'id'>): SpamAssessmentEntity {
    return new SpamAssessmentEntity({
      id: `spam_${props.entityId}_${Date.now()}`,
      ...props,
    });
  }

  get entityId(): EntityId {
    return this._entityId;
  }

  get isSpam(): boolean {
    return this._isSpam;
  }

  get spamScore(): number {
    return this._spamScore;
  }

  get signals(): SpamSignals {
    return { ...this._signals };
  }

  get violations(): SpamViolation[] {
    return [...this._violations];
  }

  get action(): SpamAction {
    return this._action;
  }

  get expiresAt(): Date | undefined {
    return this._expiresAt ? new Date(this._expiresAt) : undefined;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get isExpired(): boolean {
    if (!this._expiresAt) return false;
    return new Date() > this._expiresAt;
  }

  static calculateSpamScore(signals: SpamSignals): number {
    let score = 0;

    if (signals.eventFlooding) score += 30;
    if (signals.messageSpam) score += 25;
    if (signals.joinSpam) score += 15;
    if (signals.notificationSpam) score += 20;
    if (signals.repeatedReports) score += 25;
    if (signals.massAccountCreation) score += 40;

    score += signals.rateLimitViolations * 5;

    return Math.min(100, score);
  }

  static determineAction(score: number): SpamAction {
    if (score >= 80) return 'block';
    if (score >= 60) return 'limit';
    if (score >= 40) return 'warn';
    return 'allow';
  }

  addViolation(violation: SpamViolation): void {
    this._violations.push(violation);
    this._spamScore = Math.min(100, this._spamScore + violation.severity);
    this._isSpam = this._spamScore >= 50;
    this._action = SpamAssessmentEntity.determineAction(this._spamScore);
    this.touch();
  }

  clearViolations(): void {
    this._violations = [];
    this._spamScore = SpamAssessmentEntity.calculateSpamScore(this._signals);
    this._isSpam = this._spamScore >= 50;
    this._action = SpamAssessmentEntity.determineAction(this._spamScore);
    this.touch();
  }

  setExpiration(hours: number): void {
    this._expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000);
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      entityId: this._entityId,
      isSpam: this._isSpam,
      spamScore: this._spamScore,
      signals: this._signals,
      violations: this._violations,
      action: this._action,
      expiresAt: this._expiresAt?.toISOString(),
      createdAt: this._createdAt.toISOString(),
    };
  }
}
