// src/modules/budget/hooks/useBudgetStorage.ts
"use client";

import { useState, useEffect } from "react";
import { Transaction } from "../index";

const STORAGE_KEY = "budget_transactions_v1";

export function useBudgetStorage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // ---------- بارگذاری اولیه ----------
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed: Transaction[] = JSON.parse(stored);
        setTransactions(parsed.map((tx) => Transaction.create(tx)));
      } catch {
        console.warn("Failed to parse stored transactions");
      }
    }
  }, []);

  // ---------- ذخیره خودکار ----------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  return { transactions, setTransactions };
}
