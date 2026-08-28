import type { Transaction, MonthlyBudget, RecurringExpense } from '../types/domain';
import { monthKeyOf, daysInMonth, elapsedDaysInMonth, previousMonthKey } from './date';

export function transactionsForMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter((t) => monthKeyOf(t.date) === monthKey);
}

export function totalSpent(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + t.amountMinorUnits, 0);
}

export function budgetForMonth(budgets: MonthlyBudget[], monthKey: string): number | null {
  const match = budgets.find((b) => b.month === monthKey);
  return match ? match.amountMinorUnits : null;
}

export function remainingBudget(spent: number, budget: number | null): number | null {
  if (budget === null) return null;
  return budget - spent;
}

/** Guards divide-by-zero: a zero or missing budget reads as "no budget set"
 *  rather than an infinite or NaN percentage. */
export function budgetUsagePercent(spent: number, budget: number | null): number | null {
  if (budget === null || budget <= 0) return null;
  return Math.round((spent / budget) * 100);
}

export type BudgetStatus = 'no-budget' | 'normal' | 'warning' | 'critical';

export function budgetStatus(usagePercent: number | null): BudgetStatus {
  if (usagePercent === null) return 'no-budget';
  if (usagePercent >= 100) return 'critical';
  if (usagePercent >= 85) return 'warning';
  return 'normal';
}

/** Average of days that have actually elapsed, not the full month length —
 *  otherwise the first day of a new month shows a misleadingly tiny average. */
export function averageDailySpending(spent: number, monthKey: string): number {
  const elapsed = Math.max(elapsedDaysInMonth(monthKey), 1);
  return Math.round(spent / elapsed);
}

/** Simple linear projection: today's daily average extrapolated across the
 *  full month. Intentionally naive for the MVP — no seasonality modeling. */
export function projectedMonthEndSpending(spent: number, monthKey: string): number {
  const elapsed = Math.max(elapsedDaysInMonth(monthKey), 1);
  const total = daysInMonth(monthKey);
  return Math.round((spent / elapsed) * total);
}

export interface CategoryTotal {
  categoryId: string;
  totalMinorUnits: number;
  percentOfTotal: number;
}

export function categoryTotals(transactions: Transaction[]): CategoryTotal[] {
  const spent = totalSpent(transactions);
  const map = new Map<string, number>();
  for (const t of transactions) {
    map.set(t.categoryId, (map.get(t.categoryId) ?? 0) + t.amountMinorUnits);
  }
  return Array.from(map.entries())
    .map(([categoryId, totalMinorUnits]) => ({
      categoryId,
      totalMinorUnits,
      percentOfTotal: spent > 0 ? Math.round((totalMinorUnits / spent) * 100) : 0,
    }))
    .sort((a, b) => b.totalMinorUnits - a.totalMinorUnits);
}

export function topCategory(transactions: Transaction[]): CategoryTotal | null {
  return categoryTotals(transactions)[0] ?? null;
}

export interface MonthComparison {
  currentMinorUnits: number;
  previousMinorUnits: number;
  differenceMinorUnits: number;
  /** null when the previous month has zero spend — a percent change
   *  against zero is undefined, not "infinity%" or "0%". */
  percentChange: number | null;
}

export function compareMonths(transactions: Transaction[], monthKey: string): MonthComparison {
  const prevKey = previousMonthKey(monthKey);
  const current = totalSpent(transactionsForMonth(transactions, monthKey));
  const previous = totalSpent(transactionsForMonth(transactions, prevKey));
  const difference = current - previous;
  const percentChange = previous > 0 ? Math.round((difference / previous) * 100) : null;
  return { currentMinorUnits: current, previousMinorUnits: previous, differenceMinorUnits: difference, percentChange };
}

/** Expected minor-unit total per calendar month for an active recurring
 *  expense, normalizing weekly/yearly cadences onto a monthly basis. */
export function recurringMonthlyEquivalent(expense: RecurringExpense): number {
  switch (expense.frequency) {
    case 'weekly':
      return Math.round((expense.amountMinorUnits * 52) / 12);
    case 'yearly':
      return Math.round(expense.amountMinorUnits / 12);
    case 'monthly':
    default:
      return expense.amountMinorUnits;
  }
}

export function totalRecurringMonthly(expenses: RecurringExpense[]): number {
  return expenses.filter((e) => e.active).reduce((sum, e) => sum + recurringMonthlyEquivalent(e), 0);
}
