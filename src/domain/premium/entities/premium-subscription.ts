import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type PremiumTier = 'basic' | 'pro' | 'business';
export type SubscriptionPeriod = 'monthly' | 'yearly';

export interface PremiumSubscriptionProps {
  userId: EntityId;
  tier: PremiumTier;
  period: SubscriptionPeriod;
  startDate: Date;
  endDate: Date;
  isAutoRenew: boolean;
  status: EntityStatus;
  createdAt?: Date;
}

export class PremiumSubscription extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _tier: PremiumTier;
  private _period: SubscriptionPeriod;
  private _startDate: Date;
  private _endDate: Date;
  private _isAutoRenew: boolean;
  private _status: EntityStatus;

  constructor(props: PremiumSubscriptionProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._tier = props.tier;
    this._period = props.period;
    this._startDate = new Date(props.startDate);
    this._endDate = new Date(props.endDate);
    this._isAutoRenew = props.isAutoRenew;
    this._status = props.status;
  }

  static create(userId: EntityId, tier: PremiumTier, period: SubscriptionPeriod): PremiumSubscription {
    const now = new Date();
    const endDate = new Date(now);
    if (period === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    return new PremiumSubscription({
      id: `premium_${userId}_${Date.now()}`,
      userId,
      tier,
      period,
      startDate: now,
      endDate,
      isAutoRenew: true,
      status: 'active',
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get tier(): PremiumTier {
    return this._tier;
  }

  get period(): SubscriptionPeriod {
    return this._period;
  }

  get startDate(): Date {
    return new Date(this._startDate);
  }

  get endDate(): Date {
    return new Date(this._endDate);
  }

  get isAutoRenew(): boolean {
    return this._isAutoRenew;
  }

  get status(): EntityStatus {
    return this._status;
  }

  get isActive(): boolean {
    return this._status === 'active' && new Date() < this._endDate;
  }

  get isExpired(): boolean {
    return new Date() >= this._endDate;
  }

  get daysRemaining(): number {
    const now = new Date();
    const diff = this._endDate.getTime() - now.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  getTierPermissions(): string[] {
    switch (this._tier) {
      case 'basic':
        return ['events.create_limit_10', 'analytics.basic'];
      case 'pro':
        return ['events.create_limit_50', 'analytics.basic', 'badges.featured', 'premium.badge'];
      case 'business':
        return ['events.create_unlimited', 'analytics.full', 'badges.featured', 'premium.badge', 'business.verified'];
      default:
        return [];
    }
  }

  renew(period: SubscriptionPeriod): void {
    if (!this.isActive) {
      throw new Error('Cannot renew inactive subscription');
    }
    const newEndDate = new Date(this._endDate);
    if (period === 'monthly') {
      newEndDate.setMonth(newEndDate.getMonth() + 1);
    } else {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
    }
    this._endDate = newEndDate;
    this._period = period;
    this.touch();
  }

  cancel(): void {
    this._isAutoRenew = false;
    this.touch();
  }

  expire(): void {
    this._status = 'inactive';
    this.touch();
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      tier: this._tier,
      period: this._period,
      startDate: this._startDate.toISOString(),
      endDate: this._endDate.toISOString(),
      isAutoRenew: this._isAutoRenew,
      status: this._status,
      isActive: this.isActive,
      daysRemaining: this.daysRemaining,
    };
  }
}