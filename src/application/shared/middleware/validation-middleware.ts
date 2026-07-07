import { ValidationApplicationError } from '../errors/application-errors';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'array' | 'object';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
  message?: string;
}

export class ValidationMiddleware {
  validate(rules: ValidationRule[], data: Record<string, unknown>): void {
    const errors: Array<{ field: string; message: string }> = [];

    for (const rule of rules) {
      const value = data[rule.field];

      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is required`,
        });
        continue;
      }

      if (value === undefined || value === null) {
        continue;
      }

      if (rule.type && typeof value !== rule.type) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} must be of type ${rule.type}`,
        });
        continue;
      }

      if (rule.type === 'string') {
        const strValue = value as string;
        if (rule.minLength && strValue.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.minLength} characters`,
          });
        }
        if (rule.maxLength && strValue.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at most ${rule.maxLength} characters`,
          });
        }
        if (rule.pattern && !rule.pattern.test(strValue)) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} has invalid format`,
          });
        }
      }

      if (rule.type === 'number') {
        const numValue = value as number;
        if (rule.min !== undefined && numValue < rule.min) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at least ${rule.min}`,
          });
        }
        if (rule.max !== undefined && numValue > rule.max) {
          errors.push({
            field: rule.field,
            message: rule.message || `${rule.field} must be at most ${rule.max}`,
          });
        }
      }

      if (rule.custom && !rule.custom(value)) {
        errors.push({
          field: rule.field,
          message: rule.message || `${rule.field} is invalid`,
        });
      }
    }

    if (errors.length > 0) {
      throw new ValidationApplicationError('Validation failed', { errors });
    }
  }
}
