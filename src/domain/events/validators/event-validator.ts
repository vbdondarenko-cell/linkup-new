import { ValidationError } from '../../shared/errors/base';

export interface EventValidationInput {
  title?: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  capacityMin?: number;
  capacityMax?: number;
  latitude?: number;
  longitude?: number;
  interests?: string[];
}

export class EventValidator {
  static readonly TITLE_MIN_LENGTH = 3;
  static readonly TITLE_MAX_LENGTH = 100;
  static readonly DESCRIPTION_MIN_LENGTH = 10;
  static readonly DESCRIPTION_MAX_LENGTH = 5000;
  static readonly MAX_INTERESTS = 10;
  static readonly MIN_FUTURE_HOURS = 1;
  static readonly MAX_FUTURE_DAYS = 365;

  static validateTitle(title: string): void {
    if (!title || title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    if (title.length < EventValidator.TITLE_MIN_LENGTH) {
      throw new ValidationError(`Title must be at least ${EventValidator.TITLE_MIN_LENGTH} characters`);
    }
    if (title.length > EventValidator.TITLE_MAX_LENGTH) {
      throw new ValidationError(`Title cannot exceed ${EventValidator.TITLE_MAX_LENGTH} characters`);
    }
  }

  static validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new ValidationError('Description is required');
    }
    if (description.length < EventValidator.DESCRIPTION_MIN_LENGTH) {
      throw new ValidationError(`Description must be at least ${EventValidator.DESCRIPTION_MIN_LENGTH} characters`);
    }
    if (description.length > EventValidator.DESCRIPTION_MAX_LENGTH) {
      throw new ValidationError(`Description cannot exceed ${EventValidator.DESCRIPTION_MAX_LENGTH} characters`);
    }
  }

  static validateDates(startDate: Date, endDate: Date): void {
    if (!startDate || !endDate) {
      throw new ValidationError('Start and end dates are required');
    }
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ValidationError('Invalid date format');
    }
    if (startDate >= endDate) {
      throw new ValidationError('End date must be after start date');
    }
    const now = new Date();
    const minStart = new Date(now.getTime() + EventValidator.MIN_FUTURE_HOURS * 60 * 60 * 1000);
    if (startDate < minStart) {
      throw new ValidationError(`Event must start at least ${EventValidator.MIN_FUTURE_HOURS} hour(s) from now`);
    }
    const maxStart = new Date(now.getTime() + EventValidator.MAX_FUTURE_DAYS * 24 * 60 * 60 * 1000);
    if (startDate > maxStart) {
      throw new ValidationError(`Event cannot be scheduled more than ${EventValidator.MAX_FUTURE_DAYS} days in advance`);
    }
  }

  static validateCoordinates(latitude: number, longitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new ValidationError('Latitude must be between -90 and 90');
    }
    if (longitude < -180 || longitude > 180) {
      throw new ValidationError('Longitude must be between -180 and 180');
    }
  }

  static validateInterests(interests: string[]): void {
    if (!interests || interests.length === 0) {
      throw new ValidationError('At least one interest is required');
    }
    if (interests.length > EventValidator.MAX_INTERESTS) {
      throw new ValidationError(`Maximum ${EventValidator.MAX_INTERESTS} interests allowed`);
    }
  }

  static validateAll(input: EventValidationInput): void {
    if (input.title) EventValidator.validateTitle(input.title);
    if (input.description) EventValidator.validateDescription(input.description);
    if (input.startDate && input.endDate) {
      EventValidator.validateDates(input.startDate, input.endDate);
    }
    if (input.latitude !== undefined && input.longitude !== undefined) {
      EventValidator.validateCoordinates(input.latitude, input.longitude);
    }
    if (input.interests) EventValidator.validateInterests(input.interests);
  }
}
