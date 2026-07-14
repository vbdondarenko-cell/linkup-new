import { EntityId, Timestamp } from '../../shared/types';

export type ParticipantRole = 'organizer' | 'co-host' | 'attendee';
export type ParticipantStatus = 'pending' | 'confirmed' | 'waitlisted' | 'cancelled' | 'attended' | 'no-show';

export class Participant {
  private readonly _id: EntityId;
  private readonly _eventId: EntityId;
  private readonly _userId: EntityId;
  private readonly _role: ParticipantRole;
  private _status: ParticipantStatus;
  private readonly _registeredAt: Timestamp;
  private _checkedInAt: Timestamp | null;
  private _rsvpResponse: boolean | null;

  constructor(params: {
    id: EntityId;
    eventId: EntityId;
    userId: EntityId;
    role: ParticipantRole;
    status: ParticipantStatus;
    registeredAt: Timestamp;
    checkedInAt?: Timestamp;
    rsvpResponse?: boolean;
  }) {
    this._id = params.id;
    this._eventId = params.eventId;
    this._userId = params.userId;
    this._role = params.role;
    this._status = params.status;
    this._registeredAt = params.registeredAt;
    this._checkedInAt = params.checkedInAt || null;
    this._rsvpResponse = params.rsvpResponse || null;
  }

  static create(eventId: EntityId, userId: EntityId, role: ParticipantRole = 'attendee'): Participant {
    return new Participant({
      id: crypto.randomUUID(),
      eventId,
      userId,
      role,
      status: 'pending',
      registeredAt: new Date(),
    });
  }

  confirm(): void {
    this._status = 'confirmed';
  }

  cancel(): void {
    this._status = 'cancelled';
  }

  checkIn(): void {
    this._status = 'attended';
    this._checkedInAt = new Date();
  }

  addToWaitlist(): void {
    this._status = 'waitlisted';
  }

  get id(): EntityId { return this._id; }
  get eventId(): EntityId { return this._eventId; }
  get userId(): EntityId { return this._userId; }
  get role(): ParticipantRole { return this._role; }
  get status(): ParticipantStatus { return this._status; }
  get registeredAt(): Timestamp { return this._registeredAt; }
  get checkedInAt(): Timestamp | null { return this._checkedInAt; }
  get rsvpResponse(): boolean | null { return this._rsvpResponse; }
  get isOrganizer(): boolean { return this._role === 'organizer'; }
  get joinedAt(): Timestamp { return this._registeredAt; }
}
