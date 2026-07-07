import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type BadgeType = 
  | 'first_event'
  | 'event_organizer'
  | 'social_butterfly'
  | 'consistent'
  | 'premium_member'
  | 'verified_business'
  | 'top_rated'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'event_master'
  | 'community_pillar'
  | 'early_adopter'
  | 'featured_creator';

export interface BadgeDefinition {
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  criteria: string;
}

export interface UserBadgeProps {
  userId: EntityId;
  badgeType: BadgeType;
  earnedAt: Date;
  displayName?: string;
  status: EntityStatus;
  createdAt?: Date;
}

export class UserBadge extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _badgeType: BadgeType;
  private _earnedAt: Date;
  private _displayName?: string;
  private _status: EntityStatus;

  constructor(props: UserBadgeProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._badgeType = props.badgeType;
    this._earnedAt = new Date(props.earnedAt);
    this._displayName = props.displayName;
    this._status = props.status;
  }

  static create(userId: EntityId, badgeType: BadgeType, displayName?: string): UserBadge {
    return new UserBadge({
      id: `badge_${userId}_${badgeType}`,
      userId,
      badgeType,
      earnedAt: new Date(),
      displayName,
      status: 'active',
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get badgeType(): BadgeType {
    return this._badgeType;
  }

  get earnedAt(): Date {
    return new Date(this._earnedAt);
  }

  get displayName(): string | undefined {
    return this._displayName;
  }

  get status(): EntityStatus {
    return this._status;
  }

  revoke(): void {
    this._status = 'deleted';
    this.touch();
  }

  getDefinition(): BadgeDefinition | undefined {
    return BADGE_DEFINITIONS.find(d => d.type === this._badgeType);
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      badgeType: this._badgeType,
      earnedAt: this._earnedAt.toISOString(),
      displayName: this._displayName,
      status: this._status,
      definition: this.getDefinition(),
    };
  }
}

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  { type: 'first_event', name: 'First Step', description: 'Created your first event', icon: '🌟', tier: 'bronze', criteria: 'Create 1 event' },
  { type: 'event_organizer', name: 'Organizer', description: 'Created 10 events', icon: '🎯', tier: 'silver', criteria: 'Create 10 events' },
  { type: 'social_butterfly', name: 'Social Butterfly', description: 'Joined 20 events', icon: '🦋', tier: 'bronze', criteria: 'Join 20 events' },
  { type: 'consistent', name: 'Consistent', description: 'Attended events 5 times in a row', icon: '📅', tier: 'silver', criteria: 'Attend 5 events consecutively' },
  { type: 'premium_member', name: 'Premium Member', description: 'Subscribed to premium', icon: '💎', tier: 'gold', criteria: 'Purchase premium subscription' },
  { type: 'verified_business', name: 'Verified Business', description: 'Business account verified', icon: '✓', tier: 'gold', criteria: 'Complete business verification' },
  { type: 'top_rated', name: 'Top Rated', description: 'Rated 4.5+ stars on average', icon: '⭐', tier: 'gold', criteria: 'Average rating of 4.5 or higher' },
  { type: 'streak_7', name: 'Week Warrior', description: '7-day activity streak', icon: '🔥', tier: 'bronze', criteria: '7 consecutive days active' },
  { type: 'streak_30', name: 'Month Master', description: '30-day activity streak', icon: '🔥', tier: 'silver', criteria: '30 consecutive days active' },
  { type: 'streak_100', name: 'Century Champion', description: '100-day activity streak', icon: '🔥', tier: 'platinum', criteria: '100 consecutive days active' },
  { type: 'event_master', name: 'Event Master', description: 'Created 100 events', icon: '👑', tier: 'platinum', criteria: 'Create 100 events' },
  { type: 'community_pillar', name: 'Community Pillar', description: 'Referred 10 users', icon: '🏛️', tier: 'gold', criteria: 'Refer 10 users' },
  { type: 'early_adopter', name: 'Early Adopter', description: 'Joined during beta', icon: '🚀', tier: 'gold', criteria: 'Register during beta period' },
  { type: 'featured_creator', name: 'Featured Creator', description: 'Featured event creator', icon: '✨', tier: 'silver', criteria: 'Have an event featured' },
];