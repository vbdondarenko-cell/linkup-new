import { EntityId } from '../../shared/types';
import { Session } from '../entities/session';

export interface ISessionRepository {
  findById(id: EntityId): Promise<Session | null>;
  findByUserId(userId: EntityId): Promise<Session[]>;
  findByRefreshToken(token: string): Promise<Session | null>;
  findByTelegramId(telegramId: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  delete(id: EntityId): Promise<void>;
  deleteByUserId(userId: EntityId): Promise<void>;
}
