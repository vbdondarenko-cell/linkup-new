import { EntityId, PaginationParams, DateRange } from '../../shared/types';
import { Event } from '../entities/event';

export interface EventSearchFilters {
  organizerId?: EntityId;
  status?: Event['status'][];
  visibility?: Event['visibility'][];
  interests?: string[];
  dateRange?: DateRange;
  location?: {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };
  isFree?: boolean;
  seriesId?: EntityId;
}

export interface IEventRepository {
  findById(id: EntityId): Promise<Event | null>;
  findByOrganizer(organizerId: EntityId, pagination: PaginationParams): Promise<Event[]>;
  findBySeries(seriesId: EntityId): Promise<Event[]>;
  findByDateRange(dateRange: DateRange, pagination: PaginationParams): Promise<Event[]>;
  findNearby(
    latitude: number,
    longitude: number,
    radiusKm: number,
    pagination: PaginationParams
  ): Promise<Event[]>;
  search(filters: EventSearchFilters, pagination: PaginationParams): Promise<Event[]>;
  findUpcoming(pagination: PaginationParams): Promise<Event[]>;
  findPopular(pagination: PaginationParams): Promise<Event[]>;
  save(event: Event): Promise<void>;
  delete(id: EntityId): Promise<void>;
  countByOrganizer(organizerId: EntityId): Promise<number>;
}
