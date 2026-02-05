// src/app/dev/budget/interactive/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Money, Transaction, Category, BudgetRule } from "@/modules/budget";
import { analyzeMoneyFlow } from "@/modules/budget/application/analyze-money-flow.usecase";

// ---------- Rule Engine ----------
function analyzeRules(
  transactions: Transaction[],
  categories: Category[],
  rules: BudgetRule[],
) {
  const alerts: string[] = [];
  const summary = analyzeMoneyFlow({ transactions, categories });

  for (const rule of rules) {
    const category = categories.find((c) => c.id === rule.categoryId);
    if (!category) continue;

    const catTotal = transactions
      .filter((tx) => tx.categoryId === category.id)
      .reduce((sum, tx) => sum + tx.amount.value, 0);

    if (rule.thresholdType === "percentage") {
      const base =
        category.type === "expense"
          ? summary.totalExpense.value
          : summary.totalIncome.value;
      if (base === 0) continue;
      const percent = (catTotal / base) * 100;

      if (rule.comparison === "gt" && percent > rule.thresholdValue) {
        alerts.push(rule.message);
      }
      if (rule.comparison === "lt" && percent < rule.thresholdValue) {
        alerts.push(rule.message);
      }
    }
  }

  return alerts;
}

// ---------- Persistence Hook ----------
function useBudgetStorage() {
  const STORAGE_KEY = "budget_transactions_v3";
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(
          parsed.map((tx: any) =>
            Transaction.create({
              ...tx,
              amount: Money.create(Number(tx.amount)),
              occurredAt: new Date(tx.occurredAt),
              createdAt: new Date(tx.createdAt),
            }),
          ),
        );
      } catch {
        console.warn("Failed to parse stored transactions");
      }
    }
  }, []);

  useEffect(() => {
    const raw = transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount.value,
      type: tx.type,
      categoryId: tx.categoryId,
      description: tx.description,
      occurredAt: tx.occurredAt.toISOString(),
      createdAt: tx.createdAt.toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(raw));
  }, [transactions]);

  return { transactions, setTransactions };
}

// ---------- Page ----------
export default function BudgetInteractivePage() {
  const categories: Category[] = [
    Category.create({
      id: "c1",
      name: "حقوق",
      type: "income",
      color: "#16a34a",
      isSystem: true,
    }),
    Category.create({
      id: "c2",
      name: "غذا",
      type: "expense",
      color: "#dc2626",
      isSystem: true,
    }),
    Category.create({
      id: "c3",
      name: "تفریح",
      type: "expense",
      color: "#2563eb",
      isSystem: false,
    }),
  ];

  const rules: BudgetRule[] = [
    BudgetRule.create({
      id: "r1",
      categoryId: "c2",
      thresholdType: "percentage",
      thresholdValue: 30,
      comparison: "gt",
      message: "هزینه غذا بیش از ۳۰٪ کل هزینه‌ها است!",
    }),
    BudgetRule.create({
      id: "r2",
      categoryId: "c3",
      thresholdType: "percentage",
      thresholdValue: 20,
      comparison: "gt",
      message: "هزینه تفریح بیش از ۲۰٪ کل هزینه‌ها است!",
    }),
  ];

  const { transactions, setTransactions } = useBudgetStorage();
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    categoryId: "c1",
    description: "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const formatMoney = (value: number) => {
    if (!mounted) return value.toString();
    return new Intl.NumberFormat("fa-IR").format(value);
  };

  const handleAddTransaction = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    const tx = Transaction.create({
      id: `t${Date.now()}`,
      amount: Money.create(Number(form.amount)),
      type: form.type as "income" | "expense",
      categoryId: form.categoryId,
      description: form.description,
      occurredAt: new Date(),
      createdAt: new Date(),
    });
    setTransactions((prev) => [...prev, tx]);
    setForm({ ...form, amount: "", description: "" });
  };

  const summary = analyzeMoneyFlow({ transactions, categories });
  const alerts = analyzeRules(transactions, categories, rules);

  if (!mounted) return null;

  return (
    <main className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">تعامل زنده با بودجه</h1>

      {/* فرم */}
      <div className="p-4 border rounded-md space-y-2">
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="number"
            placeholder="مقدار (تومان)"
            className="border p-2 rounded flex-1"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">درآمد</option>
            <option value="expense">هزینه</option>
          </select>
          <select
            className="border p-2 rounded"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="توضیح تراکنش"
          className="border p-2 rounded w-full"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={handleAddTransaction}
        >
          اضافه کردن تراکنش
        </button>
      </div>

      {/* تراکنش‌ها */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">تراکنش‌ها</h2>
        {transactions.length === 0 ? (
          <div>هیچ تراکنشی ثبت نشده</div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className="flex justify-between border-b py-1">
              <span>{tx.description || "-"}</span>
              <span>
                {tx.type === "income" ? "💰" : "💸"}{" "}
                {formatMoney(tx.amount.value)} تومان
              </span>
            </div>
          ))
        )}
      </div>

      {/* خلاصه */}
      <div className="space-y-1 mt-4">
        <h2 className="text-xl font-semibold">خلاصه</h2>
        <div>کل درآمد: {formatMoney(summary.totalIncome.value)} تومان</div>
        <div>کل هزینه: {formatMoney(summary.totalExpense.value)} تومان</div>
        <div>بالانس: {formatMoney(summary.balance.value)} تومان</div>
      </div>

      {/* هشدارها */}
      <div className="space-y-1 mt-4">
        <h2 className="text-xl font-semibold">هشدارها و پیشنهادات</h2>
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
