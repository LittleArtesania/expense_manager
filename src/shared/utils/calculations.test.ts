import { describe, it, expect } from 'vitest';
import {
  totalSpent,
  budgetUsagePercent,
  budgetStatus,
  averageDailySpending,
  projectedMonthEndSpending,
  categoryTotals,
  compareMonths,
  recurringMonthlyEquivalent,
} from './calculations';
import type { Transaction, RecurringExpense } from '../types/domain';

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? Math.random().toString(36),
    amountMinorUnits: 1000,
    categoryId: 'cat_food',
    date: '2026-08-15',
    createdAt: '2026-08-15T00:00:00.000Z',
    updatedAt: '2026-08-15T00:00:00.000Z',
    ...overrides,
  };
}

describe('totalSpent', () => {
  it('sums zero transactions to zero', () => {
    expect(totalSpent([])).toBe(0);
  });
  it('sums multiple transactions', () => {
    expect(totalSpent([tx({ amountMinorUnits: 500 }), tx({ amountMinorUnits: 250 })])).toBe(750);
  });
});

describe('budgetUsagePercent', () => {
  it('returns null when there is no budget', () => {
    expect(budgetUsagePercent(1000, null)).toBeNull();
  });
  it('returns null when budget is zero (avoids divide-by-zero)', () => {
    expect(budgetUsagePercent(1000, 0)).toBeNull();
  });
  it('computes a normal percentage', () => {
    expect(budgetUsagePercent(500, 1000)).toBe(50);
  });
});

describe('budgetStatus', () => {
  it('is no-budget with no percent', () => {
    expect(budgetStatus(null)).toBe('no-budget');
  });
  it('is normal under 85%', () => {
    expect(budgetStatus(60)).toBe('normal');
  });
  it('is warning between 85% and 99%', () => {
    expect(budgetStatus(90)).toBe('warning');
  });
  it('is critical at or above 100%', () => {
    expect(budgetStatus(100)).toBe('critical');
    expect(budgetStatus(140)).toBe('critical');
  });
});

describe('averageDailySpending', () => {
  it('handles zero spend', () => {
    expect(averageDailySpending(0, '2026-08')).toBe(0);
  });
});

describe('projectedMonthEndSpending', () => {
  it('projects flat spending across a 28-day February (non-leap year)', () => {
    // 2026 is not a leap year — 28 days in Feb.
    // Pretend the whole month elapsed by using a past month.
    const projection = projectedMonthEndSpending(2800, '2026-02');
    expect(projection).toBe(2800); // fully elapsed past month == actual spend
  });
});

describe('categoryTotals', () => {
  it('returns an empty array for no transactions', () => {
    expect(categoryTotals([])).toEqual([]);
  });
  it('groups and sorts by amount descending, percentages sum near 100', () => {
    const totals = categoryTotals([
      tx({ categoryId: 'cat_food', amountMinorUnits: 700 }),
      tx({ categoryId: 'cat_shopping', amountMinorUnits: 300 }),
    ]);
    expect(totals[0].categoryId).toBe('cat_food');
    expect(totals[0].percentOfTotal).toBe(70);
    expect(totals[1].percentOfTotal).toBe(30);
  });
});

describe('compareMonths', () => {
  it('returns null percentChange when previous month had zero spend', () => {
    const result = compareMonths([tx({ date: '2026-08-10', amountMinorUnits: 500 })], '2026-08');
    expect(result.previousMinorUnits).toBe(0);
    expect(result.percentChange).toBeNull();
  });
  it('computes a decrease correctly', () => {
    const transactions = [
      tx({ date: '2026-08-10', amountMinorUnits: 500 }),
      tx({ date: '2026-07-10', amountMinorUnits: 1000 }),
    ];
    const result = compareMonths(transactions, '2026-08');
    expect(result.differenceMinorUnits).toBe(-500);
    expect(result.percentChange).toBe(-50);
  });
});

describe('recurringMonthlyEquivalent', () => {
  const base: RecurringExpense = {
    id: 'r1',
    name: 'Netflix',
    amountMinorUnits: 1599,
    categoryId: 'cat_subscriptions',
    frequency: 'monthly',
    startDate: '2026-01-01',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };
  it('passes monthly through unchanged', () => {
    expect(recurringMonthlyEquivalent(base)).toBe(1599);
  });
  it('normalizes weekly to a monthly equivalent (52/12 weeks)', () => {
    expect(recurringMonthlyEquivalent({ ...base, frequency: 'weekly', amountMinorUnits: 1000 })).toBe(
      Math.round((1000 * 52) / 12)
    );
  });
  it('normalizes yearly to a monthly equivalent', () => {
    expect(recurringMonthlyEquivalent({ ...base, frequency: 'yearly', amountMinorUnits: 12000 })).toBe(1000);
  });
});
