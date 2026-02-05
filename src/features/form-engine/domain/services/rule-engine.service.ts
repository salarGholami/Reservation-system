import { VisibilityRule } from "../entities/rule.entity";

/**
 * ارزیابی یک Rule منفرد برای visibility
 */
export function evaluateVisibilityRule(
  rule: VisibilityRule,
  formState: Record<string, unknown>,
): boolean {
  const targetValue = formState[rule.dependsOn];

  switch (rule.operator) {
    case ">":
      return Number(targetValue) > Number(rule.value);
    case "<":
      return Number(targetValue) < Number(rule.value);
    case "===":
      return targetValue === rule.value;
    case "!==":
      return targetValue !== rule.value;
    case "in":
      return Array.isArray(rule.value) && rule.value.includes(targetValue);
    case "not-in":
      return Array.isArray(rule.value) && !rule.value.includes(targetValue);
    default:
      return false;
  }
}

/**
 * ارزیابی همه Rule ها و برگرداندن شناسه فیلدهایی که باید نمایش داده شوند
 */
export function evaluateAllRules(
  rules: VisibilityRule[],
  formState: Record<string, unknown>,
): string[] {
  const visibleFieldIds: string[] = [];

  rules.forEach((rule) => {
    if (evaluateVisibilityRule(rule, formState)) {
      visibleFieldIds.push(rule.fieldId);
    }
  });

  return visibleFieldIds;
}
