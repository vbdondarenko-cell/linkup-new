import { EntityId } from '../../shared/types';
import { User } from '../entities/user';

export interface IUserRepository {
  findById(id: EntityId): Promise<User | null>;
  findByTelegramId(telegramId: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: EntityId): Promise<void>;
}
