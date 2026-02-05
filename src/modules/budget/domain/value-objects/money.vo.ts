// src/modules/budget/domain/value-objects/money.vo.ts

export class Money {
  private readonly _value: number;

  private constructor(value: number) {
    this._value = Money.normalize(value);
  }

  static create(value: number): Money {
    if (!Number.isFinite(value)) {
      throw new Error("Money must be a finite number");
    }

    if (value < 0) {
      throw new Error("Money cannot be negative");
    }

    return new Money(value);
  }

  static zero(): Money {
    return new Money(0);
  }

  get value(): number {
    return this._value;
  }

  add(other: Money): Money {
    return new Money(this._value + other._value);
  }

  subtract(other: Money): Money {
    const result = this._value - other._value;

    if (result < 0) {
      throw new Error("Resulting money cannot be negative");
    }

    return new Money(result);
  }

  multiply(factor: number): Money {
    if (!Number.isFinite(factor)) {
      throw new Error("Multiplier must be finite");
    }

    return new Money(this._value * factor);
  }

  isGreaterThan(other: Money): boolean {
    return this._value > other._value;
  }

  isGreaterOrEqual(other: Money): boolean {
    return this._value >= other._value;
  }

  isLessThan(other: Money): boolean {
    return this._value < other._value;
  }

  equals(other: Money): boolean {
    return this._value === other._value;
  }

  private static normalize(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
