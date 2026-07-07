export interface ActivatePremiumRequest {
  userId: string;
  tier: 'basic' | 'pro' | 'business';
  period: 'monthly' | 'yearly';
}

export interface PremiumResponse {
  id: string;
  userId: string;
  tier: string;
  period: string;
  startDate: string;
  endDate: string;
  isAutoRenew: boolean;
  isActive: boolean;
  daysRemaining: number;
}
