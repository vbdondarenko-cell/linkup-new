export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {}

  static readonly USD = 'USD';
  static readonly EUR = 'EUR';
  static readonly UAH = 'UAH';
  static readonly SUPPORTED_CURRENCIES = [Money.USD, Money.EUR, Money.UAH];

  static create(amount: number, currency = Money.USD): Money {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
    if (!Money.SUPPORTED_CURRENCIES.includes(currency)) {
      throw new Error(`Currency must be one of: ${Money.SUPPORTED_CURRENCIES.join(', ')}`);
    }
    // Round to 2 decimal places
    return new Money(Math.round(amount * 100) / 100, currency);
  }

  static zero(currency = Money.USD): Money {
    return new Money(0, currency);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return Money.create(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this.amount - other.amount;
    return Money.create(Math.max(0, result), this.currency);
  }

  multiply(factor: number): Money {
    return Money.create(this.amount * factor, this.currency);
  }

  isZero(): boolean {
    return this.amount === 0;
  }

  isPositive(): boolean {
    return this.amount > 0;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
  }

  greaterThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount > other.amount;
  }

  lessThan(other: Money): boolean {
    this.ensureSameCurrency(other);
    return this.amount < other.amount;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Cannot operate on Money with different currencies');
    }
  }

  toJSON(): { amount: number; currency: string } {
    return { amount: this.amount, currency: this.currency };
  }

  format(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }
}
