// src/modules/budget/application/evaluate-rules.usecase.ts

import { Transaction, Category, BudgetRule, Money } from "../index";

interface EvaluateRulesInput {
  transactions: Transaction[];
  categories: Category[];
  rules: BudgetRule[];
}

export function evaluateRules({
  transactions,
  categories,
  rules,
}: EvaluateRulesInput): string[] {
  const alerts: string[] = [];

  // محاسبه کل درآمد و کل هزینه
  let totalIncome = Money.zero();
  let totalExpense = Money.zero();

  const categoryExpenseMap = new Map<string, Money>();

  for (const tx of transactions) {
    if (tx.type === "income") {
      totalIncome = totalIncome.add(tx.amount);
    } else {
      totalExpense = totalExpense.add(tx.amount);

      const existing = categoryExpenseMap.get(tx.categoryId) ?? Money.zero();
      categoryExpenseMap.set(tx.categoryId, existing.add(tx.amount));
    }
  }

  // اجرای قوانین
  for (const rule of rules) {
    const categoryTotal =
      categoryExpenseMap.get(rule.categoryId) ?? Money.zero();
    let trigger = false;

    if (rule.thresholdType === "absolute") {
      switch (rule.comparison) {
        case "gt":
          trigger = categoryTotal.isGreaterThan(
            Money.create(rule.thresholdValue),
          );
          break;
        case "gte":
          trigger = categoryTotal.isGreaterOrEqual(
            Money.create(rule.thresholdValue),
          );
          break;
        case "lt":
          trigger = categoryTotal.isLessThan(Money.create(rule.thresholdValue));
          break;
        case "lte":
          trigger =
            categoryTotal.isGreaterOrEqual(
              Money.create(rule.thresholdValue),
            ) === false;
          break;
      }
    } else if (rule.thresholdType === "percentage") {
      const percentage =
        totalExpense.value === 0
          ? 0
          : (categoryTotal.value / totalExpense.value) * 100;

      switch (rule.comparison) {
        case "gt":
          trigger = percentage > rule.thresholdValue;
          break;
        case "gte":
          trigger = percentage >= rule.thresholdValue;
          break;
        case "lt":
          trigger = percentage < rule.thresholdValue;
          break;
        case "lte":
          trigger = percentage <= rule.thresholdValue;
          break;
      }
    }

    if (trigger) {
      alerts.push(rule.message);
    }
  }

  return alerts;
}
