// src/modules/budget/domain/entities/rule.entity.ts

export type ThresholdType = "percentage" | "absolute";
export type ComparisonOperator = "gt" | "gte" | "lt" | "lte";

export interface BudgetRuleProps {
  id: string;
  categoryId: string;
  thresholdType: ThresholdType;
  thresholdValue: number;
  comparison: ComparisonOperator;
  message: string;
}

export class BudgetRule {
  public readonly id: string;
  public readonly categoryId: string;
  public readonly thresholdType: ThresholdType;
  public readonly thresholdValue: number;
  public readonly comparison: ComparisonOperator;
  public readonly message: string;

  private constructor(props: BudgetRuleProps) {
    this.id = props.id;
    this.categoryId = props.categoryId;
    this.thresholdType = props.thresholdType;
    this.thresholdValue = props.thresholdValue;
    this.comparison = props.comparison;
    this.message = props.message;
  }

  static create(props: BudgetRuleProps): BudgetRule {
    if (!props.categoryId) {
      throw new Error("Rule must have category");
    }

    if (props.thresholdValue <= 0) {
      throw new Error("Threshold must be positive");
    }

    if (!props.message.trim()) {
      throw new Error("Rule must have message");
    }

    return new BudgetRule(props);
  }
}
