import { EntityId } from '../../shared/types';
import { ReportEntity } from '../../domain/ai/entities/report';
import { ReportDTO, CreateReportDTO } from '../dto/ai.dto';
import { ReportReason, ReportTarget } from '../../domain/ai/types';

export class ReportHandler {
  async createReport(data: CreateReportDTO, reporterId: EntityId): Promise<ReportEntity> {
    const report = ReportEntity.create({
      reporterId,
      targetId: data.targetId,
      targetType: data.targetType,
      reason: data.reason,
      description: data.description,
      evidence: data.evidence,
    });

    // In real implementation, save to repository
    return report;
  }

  async analyzeReport(report: ReportEntity): Promise<void> {
    // AI analysis of the report
    const sentiment = this.calculateSentiment(report.description || '');
    const urgency = this.calculateUrgency(report.reason, report.description);
    const confidence = 0.85;

    // Count similar reports
    const similarReports = await this.countSimilarReports(report);

    report.setAIAnalysis({
      sentiment,
      urgency,
      confidence,
      similarReports,
      recommendedAction: this.determineRecommendedAction(urgency, report.reason),
    });
  }

  private calculateSentiment(description?: string): number {
    if (!description) return 0.5;

    const positiveWords = ['great', 'good', 'excellent', 'amazing', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'dangerous'];

    const words = description.toLowerCase().split(/\s+/);
    let score = 0.5;

    for (const word of words) {
      if (positiveWords.includes(word)) score += 0.1;
      if (negativeWords.includes(word)) score -= 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  private calculateUrgency(reason: ReportReason, description?: string): number {
    let urgency = 0.5;

    // High urgency reasons
    if (reason === 'dangerous' || reason === 'scam') {
      urgency = 0.9;
    } else if (reason === 'harassment') {
      urgency = 0.7;
    } else if (reason === 'fake') {
      urgency = 0.5;
    }

    // Check description for urgency indicators
    if (description) {
      const urgentKeywords = ['immediately', 'urgent', 'now', 'help', 'danger'];
      const hasUrgent = urgentKeywords.some(k => description.toLowerCase().includes(k));
      if (hasUrgent) urgency = Math.min(1, urgency + 0.2);
    }

    return urgency;
  }

  private async countSimilarReports(_report: ReportEntity): Promise<number> {
    // Would query database for similar reports
    return 0;
  }

  private determineRecommendedAction(urgency: number, reason: ReportReason): string {
    if (urgency >= 0.8 || reason === 'dangerous') {
      return 'escalate';
    }
    if (urgency >= 0.5) {
      return 'review';
    }
    return 'monitor';
  }

  toDTO(report: ReportEntity): ReportDTO {
    return {
      id: report.id,
      reporterId: report.reporterId,
      targetId: report.targetId,
      targetType: report.targetType,
      reason: report.reason,
      description: report.description,
      evidence: report.evidence,
      priority: report.priority,
      status: report.status,
      aiAnalysis: report.aiAnalysis,
      createdAt: report.createdAt.toISOString(),
    };
  }
}
