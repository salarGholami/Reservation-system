// src/app/dev/budget/page.tsx

import React from "react";
import { Money, Transaction, Category } from "@/modules/budget";
import { analyzeMoneyFlow } from "@/modules/budget/application/analyze-money-flow.usecase";

export default function BudgetDevPage() {
  // ---------- دسته‌ها ----------
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

  const entertainmentCategory = Category.create({
    id: "c3",
    name: "تفریح",
    type: "expense",
    color: "#2563eb",
    isSystem: false,
  });

  // ---------- تراکنش‌ها ----------
  const transactions: Transaction[] = [
    Transaction.create({
      id: "t1",
      amount: Money.create(50000000),
      type: "income",
      categoryId: salaryCategory.id,
      occurredAt: new Date(),
      description: "حقوق دی ماه",
      createdAt: new Date(),
    }),
    Transaction.create({
      id: "t2",
      amount: Money.create(8000000),
      type: "expense",
      categoryId: foodCategory.id,
      occurredAt: new Date(),
      description: "خرید ماهانه غذا",
      createdAt: new Date(),
    }),
    Transaction.create({
      id: "t3",
      amount: Money.create(2000000),
      type: "expense",
      categoryId: entertainmentCategory.id,
      occurredAt: new Date(),
      description: "سینما و تفریح",
      createdAt: new Date(),
    }),
  ];

  // ---------- تحلیل جریان پول ----------
  const summary = analyzeMoneyFlow({
    transactions,
    categories: [salaryCategory, foodCategory, entertainmentCategory],
  });

  // ---------- رندر UI ----------
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-4">نمایش تستی جریان بودجه</h1>

      <div className="space-y-1">
        <div>کل درآمد: {summary.totalIncome.value.toLocaleString()} تومان</div>
        <div>کل هزینه: {summary.totalExpense.value.toLocaleString()} تومان</div>
        <div>بالانس: {summary.balance.value.toLocaleString()} تومان</div>
      </div>

      <h2 className="text-2xl font-semibold mt-6">جزئیات هزینه‌ها</h2>
      <div className="space-y-2">
        {summary.categoryBreakdown.map((item) => (
          <div key={item.categoryId} className="flex justify-between">
            <span>
              دسته: {item.categoryId} — {item.total.value.toLocaleString()}{" "}
              تومان
            </span>
            <span>{item.percentage}% از کل هزینه</span>
          </div>
        ))}
      </div>
    </main>
  );
}
