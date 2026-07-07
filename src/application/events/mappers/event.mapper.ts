import { Event } from '../../../domain/events/entities/event';
import { CreateEventRequest, UpdateEventRequest, EventResponse } from '../dto/event.dto';

export class EventMapper {
  static toDTO(event: Event, participantCount: number = 0): EventResponse {
    return {
      id: event.id,
      organizerId: event.organizerId,
      title: event.title,
      description: event.description,
      coverImageUrl: event.coverImageUrl,
      location: event.location ? {
        latitude: event.location.coordinates.latitude,
        longitude: event.location.coordinates.longitude,
        address: event.location.address,
        city: event.location.city,
        placeId: event.location.placeId,
      } : undefined,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      capacity: event.capacity?.toJSON(),
      isFree: event.isFree,
      price: event.price?.toJSON(),
      visibility: event.visibility,
      interests: event.interests,
      seriesId: event.seriesId,
      status: event.status,
      participantCount,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }

  static toDTOList(events: Event[], participantCounts: Map<string, number> = new Map()): EventResponse[] {
    return events.map(e => EventMapper.toDTO(e, participantCounts.get(e.id) || 0));
  }

  static toDomainCreate(request: CreateEventRequest): {
    organizerId: string;
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
    seriesId?: string;
  } {
    return {
      organizerId: request.organizerId,
      title: request.title,
      description: request.description,
      coverImageUrl: request.coverImageUrl,
      location: request.location,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      maxCapacity: request.maxCapacity,
      isFree: request.isFree,
      price: request.price,
      visibility: request.visibility,
      interests: request.interests,
      seriesId: request.seriesId,
    };
  }

  static toDomainUpdate(request: UpdateEventRequest): {
    eventId: string;
    title?: string;
    description?: string;
    coverImageUrl?: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
      city?: string;
      placeId?: string;
    };
    startDate?: Date;
    endDate?: Date;
    maxCapacity?: number;
    isFree?: boolean;
    price?: { amount: number; currency: string };
    visibility?: 'public' | 'private' | 'followers';
    interests?: string[];
  } {
    return {
      eventId: request.eventId,
      title: request.title,
      description: request.description,
      coverImageUrl: request.coverImageUrl,
      location: request.location,
      startDate: request.startDate ? new Date(request.startDate) : undefined,
      endDate: request.endDate ? new Date(request.endDate) : undefined,
      maxCapacity: request.maxCapacity,
      isFree: request.isFree,
      price: request.price,
      visibility: request.visibility,
      interests: request.interests,
    };
  }
}
