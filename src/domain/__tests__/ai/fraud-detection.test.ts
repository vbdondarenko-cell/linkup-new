import { RiskAssessmentEntity } from '../../ai/entities/risk-assessment';
import { FraudSignals, RiskLevel } from '../../ai/types';

describe('FraudDetection', () => {
  describe('RiskAssessmentEntity', () => {
    it('should create risk assessment with signals', () => {
      const signals: FraudSignals = {
        accountAge: 5,
        eventCreationRate: 8,
        joinRate: 30,
        messageRate: 50,
        reportRate: 0.1,
        locationChanges: 5,
        deviceCount: 2,
        ipVariety: 3,
        suspiciousPatterns: [],
      };

      const assessment = RiskAssessmentEntity.create({
        entityId: 'user_123',
        entityType: 'user',
        riskScore: 45,
        riskLevel: 'medium',
        signals,
        flags: [],
        recommendations: ['Monitor activity'],
        confidence: 0.85,
        createdAt: new Date(),
      });

      expect(assessment.entityId).toBe('user_123');
      expect(assessment.entityType).toBe('user');
      expect(assessment.riskScore).toBe(45);
      expect(assessment.riskLevel).toBe('medium');
    });

    it('should calculate correct risk level from score', () => {
      expect(RiskAssessmentEntity.calculateRiskLevel(85)).toBe('critical');
      expect(RiskAssessmentEntity.calculateRiskLevel(70)).toBe('high');
      expect(RiskAssessmentEntity.calculateRiskLevel(45)).toBe('medium');
      expect(RiskAssessmentEntity.calculateRiskLevel(15)).toBe('low');
    });

    it('should calculate risk score from signals', () => {
      const suspiciousSignals: FraudSignals = {
        accountAge: 2, // New account
        eventCreationRate: 15, // High
        joinRate: 60, // High
        messageRate: 120, // High
        reportRate: 0.5, // High
        locationChanges: 15,
        deviceCount: 8,
        ipVariety: 15,
        suspiciousPatterns: ['rapid_location_changes'],
      };

      const score = RiskAssessmentEntity.calculateRiskScore(suspiciousSignals);
      expect(score).toBeGreaterThan(60);
    });

    it('should add flags and update risk score', () => {
      const assessment = RiskAssessmentEntity.create({
        entityId: 'user_123',
        entityType: 'user',
        riskScore: 30,
        riskLevel: 'medium',
        signals: {
          accountAge: 30,
          eventCreationRate: 2,
          joinRate: 5,
          messageRate: 10,
          reportRate: 0,
          locationChanges: 2,
          deviceCount: 1,
          ipVariety: 2,
          suspiciousPatterns: [],
        },
        flags: [],
        recommendations: [],
        confidence: 0.8,
        createdAt: new Date(),
      });

      assessment.addFlag({
        type: 'fake_account',
        severity: 30,
        description: 'New account with suspicious behavior',
        evidence: { accountAge: 2 },
      });

      expect(assessment.riskScore).toBe(60);
      expect(assessment.riskLevel).toBe('high');
      expect(assessment.flags).toHaveLength(1);
    });

    it('should detect expired assessments', () => {
      const oldDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      
      const assessment = RiskAssessmentEntity.create({
        entityId: 'user_123',
        entityType: 'user',
        riskScore: 50,
        riskLevel: 'medium',
        signals: {
          accountAge: 30,
          eventCreationRate: 2,
          joinRate: 5,
          messageRate: 10,
          reportRate: 0,
          locationChanges: 2,
          deviceCount: 1,
          ipVariety: 2,
          suspiciousPatterns: [],
        },
        flags: [],
        recommendations: [],
        confidence: 0.8,
        createdAt: oldDate,
      });

      expect(assessment.isExpired).toBe(true);
    });
  });

  describe('FraudDetectionService', () => {
    it('should flag new accounts with high activity', async () => {
      // Mock repository
      const mockRepository = {
        findByEntityId: jest.fn().mockResolvedValue(null),
        findByEntityType: jest.fn().mockResolvedValue([]),
        save: jest.fn().mockResolvedValue(undefined),
        deleteByEntityId: jest.fn().mockResolvedValue(undefined),
      };

      // Service would be instantiated with repository
      // For unit testing, we test the signal calculation logic

      const suspiciousSignals: FraudSignals = {
        accountAge: 3, // Very new
        eventCreationRate: 12, // Very high
        joinRate: 80, // Very high
        messageRate: 150, // Very high
        reportRate: 0.8, // High
        locationChanges: 20,
        deviceCount: 10,
        ipVariety: 15,
        suspiciousPatterns: ['rapid_location_changes', 'brief_sessions_high_frequency'],
      };

      const score = RiskAssessmentEntity.calculateRiskScore(suspiciousSignals);
      
      expect(score).toBeGreaterThanOrEqual(60); // Should be flagged as high risk
    });

    it('should allow trusted accounts with normal activity', () => {
      const normalSignals: FraudSignals = {
        accountAge: 365, // 1 year old
        eventCreationRate: 0.5, // Low
        joinRate: 2, // Low
        messageRate: 5, // Low
        reportRate: 0, // No reports
        locationChanges: 2, // Normal
        deviceCount: 2, // Normal
        ipVariety: 3, // Normal
        suspiciousPatterns: [],
      };

      const score = RiskAssessmentEntity.calculateRiskScore(normalSignals);
      
      expect(score).toBeLessThan(30); // Should be low risk
    });
  });
});
