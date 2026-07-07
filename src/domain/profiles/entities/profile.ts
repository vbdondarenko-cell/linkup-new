import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';
import { Coordinates, Location, Language, Radius } from '../value-objects';

export interface ProfileProps {
  userId: EntityId;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  language: Language;
  radius: Radius;
  location?: Location;
  interests: string[];
  isPublic: boolean;
  status: EntityStatus;
  createdAt?: Date;
}

export class Profile extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _username?: string;
  private _bio?: string;
  private _avatarUrl?: string;
  private _language: Language;
  private _radius: Radius;
  private _location?: Location;
  private _interests: string[];
  private _isPublic: boolean;
  private _status: EntityStatus;

  constructor(props: ProfileProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._username = props.username;
    this._bio = props.bio;
    this._avatarUrl = props.avatarUrl;
    this._language = props.language;
    this._radius = props.radius;
    this._location = props.location;
    this._interests = [...props.interests];
    this._isPublic = props.isPublic;
    this._status = props.status;
  }

  static create(props: Omit<ProfileProps, 'status'>): Profile {
    return new Profile({
      ...props,
      status: 'active',
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get username(): string | undefined {
    return this._username;
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  get language(): Language {
    return this._language;
  }

  get radius(): Radius {
    return this._radius;
  }

  get location(): Location | undefined {
    return this._location;
  }

  get interests(): string[] {
    return [...this._interests];
  }

  get isPublic(): boolean {
    return this._isPublic;
  }

  get status(): EntityStatus {
    return this._status;
  }

  updateUsername(username: string): void {
    this._username = username;
    this.touch();
  }

  updateBio(bio: string): void {
    this._bio = bio;
    this.touch();
  }

  updateAvatar(avatarUrl: string): void {
    this._avatarUrl = avatarUrl;
    this.touch();
  }

  changeLanguage(language: Language): void {
    this._language = language;
    this.touch();
  }

  changeRadius(radius: Radius): void {
    this._radius = radius;
    this.touch();
  }

  updateLocation(location: Location): void {
    this._location = location;
    this.touch();
  }

  addInterest(interestId: string): void {
    if (!this._interests.includes(interestId)) {
      this._interests.push(interestId);
      this.touch();
    }
  }

  removeInterest(interestId: string): void {
    this._interests = this._interests.filter(id => id !== interestId);
    this.touch();
  }

  setPublic(isPublic: boolean): void {
    this._isPublic = isPublic;
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
      userId: this._userId,
      username: this._username,
      bio: this._bio,
      avatarUrl: this._avatarUrl,
      language: this._language.value,
      radius: this._radius.value,
      location: this._location?.toJSON(),
      interests: [...this._interests],
      isPublic: this._isPublic,
      status: this._status,
    };
  }
}
