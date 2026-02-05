// src/app/dev/budget/page.tsx

import { Money, Transaction, Category } from "@/modules/budget";

export default function BudgetDevPage() {
  // Mock categories
  const salaryCategory = Category.create({
    id: "c1",
    name: "حقوق",
    type: "income",
    color: "#16a34a",
    isSystem: true,
  });

  const foodCategory = Category.create({
    id: "c2",
    name: "غذا",
    type: "expense",
    color: "#dc2626",
    isSystem: true,
  });

  // Mock transactions
  const income = Transaction.create({
    id: "t1",
    amount: Money.create(50000000),
    type: "income",
    categoryId: salaryCategory.id,
    occurredAt: new Date(),
    description: "حقوق دی ماه",
    createdAt: new Date(),
  });

  const expense = Transaction.create({
    id: "t2",
    amount: Money.create(8000000),
    type: "expense",
    categoryId: foodCategory.id,
    occurredAt: new Date(),
    description: "خرید ماهانه",
    createdAt: new Date(),
  });

  const balance = income.amount.subtract(expense.amount);

  return (
    <main className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Budget Domain Debug</h1>

      <div>Income: {income.amount.value.toLocaleString()}</div>
      <div>Expense: {expense.amount.value.toLocaleString()}</div>
      <div>Balance: {balance.value.toLocaleString()}</div>
    </main>
  );
}
