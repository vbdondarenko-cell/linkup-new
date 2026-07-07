import { TrackEventRequest } from '../dto/analytics.dto';
import { AnalyticsService } from '../../../domain/analytics/services/analytics-service';

export class TrackEventHandler {
  constructor(private readonly analyticsRepository?: any) {}

  async handle(request: TrackEventRequest): Promise<void> {
    const analyticsService = new AnalyticsService();
    const event = analyticsService.trackEvent({
      type: request.type as any,
      userId: request.userId,
      sessionId: request.sessionId,
      targetId: request.targetId,
      targetType: request.targetType,
      properties: request.properties,
    });

    if (this.analyticsRepository) {
      await this.analyticsRepository.saveEvent(event);
    }
  }
}
