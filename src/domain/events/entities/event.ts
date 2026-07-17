import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';
import { Coordinates } from '../../profiles/value-objects/coordinates';
import { EventCapacity } from '../value-objects/event-capacity';
import { Money } from '../value-objects/money';
import { DateRange } from '../../shared/types';

export type EventStatus = 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled' | 'archived';
export type EventVisibility = 'public' | 'private' | 'followers';

export interface EventProps {
  organizerId: EntityId;
  title: string;
  description: string;
  coverImageUrl?: string;
  location?: {
    coordinates: { latitude: number; longitude: number };
    address?: string;
    city?: string;
    placeId?: string;
  };
  startDate: Date;
  endDate: Date;
  capacity?: EventCapacity;
  isFree: boolean;
  price?: Money;
  visibility: EventVisibility;
  interests: string[];
  seriesId?: EntityId;
  parentEventId?: EntityId;
  status: EventStatus;
  createdAt?: Date;
}

export class Event extends BaseEntity<EntityId> {
  private _organizerId: EntityId;
  private _title: string;
  private _description: string;
  private _coverImageUrl?: string;
  private _location?: {
    coordinates: Coordinates;
    address?: string;
    city?: string;
    placeId?: string;
  };
  private _startDate: Date;
  private _endDate: Date;
  private _capacity?: EventCapacity;
  private _isFree: boolean;
  private _price?: Money;
  private _visibility: EventVisibility;
  private _interests: string[];
  private _seriesId?: EntityId;
  private _parentEventId?: EntityId;
  private _status: EventStatus;

  constructor(props: EventProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._organizerId = props.organizerId;
    this._title = props.title;
    this._description = props.description;
    this._coverImageUrl = props.coverImageUrl;
    this._location = props.location ? {
      coordinates: Coordinates.create(props.location.coordinates.latitude, props.location.coordinates.longitude),
      address: props.location.address,
      city: props.location.city,
      placeId: props.location.placeId,
    } : undefined;
    this._startDate = new Date(props.startDate);
    this._endDate = new Date(props.endDate);
    this._capacity = props.capacity;
    this._isFree = props.isFree;
    this._price = props.price;
    this._visibility = props.visibility;
    this._interests = [...props.interests];
    this._seriesId = props.seriesId;
    this._parentEventId = props.parentEventId;
    this._status = props.status;
  }

  static create(props: Omit<EventProps, 'status'>): Event {
    return new Event({ ...props, status: 'draft' });
  }

  get organizerId(): EntityId {
    return this._organizerId;
  }

  get title(): string {
    return this._title;
  }

  get description(): string {
    return this._description;
  }

  get coverImageUrl(): string | undefined {
    return this._coverImageUrl;
  }

  get location(): typeof this._location {
    return this._location ? { ...this._location } : undefined;
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  get duration(): number {
    return this._endDate.getTime() - this._startDate.getTime();
  }

  get capacity(): EventCapacity | undefined {
    return this._capacity;
  }

  get isFree(): boolean {
    return this._isFree;
  }

  get price(): Money | undefined {
    return this._price;
  }

  get visibility(): EventVisibility {
    return this._visibility;
  }

  get interests(): string[] {
    return [...this._interests];
  }

  get seriesId(): string | undefined {
    return this._seriesId;
  }

  get parentEventId(): string | undefined {
    return this._parentEventId;
  }

  get status(): EventStatus {
    return this._status;
  }

  get isDraft(): boolean {
    return this._status === 'draft';
  }

  get isPublished(): boolean {
    return this._status === 'published';
  }

  get isOngoing(): boolean {
    return this._status === 'ongoing';
  }

  get isCompleted(): boolean {
    return this._status === 'completed';
  }

  get isCancelled(): boolean {
    return this._status === 'cancelled';
  }

  get hasStarted(): boolean {
    return new Date() >= this._startDate;
  }

  get hasEnded(): boolean {
    return new Date() >= this._endDate;
  }

  updateTitle(title: string): void {
    this._title = title;
    this.touch();
  }

  updateDescription(description: string): void {
    this._description = description;
    this.touch();
  }

  updateLocation(location: typeof this._location): void {
    this._location = location;
    this.touch();
  }

  updateDates(startDate: Date, endDate: Date): void {
    if (startDate >= endDate) {
      throw new Error('Start date must be before end date');
    }
    this._startDate = startDate;
    this._endDate = endDate;
    this.touch();
  }

  updateVisibility(visibility: EventVisibility): void {
    this._visibility = visibility;
    this.touch();
  }

  updateInterests(interests: string[]): void {
    this._interests = [...interests];
    this.touch();
  }

  updateCoverImage(coverImageUrl: string): void {
    this._coverImageUrl = coverImageUrl;
    this.touch();
  }

  updateCapacity(capacity: EventCapacity): void {
    this._capacity = capacity;
    this.touch();
  }

  publish(): void {
    if (this._status !== 'draft') {
      throw new Error('Can only publish draft events');
    }
    this._status = 'published';
    this.touch();
  }

  cancel(): void {
    if (this._status === 'completed' || this._status === 'cancelled') {
      throw new Error('Cannot cancel completed or already cancelled events');
    }
    this._status = 'cancelled';
    this.touch();
  }

  archive(): void {
    this._status = 'archived';
    this.touch();
  }

  start(): void {
    if (this._status !== 'published') {
      throw new Error('Can only start published events');
    }
    if (!this.hasStarted) {
      throw new Error('Event has not started yet');
    }
    this._status = 'ongoing';
    this.touch();
  }

  finish(): void {
    if (this._status !== 'ongoing' && this._status !== 'published') {
      throw new Error('Can only finish ongoing or published events');
    }
    this._status = 'completed';
    this.touch();
  }

  duplicate(): Event {
    return Event.create({
      organizerId: this._organizerId,
      title: `${this._title} (Copy)`,
      description: this._description,
      coverImageUrl: this._coverImageUrl,
      location: this._location ? {
        coordinates: this._location.coordinates.toJSON(),
        address: this._location.address,
        city: this._location.city,
        placeId: this._location.placeId,
      } : undefined,
      startDate: this._startDate,
      endDate: this._endDate,
      capacity: this._capacity,
      isFree: this._isFree,
      price: this._price,
      visibility: this._visibility,
      interests: [...this._interests],
      parentEventId: this.id,
    });
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      organizerId: this._organizerId,
      title: this._title,
      description: this._description,
      coverImageUrl: this._coverImageUrl,
      location: this._location ? {
        ...this._location.coordinates.toJSON(),
        address: this._location.address,
        city: this._location.city,
        placeId: this._location.placeId,
      } : undefined,
      startDate: this._startDate.toISOString(),
      endDate: this._endDate.toISOString(),
      capacity: this._capacity?.toJSON(),
      isFree: this._isFree,
      price: this._price?.toJSON(),
      visibility: this._visibility,
      interests: [...this._interests],
      seriesId: this._seriesId,
      parentEventId: this._parentEventId,
      status: this._status,
    };
  }
}
