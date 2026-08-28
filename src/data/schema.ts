import type { ExpenseManagerData } from '../shared/types/domain';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/** Hand-rolled structural validation — no schema library needed for a
 *  shape this small, and it keeps the dependency list minimal. */
export function validateExpenseManagerData(input: unknown): ValidationResult {
  const errors: string[] = [];

  if (typeof input !== 'object' || input === null) {
    return { valid: false, errors: ['File does not contain a valid JSON object.'] };
  }
  const data = input as Record<string, unknown>;

  if (typeof data.schemaVersion !== 'number') errors.push('Missing or invalid schemaVersion.');
  if (typeof data.settings !== 'object' || data.settings === null) errors.push('Missing settings.');
  if (!Array.isArray(data.categories)) errors.push('Missing categories array.');
  if (!Array.isArray(data.transactions)) errors.push('Missing transactions array.');
  if (!Array.isArray(data.monthlyBudgets)) errors.push('Missing monthlyBudgets array.');
  if (!Array.isArray(data.recurringExpenses)) errors.push('Missing recurringExpenses array.');

  if (Array.isArray(data.transactions)) {
    data.transactions.forEach((t: any, i: number) => {
      if (typeof t.amountMinorUnits !== 'number' || t.amountMinorUnits < 0) {
        errors.push(`Transaction #${i + 1} has an invalid amount.`);
      }
      if (typeof t.categoryId !== 'string' || !t.categoryId) {
        errors.push(`Transaction #${i + 1} is missing a category.`);
      }
      if (typeof t.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(t.date)) {
        errors.push(`Transaction #${i + 1} has an invalid date.`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}

export function exportToJson(data: ExpenseManagerData): string {
  return JSON.stringify(data, null, 2);
}

export function parseImportedJson(raw: string): { data?: ExpenseManagerData; result: ValidationResult } {
  try {
    const parsed = JSON.parse(raw);
    const result = validateExpenseManagerData(parsed);
    return { data: result.valid ? (parsed as ExpenseManagerData) : undefined, result };
  } catch {
    return { result: { valid: false, errors: ['File is not valid JSON.'] } };
  }
}
