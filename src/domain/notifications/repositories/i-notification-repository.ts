import { EntityId } from '../../shared/types';
import { Notification } from '../entities/notification';

export interface INotificationRepository {
  findById(id: EntityId): Promise<Notification | null>;
  findByUserId(userId: EntityId): Promise<Notification[]>;
  findUnreadByUserId(userId: EntityId): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
  delete(id: EntityId): Promise<void>;
  markAsRead(id: EntityId): Promise<void>;
  markAllAsReadByUserId(userId: EntityId): Promise<void>;
  countUnreadByUserId(userId: EntityId): Promise<number>;
}
