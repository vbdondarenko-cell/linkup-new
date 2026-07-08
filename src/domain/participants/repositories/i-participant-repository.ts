import { EntityId } from '../../shared/types';
import { Participant, ParticipantStatus } from '../entities/participant';

export interface IParticipantRepository {
  findById(id: EntityId): Promise<Participant | null>;
  findByEventId(eventId: EntityId): Promise<Participant[]>;
  findByUserId(userId: EntityId): Promise<Participant[]>;
  findByEventAndUser(eventId: EntityId, userId: EntityId): Promise<Participant | null>;
  findByStatus(eventId: EntityId, status: ParticipantStatus): Promise<Participant[]>;
  save(participant: Participant): Promise<void>;
  delete(id: EntityId): Promise<void>;
  countByEventId(eventId: EntityId): Promise<number>;
  countByStatus(eventId: EntityId, status: ParticipantStatus): Promise<number>;
}
