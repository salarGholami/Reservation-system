// src/modules/budget/domain/value-objects/date-range.vo.ts

export class DateRange {
  public readonly from: Date;
  public readonly to: Date;

  private constructor(from: Date, to: Date) {
    if (from > to) {
      throw new Error("Invalid date range");
    }

    this.from = from;
    this.to = to;
  }

  static create(from: Date, to: Date): DateRange {
    return new DateRange(new Date(from), new Date(to));
  }

  contains(date: Date): boolean {
    return date >= this.from && date <= this.to;
  }
}
