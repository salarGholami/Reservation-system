// src/modules/budget/application/analyze-money-flow.usecase.ts

import {
  Transaction,
  Category,
  Money,
  MoneyFlowSummary,
  CategoryBreakdown,
} from "../index";

interface AnalyzeMoneyFlowInput {
  transactions: Transaction[];
  categories: Category[];
}

export function analyzeMoneyFlow({
  transactions,
  categories,
}: AnalyzeMoneyFlowInput): MoneyFlowSummary {
  let totalIncome = Money.zero();
  let totalExpense = Money.zero();

  const expenseMap = new Map<string, Money>();

  for (const tx of transactions) {
    if (tx.type === "income") {
      totalIncome = totalIncome.add(tx.amount);
    } else {
      totalExpense = totalExpense.add(tx.amount);

      const existing = expenseMap.get(tx.categoryId) ?? Money.zero();
      expenseMap.set(tx.categoryId, existing.add(tx.amount));
    }
  }

  const balance = totalIncome.subtract(totalExpense);

  const categoryBreakdown: CategoryBreakdown[] = [];

  for (const [categoryId, total] of expenseMap.entries()) {
    const percentage =
      totalExpense.value === 0
        ? 0
        : Math.round((total.value / totalExpense.value) * 100);

    categoryBreakdown.push({
      categoryId,
      total,
      percentage,
    });
  }

  return {
    totalIncome,
    totalExpense,
    balance,
    categoryBreakdown,
  };
}
