import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { ReportReason, ReportTarget, ReportPriority, ReportStatus, AIAnalysis, ReportAction } from '../types';

export interface ReportProps {
  reporterId: EntityId;
  targetId: EntityId;
  targetType: ReportTarget;
  reason: ReportReason;
  description?: string;
  evidence?: string[];
  priority?: ReportPriority;
  status?: ReportStatus;
  aiAnalysis?: AIAnalysis;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ReportEntity extends BaseEntity<EntityId> {
  private _reporterId: EntityId;
  private _targetId: EntityId;
  private _targetType: ReportTarget;
  private _reason: ReportReason;
  private _description?: string;
  private _evidence: string[];
  private _priority: ReportPriority;
  private _status: ReportStatus;
  private _aiAnalysis?: AIAnalysis;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(props: ReportProps & { id: EntityId }) {
    super(props.id);
    this._reporterId = props.reporterId;
    this._targetId = props.targetId;
    this._targetType = props.targetType;
    this._reason = props.reason;
    this._description = props.description;
    this._evidence = props.evidence ? [...props.evidence] : [];
    this._priority = props.priority ?? this.calculatePriority(props.reason, props.description);
    this._status = props.status ?? 'pending';
    this._aiAnalysis = props.aiAnalysis;
    this._createdAt = new Date(props.createdAt ?? new Date());
    this._updatedAt = new Date(props.updatedAt ?? new Date());
  }

  static create(props: Omit<ReportProps, 'id' | 'priority' | 'createdAt' | 'updatedAt'>): ReportEntity {
    const now = new Date();
    return new ReportEntity({
      id: `report_${props.targetType}_${props.targetId}_${props.reporterId}_${Date.now()}`,
      ...props,
      createdAt: now,
      updatedAt: now,
    });
  }

  get reporterId(): EntityId {
    return this._reporterId;
  }

  get targetId(): EntityId {
    return this._targetId;
  }

  get targetType(): ReportTarget {
    return this._targetType;
  }

  get reason(): ReportReason {
    return this._reason;
  }

  get description(): string | undefined {
    return this._description;
  }

  get evidence(): string[] {
    return [...this._evidence];
  }

  get priority(): ReportPriority {
    return this._priority;
  }

  get status(): ReportStatus {
    return this._status;
  }

  get aiAnalysis(): AIAnalysis | undefined {
    return this._aiAnalysis;
  }

  get createdAt(): Date {
    return new Date(this._createdAt);
  }

  get updatedAt(): Date {
    return new Date(this._updatedAt);
  }

  get isPending(): boolean {
    return this._status === 'pending';
  }

  get isResolved(): boolean {
    return this._status === 'resolved';
  }

  private calculatePriority(reason: ReportReason, description?: string): ReportPriority {
    // Dangerous and scam reports are always high priority
    if (reason === 'dangerous_behavior' || reason === 'scam') {
      return 'urgent';
    }

    // Harassment is high priority
    if (reason === 'harassment') {
      return 'high';
    }

    // Fake content is medium-high
    if (reason === 'fake_profile') {
      return 'medium';
    }

    // Spam is low-medium
    if (reason === 'spam') {
      return 'low';
    }

    // Other depends on description
    if (description) {
      const urgentKeywords = ['danger', 'threat', 'unsafe', 'attack'];
      const hasUrgent = urgentKeywords.some(k => description.toLowerCase().includes(k));
      if (hasUrgent) return 'high';
    }

    return 'medium';
  }

  static calculatePriorityFromAI(analysis: AIAnalysis, reason: ReportReason): ReportPriority {
    // High urgency from AI analysis
    if (analysis.urgency >= 0.9) return 'urgent';
    if (analysis.urgency >= 0.7) return 'high';
    if (analysis.urgency >= 0.4) return 'medium';
    return 'low';
  }

  setAIAnalysis(analysis: AIAnalysis): void {
    this._aiAnalysis = analysis;
    this._priority = ReportEntity.calculatePriorityFromAI(analysis, this._reason);
    this._status = 'reviewed';
    this._updatedAt = new Date();
    this.touch();
  }

  markAIReviewed(): void {
    this._status = 'reviewed';
    this._updatedAt = new Date();
    this.touch();
  }

  escalateToHuman(): void {
    this._status = 'reviewed';
    this._priority = this._priority === 'low' ? 'medium' : 
                     this._priority === 'medium' ? 'high' : 
                     this._priority === 'high' ? 'urgent' : 'urgent';
    this._updatedAt = new Date();
    this.touch();
  }

  resolve(action: ReportAction): void {
    this._status = 'resolved';
    this._updatedAt = new Date();
    this.touch();
  }

  dismiss(): void {
    this._status = 'dismissed';
    this._updatedAt = new Date();
    this.touch();
  }

  addEvidence(evidence: string): void {
    this._evidence.push(evidence);
    this._updatedAt = new Date();
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      reporterId: this._reporterId,
      targetId: this._targetId,
      targetType: this._targetType,
      reason: this._reason,
      description: this._description,
      evidence: this._evidence,
      priority: this._priority,
      status: this._status,
      aiAnalysis: this._aiAnalysis,
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
