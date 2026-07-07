import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';

export type RatingCategory = 'event' | 'organizer' | 'business' | 'user';

export interface RatingProps {
  userId: EntityId;
  targetId: EntityId;
  targetType: RatingCategory;
  score: number;
  review?: string;
  aspects?: {
    organization?: number;
    communication?: number;
    punctuality?: number;
    value?: number;
    atmosphere?: number;
  };
  createdAt?: Date;
}

export class Rating extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _targetId: EntityId;
  private _targetType: RatingCategory;
  private _score: number;
  private _review?: string;
  private _aspects?: RatingProps['aspects'];
  private _updatedAt: Date;

  constructor(props: RatingProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._targetId = props.targetId;
    this._targetType = props.targetType;
    this._score = this.validateScore(props.score);
    this._review = props.review;
    this._aspects = props.aspects;
    this._updatedAt = new Date();
  }

  private validateScore(score: number): number {
    if (score < 1 || score > 5) {
      throw new Error('Rating score must be between 1 and 5');
    }
    return Math.round(score * 10) / 10;
  }

  static create(params: RatingProps): Rating {
    return new Rating({
      id: `rating_${params.targetType}_${params.targetId}_${params.userId}`,
      ...params,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get targetId(): EntityId {
    return this._targetId;
  }

  get targetType(): RatingCategory {
    return this._targetType;
  }

  get score(): number {
    return this._score;
  }

  get review(): string | undefined {
    return this._review;
  }

  get aspects(): typeof this._aspects {
    return this._aspects ? { ...this._aspects } : undefined;
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  update(score: number, review?: string): void {
    this._score = this.validateScore(score);
    if (review !== undefined) this._review = review;
    this._updatedAt = new Date();
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      targetId: this._targetId,
      targetType: this._targetType,
      score: this._score,
      review: this._review,
      aspects: this._aspects,
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
