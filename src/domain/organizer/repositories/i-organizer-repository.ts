import { EntityId, PaginationParams } from '../../shared/types';
import { Organizer, OrganizerStatus } from '../entities/organizer';
import { EventTemplate } from '../entities/event-template';

export interface IOrganizerRepository {
  findById(id: EntityId): Promise<Organizer | null>;
  findByUserId(userId: EntityId): Promise<Organizer | null>;
  findActive(pagination: PaginationParams): Promise<Organizer[]>;
  findFeatured(pagination: PaginationParams): Promise<Organizer[]>;
  findByStatus(status: OrganizerStatus, pagination: PaginationParams): Promise<Organizer[]>;
  save(organizer: Organizer): Promise<void>;
  delete(id: EntityId): Promise<void>;
}

export interface ITemplateRepository {
  findById(id: EntityId): Promise<EventTemplate | null>;
  findByOrganizerId(organizerId: EntityId): Promise<EventTemplate[]>;
  findPopular(pagination: PaginationParams): Promise<EventTemplate[]>;
  save(template: EventTemplate): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
