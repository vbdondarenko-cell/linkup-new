import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export interface UserProps {
  telegramId?: string;
  firstName: string;
  lastName?: string;
  username?: string;
  isPremium: boolean;
  status: EntityStatus;
  createdAt?: Date;
}

export class User extends BaseEntity<EntityId> {
  private _telegramId?: string;
  private _firstName: string;
  private _lastName?: string;
  private _username?: string;
  private _isPremium: boolean;
  private _status: EntityStatus;

  constructor(props: UserProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._telegramId = props.telegramId;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._username = props.username;
    this._isPremium = props.isPremium;
    this._status = props.status;
  }

  static create(props: Omit<UserProps, 'status'>): User {
    return new User({
      ...props,
      status: 'active',
    });
  }

  get telegramId(): string | undefined {
    return this._telegramId;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string | undefined {
    return this._lastName;
  }

  get username(): string | undefined {
    return this._username;
  }

  get fullName(): string {
    return [this._firstName, this._lastName].filter(Boolean).join(' ');
  }

  get isPremium(): boolean {
    return this._isPremium;
  }

  get status(): EntityStatus {
    return this._status;
  }

  setPremium(isPremium: boolean): void {
    this._isPremium = isPremium;
    this.touch();
  }

  updateProfile(firstName: string, lastName?: string): void {
    this._firstName = firstName;
    this._lastName = lastName;
    this.touch();
  }

  archive(): void {
    this._status = 'archived';
    this.touch();
  }

  delete(): void {
    this._status = 'deleted';
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      telegramId: this._telegramId,
      firstName: this._firstName,
      lastName: this._lastName,
      username: this._username,
      fullName: this.fullName,
      isPremium: this._isPremium,
      status: this._status,
    };
  }
}
