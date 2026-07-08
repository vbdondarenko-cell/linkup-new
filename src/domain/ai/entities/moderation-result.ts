import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { ContentType, ModerationResult, ViolationType, Violation } from '../types';

export interface ModerationResultProps {
  contentId: EntityId;
  contentType: ContentType;
  result: ModerationResult;
  violations: Violation[];
  confidence: number;
  requiresHumanReview: boolean;
  reviewedAt: Date;
  reviewerId?: EntityId;
  notes?: string;
}

export class ModerationResultEntity extends BaseEntity<EntityId> {
  private _contentId: EntityId;
  private _contentType: ContentType;
  private _result: ModerationResult;
  private _violations: Violation[];
  private _confidence: number;
  private _requiresHumanReview: boolean;
  private _reviewedAt: Date;
  private _reviewerId?: EntityId;
  private _notes?: string;

  constructor(props: ModerationResultProps & { id: EntityId }) {
    super(props.id);
    this._contentId = props.contentId;
    this._contentType = props.contentType;
    this._result = props.result;
    this._violations = [...props.violations];
    this._confidence = props.confidence;
    this._requiresHumanReview = props.requiresHumanReview;
    this._reviewedAt = new Date(props.reviewedAt);
    this._reviewerId = props.reviewerId;
    this._notes = props.notes;
  }

  static create(props: Omit<ModerationResultProps, 'id'>): ModerationResultEntity {
    return new ModerationResultEntity({
      id: `mod_${props.contentType}_${props.contentId}_${Date.now()}`,
      ...props,
    });
  }

  get contentId(): EntityId {
    return this._contentId;
  }

  get contentType(): ContentType {
    return this._contentType;
  }

  get result(): ModerationResult {
    return this._result;
  }

  get violations(): Violation[] {
    return [...this._violations];
  }

  get confidence(): number {
    return this._confidence;
  }

  get requiresHumanReview(): boolean {
    return this._requiresHumanReview;
  }

  get reviewedAt(): Date {
    return new Date(this._reviewedAt);
  }

  get reviewerId(): EntityId | undefined {
    return this._reviewerId;
  }

  get notes(): string | undefined {
    return this._notes;
  }

  get isApproved(): boolean {
    return this._result === 'approved';
  }

  get isRejected(): boolean {
    return this._result === 'rejected';
  }

  get isPendingReview(): boolean {
    return this._result === 'pending_review' || this._requiresHumanReview;
  }

  get mostSevereViolation(): Violation | undefined {
    if (this._violations.length === 0) return undefined;
    return this._violations.reduce((max, v) => v.severity > max.severity ? v : max);
  }

  static shouldRequireHumanReview(confidence: number, violations: Violation[]): boolean {
    // Low confidence in AI decision
    if (confidence < 0.7) return true;

    // Multiple violations or high severity
    const hasHighSeverity = violations.some(v => v.severity >= 80);
    if (hasHighSeverity) return true;

    // Ambiguous cases
    if (violations.length >= 3) return true;

    return false;
  }

  approve(): void {
    this._result = 'approved';
    this._requiresHumanReview = false;
    this._reviewedAt = new Date();
    this.touch();
  }

  reject(reason: string): void {
    this._result = 'rejected';
    this._requiresHumanReview = false;
    this._notes = reason;
    this._reviewedAt = new Date();
    this.touch();
  }

  flagForReview(notes?: string): void {
    this._result = 'flagged';
    this._requiresHumanReview = true;
    if (notes) this._notes = notes;
    this._reviewedAt = new Date();
    this.touch();
  }

  addViolation(violation: Violation): void {
    this._violations.push(violation);
    this._confidence = Math.min(1, this._confidence - 0.1);
    this._requiresHumanReview = ModerationResultEntity.shouldRequireHumanReview(
      this._confidence,
      this._violations
    );
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      contentId: this._contentId,
      contentType: this._contentType,
      result: this._result,
      violations: this._violations,
      confidence: this._confidence,
      requiresHumanReview: this._requiresHumanReview,
      reviewedAt: this._reviewedAt.toISOString(),
      reviewerId: this._reviewerId,
      notes: this._notes,
    };
  }
}

// Violation factory
export class ViolationFactory {
  static create(
    type: ViolationType,
    severity: number,
    confidence: number,
    details: string,
    location?: { start: number; end: number }
  ): Violation {
    return {
      type,
      severity: Math.max(0, Math.min(100, severity)),
      confidence: Math.max(0, Math.min(1, confidence)),
      location,
      details,
    };
  }

  static profanity(text: string, location?: { start: number; end: number }): Violation {
    return ViolationFactory.create('profanity', 70, 0.95, `Profanity detected: "${text}"`, location);
  }

  static scam(details: string): Violation {
    return ViolationFactory.create('scam', 100, 0.9, `Scam content detected: ${details}`);
  }

  static harassment(target?: string): Violation {
    return ViolationFactory.create('harassment', 90, 0.85, `Harassment detected${target ? ` targeting ${target}` : ''}`);
  }

  static illegal(content: string): Violation {
    return ViolationFactory.create('illegal', 100, 0.95, `Illegal content detected: ${content}`);
  }

  static nsfw(): Violation {
    return ViolationFactory.create('nsfw', 95, 0.9, 'NSFW content detected');
  }

  static hateSpeech(): Violation {
    return ViolationFactory.create('hate_speech', 95, 0.85, 'Hate speech detected');
  }

  static violence(): Violation {
    return ViolationFactory.create('violence', 90, 0.85, 'Violence-related content detected');
  }

  static spam(): Violation {
    return ViolationFactory.create('spam', 60, 0.8, 'Spam-like content detected');
  }
}
