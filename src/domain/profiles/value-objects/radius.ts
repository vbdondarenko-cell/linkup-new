export class Radius {
  private constructor(public readonly value: number) {}

  static readonly MIN = 1;
  static readonly MAX = 100;
  static readonly DEFAULT = 10;

  static create(value: number): Radius {
    if (value < Radius.MIN || value > Radius.MAX) {
      throw new Error(`Radius must be between ${Radius.MIN} and ${Radius.MAX} km`);
    }
    return new Radius(value);
  }

  static default(): Radius {
    return new Radius(Radius.DEFAULT);
  }

  equals(other: Radius): boolean {
    return this.value === other.value;
  }

  toJSON(): number {
    return this.value;
  }
}
