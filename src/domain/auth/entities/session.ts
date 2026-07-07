import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export interface SessionProps {
  userId: EntityId;
  telegramId?: string;
  refreshToken: string;
  expiresAt: Date;
  status: EntityStatus;
  createdAt?: Date;
}

export class Session extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _telegramId?: string;
  private _refreshToken: string;
  private _expiresAt: Date;
  private _status: EntityStatus;

  constructor(props: SessionProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._telegramId = props.telegramId;
    this._refreshToken = props.refreshToken;
    this._expiresAt = props.expiresAt;
    this._status = props.status;
  }

  get userId(): EntityId {
    return this._userId;
  }

  get telegramId(): string | undefined {
    return this._telegramId;
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  get expiresAt(): Date {
    return new Date(this._expiresAt);
  }

  get status(): EntityStatus {
    return this._status;
  }

  get isExpired(): boolean {
    return new Date() > this._expiresAt;
  }

  get isValid(): boolean {
    return !this.isExpired && this._status === 'active';
  }

  revoke(): void {
    this._status = 'deleted';
    this.touch();
  }

  refresh(expiresAt: Date, refreshToken: string): void {
    this._expiresAt = expiresAt;
    this._refreshToken = refreshToken;
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      telegramId: this._telegramId,
      expiresAt: this._expiresAt.toISOString(),
      status: this._status,
    };
  }
}
