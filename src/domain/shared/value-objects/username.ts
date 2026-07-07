export class Username {
  private constructor(public readonly value: string) {}

  static readonly MIN_LENGTH = 3;
  static readonly MAX_LENGTH = 30;
  static readonly PATTERN = /^[a-zA-Z0-9_]+$/;

  static create(value: string): Username {
    if (value.length < Username.MIN_LENGTH) {
      throw new Error(`Username must be at least ${Username.MIN_LENGTH} characters`);
    }
    if (value.length > Username.MAX_LENGTH) {
      throw new Error(`Username must be at most ${Username.MAX_LENGTH} characters`);
    }
    if (!Username.PATTERN.test(value)) {
      throw new Error('Username can only contain letters, numbers, and underscores');
    }
    return new Username(value.toLowerCase());
  }

  equals(other: Username): boolean {
    return this.value === other.value;
  }

  toJSON(): string {
    return this.value;
  }
}
