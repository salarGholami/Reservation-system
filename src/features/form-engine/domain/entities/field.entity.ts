import { FieldType } from "../value-objects/field-type.vo";
import { FieldId } from "../value-objects/field-id.vo";

export interface BaseField {
  id: FieldId;
  label: string; // برچسب به زبان فارسی
  type: FieldType;
  required: boolean;
}

export interface TextField extends BaseField {
  type: "text";
  minLength?: number;
  maxLength?: number;
}

export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
}

export interface SelectField extends BaseField {
  type: "select";
  options: string[]; // گزینه‌ها به فارسی
}

export type FormField = TextField | NumberField | SelectField;
