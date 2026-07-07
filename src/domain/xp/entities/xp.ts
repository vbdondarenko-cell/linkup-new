import { BaseEntity } from '../../shared/entities/base-entity';
import { EntityId, EntityStatus } from '../../shared/types';

export type XPAction = 
  | 'event_join'
  | 'event_create'
  | 'event_attend'
  | 'profile_complete'
  | 'referral'
  | 'streak'
  | 'badge_earned'
  | 'premium_purchase'
  | 'report_submit';

export interface XPRecordProps {
  userId: EntityId;
  action: XPAction;
  amount: number;
  description: string;
  eventId?: EntityId;
  createdAt?: Date;
}

export class XPRecord extends BaseEntity<EntityId> {
  private _userId: EntityId;
  private _action: XPAction;
  private _amount: number;
  private _description: string;
  private _eventId?: EntityId;

  constructor(props: XPRecordProps & { id: EntityId }) {
    super(props.id, props.createdAt);
    this._userId = props.userId;
    this._action = props.action;
    this._amount = props.amount;
    this._description = props.description;
    this._eventId = props.eventId;
  }

  static create(props: Omit<XPRecordProps, 'id' | 'createdAt'>): XPRecord {
    return new XPRecord({
      id: `xp_${props.userId}_${Date.now()}`,
      ...props,
    });
  }

  get userId(): EntityId {
    return this._userId;
  }

  get action(): XPAction {
    return this._action;
  }

  get amount(): number {
    return this._amount;
  }

  get description(): string {
    return this._description;
  }

  get eventId(): string | undefined {
    return this._eventId;
  }

  toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      userId: this._userId,
      action: this._action,
      amount: this._amount,
      description: this._description,
      eventId: this._eventId,
    };
  }
}

export const XP_VALUES: Record<XPAction, number> = {
  event_join: 10,
  event_create: 50,
  event_attend: 100,
  profile_complete: 25,
  referral: 200,
  streak: 50,
  badge_earned: 100,
  premium_purchase: 0,
  report_submit: 25,
};