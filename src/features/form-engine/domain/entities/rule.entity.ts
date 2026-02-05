export type Operator = ">" | "<" | "===" | "!==" | "in" | "not-in";

export interface VisibilityRule {
  fieldId: string; // فیلدی که نمایشش کنترل می‌شود
  dependsOn: string; // فیلدی که شرط روی آن اعمال می‌شود
  operator: Operator;
  value: unknown; // مقدار مقایسه
}
