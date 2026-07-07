import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type OrganizerStatus = 'locked' | 'active' | 'suspended';

export interface OrganizerProps {
  userId: EntityId;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  status: OrganizerStatus;
  totalEvents: number;
  successfulEvents: number;
  averageRating: number;
  totalParticipants: number;
  isFeatured: boolean;
  featuredAt?: Date;
  createdAt?: Date;
}

export class Organizer extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _displayName: string;
  private _bio?: string;
  private _avatarUrl?: string;
  private _status: OrganizerStatus;
  private _totalEvents: number;
  private _successfulEvents: number;
  private _averageRating: number;
  private _totalParticipants: number;
  private _isFeatured: boolean;
  private _featuredAt?: Date;

  constructor(props: OrganizerProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._displayName = props.displayName;
    this._bio = props.bio;
    this._avatarUrl = props.avatarUrl;
    this._status = props.status;
    this._totalEvents = props.totalEvents;
    this._successfulEvents = props.successfulEvents;
    this._averageRating = props.averageRating;
    this._totalParticipants = props.totalParticipants;
    this._isFeatured = props.isFeatured;
    this._featuredAt = props.featuredAt;
  }

  static create(userId: EntityId, displayName: string): Organizer {
    return new Organizer({
      id: `organizer_${userId}`,
      userId,
      displayName,
      status: 'locked',
      totalEvents: 0,
      successfulEvents: 0,
      averageRating: 0,
      totalParticipants: 0,
      isFeatured: false,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get displayName(): string {
    return this._displayName;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  get status(): OrganizerStatus {
    return this._status;
  }

  get totalEvents(): number {
    return this._totalEvents;
  }

  get successfulEvents(): number {
    return this._successfulEvents;
  }

  get averageRating(): number {
    return this._averageRating;
  }

  get totalParticipants(): number {
    return this._totalParticipants;
  }

  get isFeatured(): boolean {
    return this._isFeatured;
  }

  get featuredAt(): Date | undefined {
    return this._featuredAt ? new Date(this._featuredAt) : undefined;
  }

  get isActive(): boolean {
    return this._status === 'active';
  }

  get isLocked(): boolean {
    return this._status === 'locked';
  }

  get successRate(): number {
    if (this._totalEvents === 0) return 0;
    return Math.round((this._successfulEvents / this._totalEvents) * 100);
  }

  unlock(): void {
    this._status = 'active';
    this.touch();
  }

  suspend(): void {
    this._status = 'suspended';
    this.touch();
  }

  updateProfile(details: { displayName?: string; bio?: string; avatarUrl?: string }): void {
    if (details.displayName) this._displayName = details.displayName;
    if (details.bio !== undefined) this._bio = details.bio;
    if (details.avatarUrl !== undefined) this._avatarUrl = details.avatarUrl;
    this.touch();
  }

  incrementEvents(): void {
    this._totalEvents += 1;
    this.touch();
  }

  recordSuccessfulEvent(participantCount: number): void {
    this._successfulEvents += 1;
    this._totalParticipants += participantCount;
    this.touch();
  }

  updateRating(newRating: number): void {
    this._averageRating = newRating;
    this.touch();
  }

  feature(): void {
    this._isFeatured = true;
    this._featuredAt = new Date();
    this.touch();
  }

  unfeature(): void {
    this._isFeatured = false;
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      displayName: this._displayName,
      bio: this._bio,
      avatarUrl: this._avatarUrl,
      status: this._status,
      totalEvents: this._totalEvents,
      successfulEvents: this._successfulEvents,
      averageRating: this._averageRating,
      totalParticipants: this._totalParticipants,
      isFeatured: this._isFeatured,
      featuredAt: this._featuredAt?.toISOString(),
      successRate: this.successRate,
    };
  }
}
