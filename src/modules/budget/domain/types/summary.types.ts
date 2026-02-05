// src/modules/budget/domain/types/summary.types.ts

import { Money } from "../value-objects/money.vo";

export type CategoryBreakdown = {
  categoryId: string;
  total: Money;
  percentage: number;
};

export type MoneyFlowSummary = {
  totalIncome: Money;
  totalExpense: Money;
  balance: Money;
  categoryBreakdown: CategoryBreakdown[];
};
