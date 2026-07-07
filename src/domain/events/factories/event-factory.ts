import { Event } from '../entities/event';
import { EntityId } from '../../shared/types';
import { EventCapacity } from '../value-objects/event-capacity';
import { Money } from '../value-objects/money';
import { Coordinates } from '../../profiles/value-objects/coordinates';

export interface CreateEventParams {
  organizerId: EntityId;
  title: string;
  description: string;
  coverImageUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    placeId?: string;
  };
  startDate: Date;
  endDate: Date;
  maxCapacity?: number;
  isFree?: boolean;
  price?: { amount: number; currency: string };
  visibility?: 'public' | 'private' | 'followers';
  interests?: string[];
  seriesId?: EntityId;
}

export class EventFactory {
  static create(params: CreateEventParams): Event {
    const startDate = new Date(params.startDate);
    const endDate = new Date(params.endDate);

    let capacity: EventCapacity | undefined;
    if (params.maxCapacity !== undefined) {
      capacity = EventCapacity.create(1, params.maxCapacity);
    }

    let price: Money | undefined;
    if (!params.isFree && params.price) {
      price = Money.create(params.price.amount, params.price.currency);
    }

    return Event.create({
      organizerId: params.organizerId,
      title: params.title,
      description: params.description,
      coverImageUrl: params.coverImageUrl,
      location: params.location ? {
        coordinates: { latitude: params.location.latitude, longitude: params.location.longitude },
        address: params.location.address,
        city: params.location.city,
        placeId: params.location.placeId,
      } : undefined,
      startDate,
      endDate,
      capacity,
      isFree: params.isFree ?? true,
      price,
      visibility: params.visibility ?? 'public',
      interests: params.interests ?? [],
      seriesId: params.seriesId,
    });
  }

  static createFromTemplate(
    params: Omit<CreateEventParams, 'startDate' | 'endDate'>,
    template: {
      title: string;
      description: string;
      coverImageUrl?: string;
      location?: CreateEventParams['location'];
      maxCapacity?: number;
      isFree?: boolean;
      price?: CreateEventParams['price'];
      visibility?: CreateEventParams['visibility'];
      interests?: string[];
    }
  ): Event {
    return EventFactory.create({
      ...params,
      title: template.title,
      description: template.description,
      coverImageUrl: template.coverImageUrl,
      location: template.location,
      maxCapacity: template.maxCapacity,
      isFree: template.isFree,
      price: template.price,
      visibility: template.visibility,
      interests: template.interests,
    });
  }
}
