import { EventValidator } from '../../events/validators/event-validator';
import { ValidationError } from '../../shared/errors/base';

describe('EventValidator', () => {
  describe('validateTitle', () => {
    it('should pass for valid title', () => {
      expect(() => EventValidator.validateTitle('Valid Event Title')).not.toThrow();
    });

    it('should throw for empty title', () => {
      expect(() => EventValidator.validateTitle('')).toThrow(ValidationError);
    });

    it('should throw for title too short', () => {
      expect(() => EventValidator.validateTitle('AB')).toThrow('at least 3 characters');
    });

    it('should throw for title too long', () => {
      const longTitle = 'A'.repeat(101);
      expect(() => EventValidator.validateTitle(longTitle)).toThrow('cannot exceed 100 characters');
    });
  });

  describe('validateDescription', () => {
    it('should pass for valid description', () => {
      const desc = 'This is a valid event description that is long enough.';
      expect(() => EventValidator.validateDescription(desc)).not.toThrow();
    });

    it('should throw for empty description', () => {
      expect(() => EventValidator.validateDescription('')).toThrow(ValidationError);
    });

    it('should throw for description too short', () => {
      expect(() => EventValidator.validateDescription('Short')).toThrow('at least 10 characters');
    });

    it('should throw for description too long', () => {
      const longDesc = 'A'.repeat(5001);
      expect(() => EventValidator.validateDescription(longDesc)).toThrow('cannot exceed 5000 characters');
    });
  });

  describe('validateDates', () => {
    it('should pass for valid future dates', () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      expect(() => EventValidator.validateDates(tomorrow, dayAfter)).not.toThrow();
    });

    it('should throw when end date is before start date', () => {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      expect(() => EventValidator.validateDates(dayAfter, tomorrow)).toThrow('End date must be after start date');
    });

    it('should throw for dates too far in the future', () => {
      const now = new Date();
      const farFuture = new Date(now.getTime() + 400 * 24 * 60 * 60 * 1000);
      const evenFarther = new Date(farFuture.getTime() + 24 * 60 * 60 * 1000);

      expect(() => EventValidator.validateDates(farFuture, evenFarther)).toThrow('cannot be scheduled more than');
    });
  });

  describe('validateCoordinates', () => {
    it('should pass for valid coordinates', () => {
      expect(() => EventValidator.validateCoordinates(50.4501, 30.5234)).not.toThrow();
    });

    it('should throw for invalid latitude', () => {
      expect(() => EventValidator.validateCoordinates(95, 30.5234)).toThrow('Latitude must be between -90 and 90');
      expect(() => EventValidator.validateCoordinates(-95, 30.5234)).toThrow('Latitude must be between -90 and 90');
    });

    it('should throw for invalid longitude', () => {
      expect(() => EventValidator.validateCoordinates(50, 200)).toThrow('Longitude must be between -180 and 180');
      expect(() => EventValidator.validateCoordinates(50, -200)).toThrow('Longitude must be between -180 and 180');
    });
  });

  describe('validateInterests', () => {
    it('should pass for valid interests', () => {
      expect(() => EventValidator.validateInterests(['interest_1', 'interest_2'])).not.toThrow();
    });

    it('should throw for empty interests', () => {
      expect(() => EventValidator.validateInterests([])).toThrow('At least one interest is required');
    });

    it('should throw for too many interests', () => {
      const manyInterests = Array.from({ length: 15 }, (_, i) => `interest_${i}`);
      expect(() => EventValidator.validateInterests(manyInterests)).toThrow('Maximum 10 interests allowed');
    });
  });
});
