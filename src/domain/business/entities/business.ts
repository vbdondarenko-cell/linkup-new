import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type BusinessVerificationStatus = 'pending' | 'verified' | 'rejected' | 'expired';

export interface BusinessProps {
  ownerId: EntityId;
  name: string;
  description: string;
  logoUrl?: string;
  coverImageUrl?: string;
  website?: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    country: string;
    postalCode?: string;
    coordinates?: { latitude: number; longitude: number };
  };
  categoryId?: string;
  verificationStatus: BusinessVerificationStatus;
  verificationDocuments?: string[];
  verifiedAt?: Date;
  isActive: boolean;
  status: EntityStatus;
  createdAt?: Date;
}

export class Business extends BaseEntity<EntityId> {
  private _ownerId: EntityId;
  private _name: string;
  private _description: string;
  private _logoUrl?: string;
  private _coverImageUrl?: string;
  private _website?: string;
  private _email: string;
  private _phone?: string;
  private _address?: BusinessProps['address'];
  private _categoryId?: string;
  private _verificationStatus: BusinessVerificationStatus;
  private _verificationDocuments?: string[];
  private _verifiedAt?: Date;
  private _isActive: boolean;
  private _status: EntityStatus;

  constructor(props: BusinessProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._ownerId = props.ownerId;
    this._name = props.name;
    this._description = props.description;
    this._logoUrl = props.logoUrl;
    this._coverImageUrl = props.coverImageUrl;
    this._website = props.website;
    this._email = props.email;
    this._phone = props.phone;
    this._address = props.address;
    this._categoryId = props.categoryId;
    this._verificationStatus = props.verificationStatus;
    this._verificationDocuments = props.verificationDocuments;
    this._verifiedAt = props.verifiedAt;
    this._isActive = props.isActive;
    this._status = props.status;
  }

  static create(params: Omit<BusinessProps, 'status'>): Business {
    return new Business({
      ...params,
      id: `business_${params.ownerId}_${Date.now()}`,
      status: 'active',
    });
  }

  get ownerId(): EntityId {
    return this._ownerId;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get logoUrl(): string | undefined {
    return this._logoUrl;
  }

  get coverImageUrl(): string | undefined {
    return this._coverImageUrl;
  }

  get website(): string | undefined {
    return this._website;
  }

  get email(): string {
    return this._email;
  }

  get phone(): string | undefined {
    return this._phone;
  }

  get address(): typeof this._address {
    return this._address ? { ...this._address } : undefined;
  }

  get categoryId(): string | undefined {
    return this._categoryId;
  }

  get verificationStatus(): BusinessVerificationStatus {
    return this._verificationStatus;
  }

  get verificationDocuments(): string[] | undefined {
    return this._verificationDocuments ? [...this._verificationDocuments] : undefined;
  }

  get verifiedAt(): Date | undefined {
    return this._verifiedAt ? new Date(this._verifiedAt) : undefined;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get status(): EntityStatus {
    return this._status;
  }

  get isVerified(): boolean {
    return this._verificationStatus === 'verified';
  }

  updateDetails(details: { name?: string; description?: string; website?: string; phone?: string }): void {
    if (details.name) this._name = details.name;
    if (details.description) this._description = details.description;
    if (details.website !== undefined) this._website = details.website;
    if (details.phone !== undefined) this._phone = details.phone;
    this.touch();
  }

  submitForVerification(documents: string[]): void {
    if (this._verificationStatus === 'verified') {
      throw new Error('Business is already verified');
    }
    this._verificationDocuments = documents;
    this._verificationStatus = 'pending';
    this.touch();
  }

  verify(): void {
    this._verificationStatus = 'verified';
    this._verifiedAt = new Date();
    this.touch();
  }

  reject(reason: string): void {
    this._verificationStatus = 'rejected';
    this._verificationDocuments = undefined;
    this.touch();
  }

  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    this._isActive = true;
    this.touch();
  }

  archive(): void {
    this._status = 'archived';
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      ownerId: this._ownerId,
      name: this._name,
      description: this._description,
      logoUrl: this._logoUrl,
      coverImageUrl: this._coverImageUrl,
      website: this._website,
      email: this._email,
      phone: this._phone,
      address: this._address,
      categoryId: this._categoryId,
      verificationStatus: this._verificationStatus,
      verificationDocuments: this._verificationDocuments,
      verifiedAt: this._verifiedAt?.toISOString(),
      isActive: this._isActive,
      status: this._status,
      isVerified: this.isVerified,
    };
  }
}
