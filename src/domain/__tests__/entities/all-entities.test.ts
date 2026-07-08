import { Event } from '../../events/entities/event';
import { EventCapacity } from '../../events/value-objects/event-capacity';
import { Money } from '../../events/value-objects/money';
import { User } from '../../users/entities/user';
import { Profile } from '../../profiles/entities/profile';
import { Coordinates } from '../../profiles/value-objects/coordinates';

describe('Domain Entities', () => {
  // ==========================================
  // Event Entity Tests
  // ==========================================
  describe('Event Entity', () => {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

    describe('create', () => {
      it('should create a draft event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Test Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: ['social'],
        });

        expect(event.id).toBeDefined();
        expect(event.status).toBe('draft');
        expect(event.title).toBe('Test Event');
        expect(event.isDraft).toBe(true);
      });

      it('should create event with capacity', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Limited Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          capacity: EventCapacity.create(10, 100),
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        expect(event.capacity?.min).toBe(10);
        expect(event.capacity?.max).toBe(100);
      });

      it('should create paid event with price', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Paid Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: false,
          price: Money.create(25.99, 'USD'),
          visibility: 'public',
          interests: [],
        });

        expect(event.isFree).toBe(false);
        expect(event.price?.amount).toBe(25.99);
        expect(event.price?.currency).toBe('USD');
      });
    });

    describe('publish', () => {
      it('should publish a draft event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        event.publish();
        expect(event.isPublished).toBe(true);
        expect(event.isDraft).toBe(false);
      });

      it('should throw when publishing non-draft event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        event.publish();
        expect(() => event.publish()).toThrow('Can only publish draft events');
      });
    });

    describe('cancel', () => {
      it('should cancel a published event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        event.publish();
        event.cancel();
        expect(event.isCancelled).toBe(true);
      });

      it('should throw when cancelling completed event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        event.publish();
        event.finish();
        expect(() => event.cancel()).toThrow('Cannot cancel completed or already cancelled events');
      });
    });

    describe('updateDates', () => {
      it('should update event dates', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        const newStart = new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000);
        const newEnd = new Date(dayAfter.getTime() + 2 * 60 * 60 * 1000);

        event.updateDates(newStart, newEnd);

        expect(event.startDate.getTime()).toBe(newStart.getTime());
        expect(event.endDate.getTime()).toBe(newEnd.getTime());
      });

      it('should throw when start date is after end date', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        expect(() => event.updateDates(dayAfter, tomorrow)).toThrow('Start date must be before end date');
      });
    });

    describe('duplicate', () => {
      it('should create a copy of the event', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Original Event',
          description: 'Original description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: ['social'],
        });

        const copy = event.duplicate();

        expect(copy.id).not.toBe(event.id);
        expect(copy.title).toBe('Original Event (Copy)');
        expect(copy.parentEventId).toBe(event.id);
        expect(copy.status).toBe('draft');
      });
    });

    describe('duration', () => {
      it('should calculate correct duration', () => {
        const event = Event.create({
          organizerId: 'org_123',
          title: 'Test Event',
          description: 'Description',
          startDate: tomorrow,
          endDate: dayAfter,
          isFree: true,
          visibility: 'public',
          interests: [],
        });

        expect(event.duration).toBe(24 * 60 * 60 * 1000); // 24 hours
      });
    });
  });

  // ==========================================
  // User Entity Tests
  // ==========================================
  describe('User Entity', () => {
    describe('create', () => {
      it('should create a user with default values', () => {
        const user = User.create({
          telegramId: '123456789',
          username: 'testuser',
          displayName: 'Test User',
        });

        expect(user.id).toBeDefined();
        expect(user.telegramId).toBe('123456789');
        expect(user.username).toBe('testuser');
        expect(user.displayName).toBe('Test User');
        expect(user.trustScore).toBe(50);
        expect(user.verificationLevel).toBe(0);
      });

      it('should create user with avatar', () => {
        const user = User.create({
          telegramId: '123456789',
          username: 'testuser',
          displayName: 'Test User',
          avatarUrl: 'https://example.com/avatar.jpg',
        });

        expect(user.avatarUrl).toBe('https://example.com/avatar.jpg');
      });
    });

    describe('trust score', () => {
      it('should update trust score', () => {
        const user = User.create({
          telegramId: '123456789',
          username: 'testuser',
          displayName: 'Test User',
        });

        user.updateTrustScore(75);
        expect(user.trustScore).toBe(75);
      });

      it('should clamp trust score between 0 and 100', () => {
        const user = User.create({
          telegramId: '123456789',
          username: 'testuser',
          displayName: 'Test User',
        });

        user.updateTrustScore(150);
        expect(user.trustScore).toBe(100);

        user.updateTrustScore(-20);
        expect(user.trustScore).toBe(0);
      });
    });

    describe('verification', () => {
      it('should increment verification level', () => {
        const user = User.create({
          telegramId: '123456789',
          username: 'testuser',
          displayName: 'Test User',
        });

        expect(user.verificationLevel).toBe(0);
        user.incrementVerification();
        expect(user.verificationLevel).toBe(1);
      });
    });
  });

  // ==========================================
  // Profile Entity Tests
  // ==========================================
  describe('Profile Entity', () => {
    describe('create', () => {
      it('should create a profile with default values', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
        });

        expect(profile.id).toBeDefined();
        expect(profile.userId).toBe('user_123');
        expect(profile.language).toBe('en');
        expect(profile.radius).toBe(50);
        expect(profile.interests).toEqual([]);
      });

      it('should create profile with coordinates', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
          location: Coordinates.create(48.8566, 2.3522),
        });

        expect(profile.location?.latitude).toBe(48.8566);
        expect(profile.location?.longitude).toBe(2.3522);
      });
    });

    describe('interests', () => {
      it('should add interests', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
        });

        profile.addInterest('social');
        profile.addInterest('networking');

        expect(profile.interests).toContain('social');
        expect(profile.interests).toContain('networking');
        expect(profile.interests.length).toBe(2);
      });

      it('should not add duplicate interests', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
          interests: ['social'],
        });

        profile.addInterest('social');
        expect(profile.interests.length).toBe(1);
      });

      it('should remove interests', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
          interests: ['social', 'networking'],
        });

        profile.removeInterest('social');
        expect(profile.interests).not.toContain('social');
        expect(profile.interests).toContain('networking');
      });
    });

    describe('radius', () => {
      it('should update radius within valid range', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
          radius: 50,
        });

        profile.updateRadius(30);
        expect(profile.radius).toBe(30);
      });

      it('should clamp radius between 1 and 500', () => {
        const profile = Profile.create({
          userId: 'user_123',
          language: 'en',
        });

        profile.updateRadius(0);
        expect(profile.radius).toBe(1);

        profile.updateRadius(1000);
        expect(profile.radius).toBe(500);
      });
    });
  });

  // ==========================================
  // EventCapacity Value Object Tests
  // ==========================================
  describe('EventCapacity', () => {
    it('should create capacity', () => {
      const capacity = EventCapacity.create(10, 100);
      expect(capacity.min).toBe(10);
      expect(capacity.max).toBe(100);
    });

    it('should validate min <= max', () => {
      expect(() => EventCapacity.create(100, 10)).toThrow();
    });

    it('should check availability', () => {
      const capacity = EventCapacity.create(10, 100);
      expect(capacity.isAvailable(50)).toBe(true);
      expect(capacity.isAvailable(100)).toBe(true);
      expect(capacity.isAvailable(101)).toBe(false);
    });

    it('should calculate fill percentage', () => {
      const capacity = EventCapacity.create(10, 100);
      expect(capacity.fillPercentage(25)).toBe(25);
      expect(capacity.fillPercentage(50)).toBe(50);
      expect(capacity.fillPercentage(100)).toBe(100);
    });
  });

  // ==========================================
  // Money Value Object Tests
  // ==========================================
  describe('Money', () => {
    it('should create money with amount and currency', () => {
      const money = Money.create(25.99, 'USD');
      expect(money.amount).toBe(25.99);
      expect(money.currency).toBe('USD');
    });

    it('should format as string', () => {
      const money = Money.create(25.99, 'USD');
      expect(money.toString()).toBe('$25.99');

      const euro = Money.create(20, 'EUR');
      expect(euro.toString()).toBe('€20.00');
    });

    it('should handle zero amount', () => {
      const money = Money.create(0, 'USD');
      expect(money.amount).toBe(0);
      expect(money.isZero()).toBe(true);
    });

    it('should add money', () => {
      const money1 = Money.create(10, 'USD');
      const money2 = Money.create(5.5, 'USD');
      const result = money1.add(money2);
      expect(result.amount).toBe(15.5);
    });

    it('should throw when adding different currencies', () => {
      const money1 = Money.create(10, 'USD');
      const money2 = Money.create(10, 'EUR');
      expect(() => money1.add(money2)).toThrow('Cannot add different currencies');
    });
  });

  // ==========================================
  // Coordinates Value Object Tests
  // ==========================================
  describe('Coordinates', () => {
    it('should create coordinates', () => {
      const coords = Coordinates.create(48.8566, 2.3522);
      expect(coords.latitude).toBe(48.8566);
      expect(coords.longitude).toBe(2.3522);
    });

    it('should validate latitude range', () => {
      expect(() => Coordinates.create(91, 0)).toThrow('Latitude must be between -90 and 90');
      expect(() => Coordinates.create(-91, 0)).toThrow('Latitude must be between -90 and 90');
    });

    it('should validate longitude range', () => {
      expect(() => Coordinates.create(0, 181)).toThrow('Longitude must be between -180 and 180');
      expect(() => Coordinates.create(0, -181)).toThrow('Longitude must be between -180 and 180');
    });

    it('should calculate distance', () => {
      const paris = Coordinates.create(48.8566, 2.3522);
      const london = Coordinates.create(51.5074, -0.1278);

      const distance = paris.distanceTo(london);
      expect(distance).toBeGreaterThan(300); // km
      expect(distance).toBeLessThan(500); // km
    });

    it('should serialize to JSON', () => {
      const coords = Coordinates.create(48.8566, 2.3522);
      const json = coords.toJSON();
      expect(json.latitude).toBe(48.8566);
      expect(json.longitude).toBe(2.3522);
    });
  });
});
