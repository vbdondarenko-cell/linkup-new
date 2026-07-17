export class EventCapacity {
  private constructor(
    public readonly min: number,
    public readonly max: number,
    public readonly waitlistEnabled: boolean,
    public readonly waitlistLimit?: number
  ) {}

  static readonly MIN = 1;
  static readonly MAX = 100000;
  static readonly DEFAULT_MAX = 50;

  static create(min: number, max: number, waitlistEnabled = true, waitlistLimit?: number): EventCapacity {
    if (min < EventCapacity.MIN) {
      throw new Error(`Minimum capacity must be at least ${EventCapacity.MIN}`);
    }
    if (max > EventCapacity.MAX) {
      throw new Error(`Maximum capacity cannot exceed ${EventCapacity.MAX}`);
    }
    if (min > max) {
      throw new Error('Minimum capacity cannot exceed maximum');
    }
    if (waitlistLimit !== undefined && waitlistLimit < 0) {
      throw new Error('Waitlist limit cannot be negative');
    }
    return new EventCapacity(min, max, waitlistEnabled, waitlistLimit);
  }

  static default(): EventCapacity {
    return new EventCapacity(1, EventCapacity.DEFAULT_MAX, true);
  }

  static unlimited(): EventCapacity {
    return new EventCapacity(1, EventCapacity.MAX, false);
  }

  hasWaitlist(): boolean {
    return this.waitlistEnabled;
  }

  getWaitlistLimit(): number | undefined {
    return this.waitlistLimit;
  }

  canAccept(currentCount: number): boolean {
    return currentCount < this.max;
  }

  needsWaitlist(currentCount: number): boolean {
    return this.waitlistEnabled && currentCount >= this.max;
  }

  toJSON(): { min: number; max: number; waitlistEnabled: boolean; waitlistLimit?: number } {
    return {
      min: this.min,
      max: this.max,
      waitlistEnabled: this.waitlistEnabled,
      waitlistLimit: this.waitlistLimit,
    };
  }
}
