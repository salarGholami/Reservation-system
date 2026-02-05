import { FormField } from "./field.entity";
import { VisibilityRule } from "./rule.entity";

export interface Form {
  id: string;
  name: string; // نام فرم به فارسی
  fields: FormField[];
  rules?: VisibilityRule[];
}
