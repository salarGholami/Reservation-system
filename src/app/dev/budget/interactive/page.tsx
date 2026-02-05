// src/app/dev/budget/interactive/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Money, Transaction, Category, BudgetRule } from "@/modules/budget";
import { analyzeMoneyFlow } from "@/modules/budget/application/analyze-money-flow.usecase";
import { evaluateRules } from "@/modules/budget/application/evaluate-rules.usecase";

// ---------- Hook برای مدیریت persistence ----------
function useBudgetStorage() {
  const STORAGE_KEY = "budget_transactions_v2";
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // بارگذاری از localStorage و بازسازی کلاس‌ها
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(
          parsed.map((tx: any) =>
            Transaction.create({
              ...tx,
              amount: Money.create(Number(tx.amount)), // بازسازی Money
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

  // ذخیره به localStorage (فقط داده‌های خام)
  useEffect(() => {
    const raw = transactions.map((tx) => ({
      id: tx.id,
      amount: tx.amount.value, // فقط عدد
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

export default function BudgetInteractivePage() {
  // ---------- دسته‌ها ----------
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

  // ---------- قوانین ----------
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

  // ---------- State ----------
  const { transactions, setTransactions } = useBudgetStorage();
  const [form, setForm] = useState({
    amount: "",
    type: "income",
    categoryId: "c1",
    description: "",
  });
  const [mounted, setMounted] = useState(false);

  // Hydration-safe
  useEffect(() => setMounted(true), []);

  // ---------- Helper برای فرمت عدد فارسی ----------
  const formatMoney = (value: number) => {
    if (!mounted) return value.toString();
    return new Intl.NumberFormat("fa-IR").format(value);
  };

  // ---------- افزودن تراکنش ----------
  const handleAddTransaction = () => {
    if (!form.amount || Number(form.amount) <= 0) return;
    const tx = Transaction.create({
      id: `t${Date.now()}`, // فقط روی Client
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

  // ---------- تحلیل جریان پول و هشدارها ----------
  const summary = analyzeMoneyFlow({ transactions, categories });
  const alerts = evaluateRules({ transactions, categories, rules });

  if (!mounted) return null; // SSR-safe

  return (
    <main className="p-8 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">تعامل زنده با بودجه</h1>

      {/* ---------- فرم اضافه کردن تراکنش ---------- */}
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

      {/* ---------- لیست تراکنش‌ها ---------- */}
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

      {/* ---------- خلاصه ---------- */}
      <div className="space-y-1 mt-4">
        <h2 className="text-xl font-semibold">خلاصه</h2>
        <div>کل درآمد: {formatMoney(summary.totalIncome.value)} تومان</div>
        <div>کل هزینه: {formatMoney(summary.totalExpense.value)} تومان</div>
        <div>بالانس: {formatMoney(summary.balance.value)} تومان</div>
      </div>

      {/* ---------- هشدارها ---------- */}
      <div className="space-y-1 mt-4">
        <h2 className="text-xl font-semibold">هشدارها</h2>
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
