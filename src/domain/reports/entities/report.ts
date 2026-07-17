import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type ReportType = 'event' | 'user' | 'message' | 'business' | 'content';
import type { ReportReason } from '../../../shared/types/enums';
export type { ReportReason };
import type { ReportStatus } from '../../../shared/types/enums';
export type { ReportStatus };

export interface ReportProps {
  reporterId: EntityId;
  type: ReportType;
  targetId: EntityId;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  status: ReportStatus;
  reviewedBy?: EntityId;
  reviewedAt?: Date;
  resolution?: string;
  createdAt?: Date;
}

export class Report extends BaseEntity<EntityId> {
  private _reporterId: EntityId;
  private _type: ReportType;
  private _targetId: EntityId;
  private _reason: ReportReason;
  private _description?: string;
  private _evidence?: string[];
  private _status: ReportStatus;
  private _reviewedBy?: EntityId;
  private _reviewedAt?: Date;
  private _resolution?: string;

  constructor(props: ReportProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._reporterId = props.reporterId;
    this._type = props.type;
    this._targetId = props.targetId;
    this._reason = props.reason;
    this._description = props.description;
    this._evidence = props.evidence;
    this._status = props.status;
    this._reviewedBy = props.reviewedBy;
    this._reviewedAt = props.reviewedAt ? new Date(props.reviewedAt) : undefined;
    this._resolution = props.resolution;
  }

  static create(params: {
    reporterId: EntityId;
    type: ReportType;
    targetId: EntityId;
    reason: ReportReason;
    description?: string;
    evidence?: string[];
  }): Report {
    return new Report({
      id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...params,
      status: 'pending',
    });
  }

  get reporterId(): EntityId {
    return this._reporterId;
  }

  get type(): ReportType {
    return this._type;
  }

  get targetId(): EntityId {
    return this._targetId;
  }

  get reason(): ReportReason {
    return this._reason;
  }

  get description(): string | undefined {
    return this._description;
  }

  get evidence(): string[] | undefined {
    return this._evidence ? [...this._evidence] : undefined;
  }

  get status(): ReportStatus {
    return this._status;
  }

  get reviewedBy(): string | undefined {
    return this._reviewedBy;
  }

  get reviewedAt(): Date | undefined {
    return this._reviewedAt ? new Date(this._reviewedAt) : undefined;
  }

  get resolution(): string | undefined {
    return this._resolution;
  }

  get isPending(): boolean {
    return this._status === 'pending';
  }

  get isResolved(): boolean {
    return this._status === 'resolved';
  }

  get isDismissed(): boolean {
    return this._status === 'dismissed';
  }

  resolve(reviewerId: EntityId, resolution: string): void {
    this._status = 'resolved';
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this._resolution = resolution;
    this.touch();
  }

  dismiss(reviewerId: EntityId, reason: string): void {
    this._status = 'dismissed';
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this._resolution = reason;
    this.touch();
  }

  markAsReviewed(reviewerId: EntityId): void {
    this._status = 'reviewed';
    this._reviewedBy = reviewerId;
    this._reviewedAt = new Date();
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      reporterId: this._reporterId,
      type: this._type,
      targetId: this._targetId,
      reason: this._reason,
      description: this._description,
      evidence: this._evidence,
      status: this._status,
      reviewedBy: this._reviewedBy,
      reviewedAt: this._reviewedAt?.toISOString(),
      resolution: this._resolution,
    };
  }
}
