import { describe, it, expect } from 'vitest';
import { generateInsights } from './insights';
import type { Transaction, Category } from '../types/domain';

const categories: Category[] = [
  { id: 'cat_food', name: 'Food & Dining', icon: '🍔', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_shopping', name: 'Shopping', icon: '🛍️', isCustom: false, archived: false, createdAt: '' },
];

function tx(overrides: Partial<Transaction>): Transaction {
  return {
    id: overrides.id ?? Math.random().toString(36),
    amountMinorUnits: 1000,
    categoryId: 'cat_food',
    date: '2026-08-05',
    createdAt: '2026-08-05T00:00:00.000Z',
    updatedAt: '2026-08-05T00:00:00.000Z',
    ...overrides,
  };
}

describe('generateInsights', () => {
  it('returns nothing for an empty month', () => {
    expect(generateInsights({ transactions: [], categories, monthKey: '2026-08', budgetMinorUnits: null, currency: 'USD' })).toEqual([]);
  });

  it('does not claim a "biggest category" pattern from a single transaction', () => {
    const result = generateInsights({
      transactions: [tx({})],
      categories,
      monthKey: '2026-08',
      budgetMinorUnits: null,
      currency: 'USD',
    });
    expect(result.find((i) => i.id === 'top-category')).toBeUndefined();
  });

  it('surfaces a top-category insight once there is enough signal', () => {
    const result = generateInsights({
      transactions: [
        tx({ id: '1', categoryId: 'cat_food', amountMinorUnits: 3000 }),
        tx({ id: '2', categoryId: 'cat_food', amountMinorUnits: 3000 }),
        tx({ id: '3', categoryId: 'cat_shopping', amountMinorUnits: 500 }),
      ],
      categories,
      monthKey: '2026-08',
      budgetMinorUnits: null,
      currency: 'USD',
    });
    expect(result.find((i) => i.id === 'top-category')).toBeDefined();
  });
});
