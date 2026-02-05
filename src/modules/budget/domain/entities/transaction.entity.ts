// src/modules/budget/domain/entities/transaction.entity.ts

import { Money } from "../value-objects/money.vo";

export type TransactionType = "income" | "expense";

export interface TransactionProps {
  id: string;
  amount: Money;
  type: TransactionType;
  categoryId: string;
  occurredAt: Date;
  description: string;
  createdAt: Date;
}

export class Transaction {
  public readonly id: string;
  public readonly amount: Money;
  public readonly type: TransactionType;
  public readonly categoryId: string;
  public readonly occurredAt: Date;
  public readonly description: string;
  public readonly createdAt: Date;

  private constructor(props: TransactionProps) {
    this.id = props.id;
    this.amount = props.amount;
    this.type = props.type;
    this.categoryId = props.categoryId;
    this.occurredAt = new Date(props.occurredAt);
    this.description = props.description;
    this.createdAt = new Date(props.createdAt);
  }

  static create(props: TransactionProps): Transaction {
    if (!props.id) throw new Error("Transaction must have id");
    if (!props.categoryId) throw new Error("Transaction must have category");
    if (!props.description.trim())
      throw new Error("Transaction must have description");

    return new Transaction(props);
  }
}
