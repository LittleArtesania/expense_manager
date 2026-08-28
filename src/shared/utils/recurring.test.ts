import { describe, it, expect } from 'vitest';
import { nextOccurrenceOnOrAfter, upcomingOccurrences } from './recurring';
import type { RecurringExpense } from '../types/domain';

describe('nextOccurrenceOnOrAfter', () => {
  it('returns the start date itself when it is still in the future', () => {
    expect(nextOccurrenceOnOrAfter('2026-09-01', 'monthly', '2026-08-25')).toBe('2026-09-01');
  });

  it('advances weekly recurrences by whole weeks', () => {
    // Aug 25 2026 is a Tuesday; a weekly charge starting that day...
    expect(nextOccurrenceOnOrAfter('2026-08-25', 'weekly', '2026-09-01')).toBe('2026-09-01');
    expect(nextOccurrenceOnOrAfter('2026-08-25', 'weekly', '2026-09-03')).toBe('2026-09-08');
  });

  it('advances monthly recurrences and lands on the same day of month', () => {
    expect(nextOccurrenceOnOrAfter('2026-06-15', 'monthly', '2026-08-25')).toBe('2026-09-15');
  });

  it('clamps a 31st-of-month recurrence into shorter months instead of overflowing', () => {
    // Jan 31 recurring monthly -> Feb should clamp to Feb 28 (2026 is not a leap year)
    expect(nextOccurrenceOnOrAfter('2026-01-31', 'monthly', '2026-02-01')).toBe('2026-02-28');
  });

  it('clamps a Feb 29 yearly recurrence to Feb 28 in a non-leap year', () => {
    // Started on a leap day in 2024; asking for the next occurrence on/after 2026-01-01
    expect(nextOccurrenceOnOrAfter('2024-02-29', 'yearly', '2026-01-01')).toBe('2026-02-28');
  });
});

describe('upcomingOccurrences', () => {
  const base: RecurringExpense = {
    id: 'r1',
    name: 'Netflix',
    amountMinorUnits: 1599,
    categoryId: 'cat_subscriptions',
    frequency: 'monthly',
    startDate: '2026-01-15',
    active: true,
    createdAt: '2026-01-01T00:00:00.000Z',
  };

  it('excludes inactive recurring expenses', () => {
    const result = upcomingOccurrences([{ ...base, active: false }], '2026-08-25');
    expect(result).toEqual([]);
  });

  it('sorts multiple recurring expenses by soonest date', () => {
    const result = upcomingOccurrences(
      [
        { ...base, id: 'r1', startDate: '2026-09-20' },
        { ...base, id: 'r2', startDate: '2026-09-01' },
      ],
      '2026-08-25'
    );
    expect(result.map((r) => r.expense.id)).toEqual(['r2', 'r1']);
  });
});
