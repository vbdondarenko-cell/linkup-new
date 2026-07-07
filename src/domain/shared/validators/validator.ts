import { ValidationError } from '../errors/base';

export interface ValidationRule<T> {
  validate(value: T): boolean;
  message: string;
}

export class Validator<T> {
  private rules: Array<{ rule: ValidationRule<T>; field: string }> = [];

  addRule(field: string, rule: ValidationRule<T>): this {
    this.rules.push({ rule, field });
    return this;
  }

  validate(value: T): void {
    const errors: Array<{ field: string; message: string }> = [];

    for (const { rule, field } of this.rules) {
      if (!rule.validate(value)) {
        errors.push({ field, message: rule.message });
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', { errors });
    }
  }
}

export class StringValidator {
  static minLength(min: number, message?: string): ValidationRule<string> {
    return {
      validate: (value) => value.length >= min,
      message: message || `Minimum length is ${min}`,
    };
  }

  static maxLength(max: number, message?: string): ValidationRule<string> {
    return {
      validate: (value) => value.length <= max,
      message: message || `Maximum length is ${max}`,
    };
  }

  static notEmpty(message = 'Value cannot be empty'): ValidationRule<string> {
    return {
      validate: (value) => value.trim().length > 0,
      message,
    };
  }

  static pattern(regex: RegExp, message: string): ValidationRule<string> {
    return {
      validate: (value) => regex.test(value),
      message,
    };
  }
}

export class NumberValidator {
  static min(min: number, message?: string): ValidationRule<number> {
    return {
      validate: (value) => value >= min,
      message: message || `Minimum value is ${min}`,
    };
  }

  static max(max: number, message?: string): ValidationRule<number> {
    return {
      validate: (value) => value <= max,
      message: message || `Maximum value is ${max}`,
    };
  }

  static positive(message = 'Must be positive'): ValidationRule<number> {
    return {
      validate: (value) => value > 0,
      message,
    };
  }
}
