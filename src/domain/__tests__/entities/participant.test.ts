import { Participant } from '../../participants/entities/participant';

describe('Participant Entity', () => {
  const eventId = 'event_123';
  const userId = 'user_456';

  describe('create', () => {
    it('should create a pending participant for regular user', () => {
      const participant = Participant.create(eventId, userId);

      expect(participant.id).toBe(`${eventId}_${userId}`);
      expect(participant.eventId).toBe(eventId);
      expect(participant.userId).toBe(userId);
      expect(participant.status).toBe('pending');
      expect(participant.isOrganizer).toBe(false);
    });

    it('should create an approved participant for organizer', () => {
      const participant = Participant.create(eventId, userId, true);

      expect(participant.status).toBe('approved');
      expect(participant.isOrganizer).toBe(true);
      expect(participant.approvedAt).toBeDefined();
    });
  });

  describe('approve', () => {
    it('should approve a pending participant', () => {
      const participant = Participant.create(eventId, userId);
      
      participant.approve();

      expect(participant.isApproved).toBe(true);
      expect(participant.approvedAt).toBeDefined();
    });

    it('should throw when trying to approve organizer', () => {
      const participant = Participant.create(eventId, userId, true);

      expect(() => participant.approve()).toThrow('Cannot change organizer status');
    });
  });

  describe('decline', () => {
    it('should decline a participant', () => {
      const participant = Participant.create(eventId, userId);
      
      participant.decline();

      expect(participant.status).toBe('declined');
    });

    it('should throw when trying to decline organizer', () => {
      const participant = Participant.create(eventId, userId, true);

      expect(() => participant.decline()).toThrow('Cannot decline organizer');
    });
  });

  describe('cancel', () => {
    it('should cancel a participant', () => {
      const participant = Participant.create(eventId, userId);
      
      participant.cancel();

      expect(participant.isCancelled).toBe(true);
      expect(participant.cancelledAt).toBeDefined();
    });

    it('should throw when trying to cancel organizer', () => {
      const participant = Participant.create(eventId, userId, true);

      expect(() => participant.cancel()).toThrow('Cannot cancel organizer participation');
    });
  });

  describe('checkIn', () => {
    it('should check in an approved participant', () => {
      const participant = Participant.create(eventId, userId);
      participant.approve();
      
      participant.checkIn();

      expect(participant.isAttended).toBe(true);
      expect(participant.checkedInAt).toBeDefined();
    });

    it('should throw when checking in non-approved participant', () => {
      const participant = Participant.create(eventId, userId);

      expect(() => participant.checkIn()).toThrow('Can only check in approved participants');
    });
  });

  describe('markNoShow', () => {
    it('should mark approved participant as no-show', () => {
      const participant = Participant.create(eventId, userId);
      participant.approve();
      
      participant.markNoShow();

      expect(participant.status).toBe('no_show');
    });

    it('should throw when marking non-approved participant', () => {
      const participant = Participant.create(eventId, userId);

      expect(() => participant.markNoShow()).toThrow('Can only mark no-show for approved participants');
    });
  });

  describe('addToWaitlist', () => {
    it('should add participant to waitlist', () => {
      const participant = Participant.create(eventId, userId);
      
      participant.addToWaitlist();

      expect(participant.isWaitlisted).toBe(true);
    });
  });
});
