import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, Timestamp } from '../../shared/types';

import type { NotificationType } from '../../../shared/types/enums';
export type { NotificationType };

export interface NotificationProps {
  userId: EntityId;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  isPushEnabled: boolean;
  isEmailEnabled: boolean;
  readAt?: Timestamp;
}

export class Notification extends BaseEntity<EntityId> {
  private readonly _userId: EntityId;
  private _type: NotificationType;
  private readonly _title: string;
  private readonly _message: string;
  private readonly _data?: Record<string, unknown>;
  private _isRead: boolean;
  private readonly _isPushEnabled: boolean;
  private readonly _isEmailEnabled: boolean;
  private _readAt?: Timestamp;

  constructor(props: NotificationProps & { id: EntityId; createdAt?: Timestamp }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._type = props.type;
    this._title = props.title;
    this._message = props.message;
    this._data = props.data;
    this._isRead = props.isRead;
    this._isPushEnabled = props.isPushEnabled;
    this._isEmailEnabled = props.isEmailEnabled;
    this._readAt = props.readAt;
  }

  static create(props: Omit<NotificationProps, 'createdAt'>): Notification {
    return new Notification({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    });
  }

  markAsRead(): void {
    this._isRead = true;
    this._readAt = new Date();
    this.touch();
  }

  markAsUnread(): void {
    this._isRead = false;
    this._readAt = undefined;
    this.touch();
  }

  get userId(): EntityId {
    return this._userId;
  }

  get type(): NotificationType {
    return this._type;
  }

  get title(): string {
    return this._title;
  }

  get message(): string {
    return this._message;
  }

  get data(): Record<string, unknown> | undefined {
    return this._data;
  }

  get isRead(): boolean {
    return this._isRead;
  }

  get isPushEnabled(): boolean {
    return this._isPushEnabled;
  }

  get isEmailEnabled(): boolean {
    return this._isEmailEnabled;
  }

  get readAt(): Timestamp | undefined {
    return this._readAt;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      type: this._type,
      title: this._title,
      message: this._message,
      data: this._data,
      isRead: this._isRead,
      isPushEnabled: this._isPushEnabled,
      isEmailEnabled: this._isEmailEnabled,
      readAt: this._readAt?.toISOString(),
    };
  }
}
