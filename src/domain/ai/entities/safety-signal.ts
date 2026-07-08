import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId } from '../../shared/types';
import { SafetySignalType } from '../types';

export interface SafetySignalProps {
  type: SafetySignalType;
  severity: number;
  entityId: EntityId;
  entityType: 'user' | 'organizer' | 'business';
  description: string;
  evidence: Record<string, unknown>;
  detectedAt: Date;
  resolvedAt?: Date;
  resolved: boolean;
}

export class SafetySignalEntity extends BaseEntity<EntityId> {
  private _type: SafetySignalType;
  private _severity: number;
  private _entityId: EntityId;
  private _entityType: 'user' | 'organizer' | 'business';
  private _description: string;
  private _evidence: Record<string, unknown>;
  private _detectedAt: Date;
  private _resolvedAt?: Date;
  private _resolved: boolean;

  constructor(props: SafetySignalProps & { id: EntityId }) {
    super(props.id);
    this._type = props.type;
    this._severity = Math.max(0, Math.min(100, props.severity));
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._description = props.description;
    this._evidence = { ...props.evidence };
    this._detectedAt = new Date(props.detectedAt);
    this._resolvedAt = props.resolvedAt ? new Date(props.resolvedAt) : undefined;
    this._resolved = props.resolved;
  }

  static create(props: Omit<SafetySignalProps, 'id' | 'resolved' | 'detectedAt'>): SafetySignalEntity {
    return new SafetySignalEntity({
      id: `safety_${props.entityType}_${props.entityId}_${props.type}_${Date.now()}`,
      ...props,
      resolved: false,
      detectedAt: new Date(),
    });
  }

  get type(): SafetySignalType {
    return this._type;
  }

  get severity(): number {
    return this._severity;
  }

  get entityId(): EntityId {
    return this._entityId;
  }

  get entityType(): 'user' | 'organizer' | 'business' {
    return this._entityType;
  }

  get description(): string {
    return this._description;
  }

  get evidence(): Record<string, unknown> {
    return { ...this._evidence };
  }

  get detectedAt(): Date {
    return new Date(this._detectedAt);
  }

  get resolvedAt(): Date | undefined {
    return this._resolvedAt ? new Date(this._resolvedAt) : undefined;
  }

  get isResolved(): boolean {
    return this._resolved;
  }

  get isUrgent(): boolean {
    return this._severity >= 80;
  }

  get isExpired(): boolean {
    // Safety signals older than 30 days without resolution are considered expired
    const daysSinceDetection = (Date.now() - this._detectedAt.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceDetection > 30 && !this._resolved;
  }

  resolve(): void {
    this._resolved = true;
    this._resolvedAt = new Date();
    this.touch();
  }

  escalate(additionalSeverity: number): void {
    this._severity = Math.min(100, this._severity + additionalSeverity);
    this.touch();
  }

  addEvidence(key: string, value: unknown): void {
    this._evidence[key] = value;
    this.touch();
  }

  static createMultipleReports(entityId: EntityId, entityType: 'user' | 'organizer' | 'business', reportCount: number, timeWindow: number): SafetySignalEntity {
    return SafetySignalEntity.create({
      type: 'multiple_reports',
      severity: Math.min(100, reportCount * 15),
      entityId,
      entityType,
      description: `${reportCount} reports received within ${timeWindow} hours`,
      evidence: { reportCount, timeWindowHours: timeWindow },
    });
  }

  static createRepeatedNoShows(entityId: EntityId, entityType: 'user' | 'organizer' | 'business', noShowCount: number, totalEvents: number): SafetySignalEntity {
    const noShowRate = totalEvents > 0 ? noShowCount / totalEvents : 0;
    return SafetySignalEntity.create({
      type: 'repeated_noshows',
      severity: Math.min(100, noShowRate * 100),
      entityId,
      entityType,
      description: `${noShowCount} no-shows out of ${totalEvents} events (${(noShowRate * 100).toFixed(1)}%)`,
      evidence: { noShowCount, totalEvents, noShowRate },
    });
  }

  static createLastMinuteCancellations(entityId: EntityId, entityType: 'user' | 'organizer' | 'business', cancellationCount: number, recentEvents: number): SafetySignalEntity {
    return SafetySignalEntity.create({
      type: 'lastminute_cancellations',
      severity: Math.min(100, cancellationCount * 20),
      entityId,
      entityType,
      description: `${cancellationCount} last-minute cancellations from ${recentEvents} recent events`,
      evidence: { cancellationCount, recentEvents },
    });
  }

  static createHighBlockRate(entityId: EntityId, entityType: 'user' | 'organizer' | 'business', blockCount: number, totalInteractions: number): SafetySignalEntity {
    const blockRate = totalInteractions > 0 ? blockCount / totalInteractions : 0;
    return SafetySignalEntity.create({
      type: 'high_block_rate',
      severity: Math.min(100, blockRate * 100),
      entityId,
      entityType,
      description: `${blockCount} blocks out of ${totalInteractions} interactions (${(blockRate * 100).toFixed(1)}%)`,
      evidence: { blockCount, totalInteractions, blockRate },
    });
  }

  static createSuspiciousEventCreation(entityId: EntityId, eventCount: number, timeWindow: number): SafetySignalEntity {
    return SafetySignalEntity.create({
      type: 'suspicious_event_creation',
      severity: Math.min(100, eventCount * 10),
      entityId,
      entityType: 'organizer',
      description: `${eventCount} events created within ${timeWindow} hours`,
      evidence: { eventCount, timeWindowHours: timeWindow },
    });
  }

  static createLocationManipulation(entityId: EntityId, locationChanges: number, rapidChange: boolean): SafetySignalEntity {
    return SafetySignalEntity.create({
      type: 'location_manipulation',
      severity: rapidChange ? 80 : Math.min(100, locationChanges * 10),
      entityId,
      entityType: 'user',
      description: rapidChange 
        ? 'Rapid location changes detected - possible spoofing'
        : `${locationChanges} location changes detected`,
      evidence: { locationChanges, rapidChange },
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      type: this._type,
      severity: this._severity,
      entityId: this._entityId,
      entityType: this._entityType,
      description: this._description,
      evidence: this._evidence,
      detectedAt: this._detectedAt.toISOString(),
      resolvedAt: this._resolvedAt?.toISOString(),
      resolved: this._resolved,
    };
  }
}
