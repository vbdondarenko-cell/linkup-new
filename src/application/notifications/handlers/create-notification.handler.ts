import { CreateNotificationRequest } from '../dto/notification.dto';
import { Notification } from '../../../domain/notifications/entities/notification';
import { INotificationRepository } from '../../../domain/notifications/repositories/i-notification-repository';
import { IEventDispatcher } from '../../shared/dispatcher/event-dispatcher';
import { NotificationCreated } from '../../../domain/shared/events/domain-events';
import { Result } from '../../../domain/shared/types';

export class CreateNotificationHandler {
  constructor(
    private readonly notificationRepository: INotificationRepository,
    private readonly eventDispatcher: IEventDispatcher
  ) {}

  async handle(request: CreateNotificationRequest): Promise<Result<NotificationResponse>> {
    const notification = Notification.create({
      userId: request.userId,
      type: request.type as any,
      title: request.title,
      message: request.message,
      data: request.data,
      isRead: false,
      isPushEnabled: true,
      isEmailEnabled: false,
    });

    await this.notificationRepository.save(notification);

    // Dispatch domain event
    await this.eventDispatcher.dispatch(new NotificationCreated(notification.id, notification.userId));

    return {
      success: true,
      data: {
        id: notification.id,
        userId: notification.userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt.toISOString(),
      },
    };
  }
}
