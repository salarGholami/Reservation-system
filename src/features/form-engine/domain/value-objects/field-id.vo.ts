// جلوگیری از قاطی شدن با string معمولی
export type FieldId = string & { readonly __brand: unique symbol };

/**
 * Factory برای ساخت FieldId به صورت type-safe
 */
export function createFieldId(value: string): FieldId {
  if (!value || value.trim().length === 0) {
    throw new Error("شناسه فیلد معتبر نیست");
  }

  return value as FieldId;
}
