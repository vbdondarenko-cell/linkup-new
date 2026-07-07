import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

export type RecommendationType = 'event' | 'user' | 'organizer' | 'category';

export interface RecommendationProps {
  userId: EntityId;
  type: RecommendationType;
  targetId: EntityId;
  targetType: 'event' | 'user' | 'organizer' | 'category';
  score: number;
  reasons: string[];
  expiresAt: Date;
  createdAt?: Date;
}

export class Recommendation extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _type: RecommendationType;
  private _targetId: EntityId;
  private _targetType: RecommendationType;
  private _score: number;
  private _reasons: string[];
  private _expiresAt: Date;

  constructor(props: RecommendationProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._type = props.type;
    this._targetId = props.targetId;
    this._targetType = props.targetType;
    this._score = props.score;
    this._reasons = [...props.reasons];
    this._expiresAt = new Date(props.expiresAt);
  }

  static create(params: {
    userId: EntityId;
    type: RecommendationType;
    targetId: EntityId;
    targetType: RecommendationProps['targetType'];
    score: number;
    reasons: string[];
    ttlDays?: number;
  }): Recommendation {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (params.ttlDays || 7));

    return new Recommendation({
      id: `rec_${params.userId}_${params.targetType}_${params.targetId}_${Date.now()}`,
      userId: params.userId,
      type: params.type,
      targetId: params.targetId,
      targetType: params.targetType,
      score: params.score,
      reasons: params.reasons,
      expiresAt,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get type(): RecommendationType {
    return this._type;
  }

  get targetId(): EntityId {
    return this._targetId;
  }

  get targetType(): RecommendationProps['targetType'] {
    return this._targetType;
  }

  get score(): number {
    return this._score;
  }

  get reasons(): string[] {
    return [...this._reasons];
  }

  get expiresAt(): Date {
    return new Date(this._expiresAt);
  }

  get isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  refreshScore(newScore: number): void {
    this._score = newScore;
    this.touch();
  }

  addReason(reason: string): void {
    if (!this._reasons.includes(reason)) {
      this._reasons.push(reason);
      this.touch();
    }
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      type: this._type,
      targetId: this._targetId,
      targetType: this._targetType,
      score: this._score,
      reasons: [...this._reasons],
      expiresAt: this._expiresAt.toISOString(),
      isExpired: this.isExpired,
    };
  }
}
