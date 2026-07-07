import { Event } from '../../events/entities/event';
import { EventCapacity } from '../../events/value-objects/event-capacity';
import { Money } from '../../events/value-objects/money';
import { InvalidEventDateError } from '../../events/errors/event-errors';

describe('Event Entity', () => {
  const organizerId = 'org_123';
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  describe('create', () => {
    it('should create a draft event', () => {
      const event = Event.create({
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
        startDate: tomorrow,
        endDate: dayAfter,
        isFree: true,
        visibility: 'public',
        interests: ['interest_1'],
      });

      expect(event.id).toBeDefined();
      expect(event.status).toBe('draft');
      expect(event.title).toBe('Test Event');
      expect(event.organizerId).toBe(organizerId);
      expect(event.isFree).toBe(true);
    });

    it('should create event with capacity', () => {
      const event = Event.create({
        organizerId,
        title: 'Limited Event',
        description: 'A limited capacity event',
        startDate: tomorrow,
        endDate: dayAfter,
        capacity: EventCapacity.create(1, 100),
        isFree: true,
        visibility: 'public',
        interests: [],
      });

      expect(event.capacity).toBeDefined();
      expect(event.capacity?.max).toBe(100);
    });

    it('should create paid event with price', () => {
      const event = Event.create({
        organizerId,
        title: 'Paid Event',
        description: 'A paid event',
        startDate: tomorrow,
        endDate: dayAfter,
        isFree: false,
        price: Money.create(25.99, 'USD'),
        visibility: 'public',
        interests: [],
      });

      expect(event.isFree).toBe(false);
      expect(event.price).toBeDefined();
      expect(event.price?.amount).toBe(25.99);
      expect(event.price?.currency).toBe('USD');
    });
  });

  describe('publish', () => {
    it('should publish a draft event', () => {
      const event = Event.create({
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
        startDate: tomorrow,
        endDate: dayAfter,
        isFree: true,
        visibility: 'public',
        interests: [],
      });

      expect(event.isDraft).toBe(true);
      
      event.publish();
      
      expect(event.isPublished).toBe(true);
      expect(event.isDraft).toBe(false);
    });

    it('should throw when publishing non-draft event', () => {
      const event = Event.create({
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
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
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
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

    it('should throw when canceling completed event', () => {
      const event = Event.create({
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
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
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
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
        organizerId,
        title: 'Test Event',
        description: 'A test event description',
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
        organizerId,
        title: 'Original Event',
        description: 'Original description',
        startDate: tomorrow,
        endDate: dayAfter,
        isFree: true,
        visibility: 'public',
        interests: ['interest_1'],
      });

      const copy = event.duplicate();

      expect(copy.id).not.toBe(event.id);
      expect(copy.title).toBe('Original Event (Copy)');
      expect(copy.parentEventId).toBe(event.id);
      expect(copy.status).toBe('draft');
    });
  });
});
