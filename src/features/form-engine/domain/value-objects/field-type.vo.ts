export const FIELD_TYPES = ["text", "number", "select"] as const;

export type FieldType = (typeof FIELD_TYPES)[number];
