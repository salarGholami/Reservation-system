// src/app/dev/budget/rules/page.tsx

import React from "react";
import { Money, Transaction, Category, BudgetRule } from "@/modules/budget";
import { analyzeMoneyFlow } from "@/modules/budget/application/analyze-money-flow.usecase";
import { evaluateRules } from "@/modules/budget/application/evaluate-rules.usecase";

export default function BudgetRulesDevPage() {
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

  // ---------- قوانین ----------
  const rules: BudgetRule[] = [
    BudgetRule.create({
      id: "r1",
      categoryId: foodCategory.id,
      thresholdType: "percentage",
      thresholdValue: 30, // درصد
      comparison: "gt",
      message: "هزینه غذا بیش از ۳۰٪ کل هزینه‌ها است!",
    }),
    BudgetRule.create({
      id: "r2",
      categoryId: entertainmentCategory.id,
      thresholdType: "percentage",
      thresholdValue: 20,
      comparison: "gt",
      message: "هزینه تفریح بیش از ۲۰٪ کل هزینه‌ها است!",
    }),
  ];

  // ---------- تحلیل جریان پول ----------
  const summary = analyzeMoneyFlow({
    transactions,
    categories: [salaryCategory, foodCategory, entertainmentCategory],
  });

  // ---------- اجرای Rule Engine ----------
  const alerts = evaluateRules({
    transactions,
    categories: [salaryCategory, foodCategory, entertainmentCategory],
    rules,
  });

  // ---------- رندر ----------
  return (
    <main className="p-10 space-y-6">
      <h1 className="text-3xl font-bold mb-4">صفحه تست قوانین بودجه</h1>

      <div className="space-y-1">
        <div>کل درآمد: {summary.totalIncome.value.toLocaleString()} تومان</div>
        <div>کل هزینه: {summary.totalExpense.value.toLocaleString()} تومان</div>
        <div>بالانس: {summary.balance.value.toLocaleString()} تومان</div>
      </div>

      <h2 className="text-2xl font-semibold mt-6">هشدارها / Alerts</h2>
      <div className="space-y-2">
        {alerts.length === 0 ? (
          <div>هیچ هشداری وجود ندارد</div>
        ) : (
          alerts.map((msg, idx) => (
            <div key={idx} className="text-red-600 font-semibold">
              ⚠ {msg}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
