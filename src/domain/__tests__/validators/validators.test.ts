import { EventValidator } from '../../events/validators/event-validator';
import { Validator } from '../../shared/validators/validator';

describe('Validators', () => {
  // ==========================================
  // Event Validator Tests
  // ==========================================
  describe('EventValidator', () => {
    const validator = new EventValidator();

    describe('title validation', () => {
      it('should accept valid title', () => {
        const result = validator.validateTitle('Summer Party');
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });

      it('should reject empty title', () => {
        const result = validator.validateTitle('');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Title is required');
      });

      it('should reject title that is too short', () => {
        const result = validator.validateTitle('Hi');
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('too short'))).toBe(true);
      });

      it('should reject title that is too long', () => {
        const result = validator.validateTitle('A'.repeat(101));
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('too long'))).toBe(true);
      });
    });

    describe('description validation', () => {
      it('should accept valid description', () => {
        const result = validator.validateDescription('This is a great event');
        expect(result.isValid).toBe(true);
      });

      it('should reject description that is too short', () => {
        const result = validator.validateDescription('Short');
        expect(result.isValid).toBe(false);
      });

      it('should reject description that is too long', () => {
        const result = validator.validateDescription('A'.repeat(5001));
        expect(result.isValid).toBe(false);
      });

      it('should allow optional description', () => {
        const result = validator.validateDescription('');
        expect(result.isValid).toBe(true);
      });
    });

    describe('date validation', () => {
      it('should accept future start date', () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const result = validator.validateDates(tomorrow, new Date(tomorrow.getTime() + 3600000));
        expect(result.isValid).toBe(true);
      });

      it('should reject past start date', () => {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = validator.validateDates(yesterday, new Date());
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('future'))).toBe(true);
      });

      it('should reject end date before start date', () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const result = validator.validateDates(tomorrow, yesterday);
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('before'))).toBe(true);
      });
    });

    describe('capacity validation', () => {
      it('should accept valid capacity', () => {
        const result = validator.validateCapacity(10, 100);
        expect(result.isValid).toBe(true);
      });

      it('should reject min greater than max', () => {
        const result = validator.validateCapacity(100, 10);
        expect(result.isValid).toBe(false);
      });

      it('should reject zero capacity', () => {
        const result = validator.validateCapacity(0, 0);
        expect(result.isValid).toBe(false);
      });
    });

    describe('interests validation', () => {
      it('should accept valid interests', () => {
        const result = validator.validateInterests(['social', 'networking', 'tech']);
        expect(result.isValid).toBe(true);
      });

      it('should reject too many interests', () => {
        const interests = Array(11).fill('interest');
        const result = validator.validateInterests(interests);
        expect(result.isValid).toBe(false);
      });

      it('should accept empty interests', () => {
        const result = validator.validateInterests([]);
        expect(result.isValid).toBe(true);
      });
    });

    describe('location validation', () => {
      it('should accept valid coordinates', () => {
        const result = validator.validateLocation({
          latitude: 48.8566,
          longitude: 2.3522,
          address: 'Paris, France',
        });
        expect(result.isValid).toBe(true);
      });

      it('should reject invalid latitude', () => {
        const result = validator.validateLocation({
          latitude: 91,
          longitude: 0,
        });
        expect(result.isValid).toBe(false);
      });

      it('should reject invalid longitude', () => {
        const result = validator.validateLocation({
          latitude: 0,
          longitude: 181,
        });
        expect(result.isValid).toBe(false);
      });
    });

    describe('full event validation', () => {
      it('should validate complete event', () => {
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const event = {
          title: 'Summer Party',
          description: 'Join us for a great summer party with drinks and music.',
          startDate: tomorrow,
          endDate: new Date(tomorrow.getTime() + 4 * 3600000),
          capacity: { min: 10, max: 100 },
          interests: ['social', 'party'],
          location: { latitude: 48.8566, longitude: 2.3522 },
        };

        const result = validator.validateEvent(event);
        expect(result.isValid).toBe(true);
      });

      it('should return all errors', () => {
        const event = {
          title: '',
          description: 'Short',
          startDate: new Date(Date.now() - 3600000),
          endDate: new Date(Date.now() - 7200000),
          capacity: { min: 100, max: 10 },
          interests: Array(15).fill('interest'),
          location: { latitude: 100, longitude: 200 },
        };

        const result = validator.validateEvent(event);
        expect(result.isValid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(1);
      });
    });
  });

  // ==========================================
  // Base Validator Tests
  // ==========================================
  describe('Validator', () => {
    it('should create validation result', () => {
      const result = new Validator.ValidationResult();
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should add errors', () => {
      const result = new Validator.ValidationResult();
      result.addError('Error 1');
      result.addError('Error 2');

      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(['Error 1', 'Error 2']);
    });

    it('should check if has errors', () => {
      const result = new Validator.ValidationResult();
      expect(result.hasErrors()).toBe(false);

      result.addError('Error');
      expect(result.hasErrors()).toBe(true);
    });

    it('should merge results', () => {
      const result1 = new Validator.ValidationResult();
      result1.addError('Error 1');

      const result2 = new Validator.ValidationResult();
      result2.addError('Error 2');

      const merged = result1.merge(result2);

      expect(merged.errors).toEqual(['Error 1', 'Error 2']);
    });
  });
});
