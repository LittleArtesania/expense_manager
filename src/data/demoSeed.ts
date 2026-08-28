import type { ExpenseManagerData, Transaction, RecurringExpense } from '../shared/types/domain';
import { DEFAULT_CATEGORIES } from './seedCategories';
import { currentMonthKey, todayIso } from '../shared/utils/date';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function tx(partial: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction {
  const now = new Date().toISOString();
  return {
    id: `demo_txn_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    ...partial,
  };
}

/** Sample dataset for the free public demo build — never used in the real
 *  product. Dates are relative to "today" (via daysAgo) so the demo looks
 *  current no matter when someone visits it. */
export function createDemoData(): ExpenseManagerData {
  const createdAt = new Date().toISOString();
  const categories = DEFAULT_CATEGORIES.map((c) => ({ ...c, createdAt }));
  const catId = (name: string) => categories.find((c) => c.name === name)!.id;

  const transactions: Transaction[] = [
    tx({ amountMinorUnits: 1250, categoryId: catId('Food & Dining'), date: daysAgo(0), merchant: 'Blue Bottle Coffee', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 4200, categoryId: catId('Groceries'), date: daysAgo(1), merchant: 'Trader Joe\'s', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 1599, categoryId: catId('Subscriptions'), date: daysAgo(2), merchant: 'Netflix', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 3800, categoryId: catId('Transportation'), date: daysAgo(3), merchant: 'Shell', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 8900, categoryId: catId('Shopping'), date: daysAgo(4), merchant: 'Zara', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 2200, categoryId: catId('Food & Dining'), date: daysAgo(5), merchant: 'Chipotle', paymentMethod: 'cash' }),
    tx({ amountMinorUnits: 1500, categoryId: catId('Entertainment'), date: daysAgo(6), merchant: 'AMC Theatres', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 6500, categoryId: catId('Bills & Utilities'), date: daysAgo(7), merchant: 'Pacific Gas & Electric', paymentMethod: 'bank_transfer' }),
    tx({ amountMinorUnits: 3200, categoryId: catId('Groceries'), date: daysAgo(9), merchant: 'Whole Foods', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 950, categoryId: catId('Food & Dining'), date: daysAgo(10), merchant: 'Starbucks', paymentMethod: 'digital_wallet' }),
    tx({ amountMinorUnits: 12000, categoryId: catId('Housing'), date: daysAgo(12), merchant: 'Rent — utilities share', paymentMethod: 'bank_transfer' }),
    tx({ amountMinorUnits: 2750, categoryId: catId('Personal Care'), date: daysAgo(13), merchant: 'Sephora', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 4100, categoryId: catId('Shopping'), date: daysAgo(15), merchant: 'Target', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 1800, categoryId: catId('Food & Dining'), date: daysAgo(16), merchant: 'Sweetgreen', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 5500, categoryId: catId('Health'), date: daysAgo(18), merchant: 'CVS Pharmacy', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 2400, categoryId: catId('Pets'), date: daysAgo(20), merchant: 'Petco', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 3300, categoryId: catId('Groceries'), date: daysAgo(22), merchant: 'Trader Joe\'s', paymentMethod: 'debit_card' }),
    tx({ amountMinorUnits: 999, categoryId: catId('Subscriptions'), date: daysAgo(25), merchant: 'Spotify', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 6700, categoryId: catId('Entertainment'), date: daysAgo(28), merchant: 'Live Nation', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 1450, categoryId: catId('Food & Dining'), date: daysAgo(33), merchant: 'Local Diner', paymentMethod: 'cash' }),
    tx({ amountMinorUnits: 5200, categoryId: catId('Shopping'), date: daysAgo(38), merchant: 'Amazon', paymentMethod: 'credit_card' }),
    tx({ amountMinorUnits: 3900, categoryId: catId('Groceries'), date: daysAgo(41), merchant: 'Whole Foods', paymentMethod: 'debit_card' }),
  ];

  const recurringExpenses: RecurringExpense[] = [
    { id: 'demo_rec_netflix', name: 'Netflix', amountMinorUnits: 1599, categoryId: catId('Subscriptions'), frequency: 'monthly', startDate: daysAgo(2), active: true, createdAt },
    { id: 'demo_rec_spotify', name: 'Spotify', amountMinorUnits: 999, categoryId: catId('Subscriptions'), frequency: 'monthly', startDate: daysAgo(25), active: true, createdAt },
    { id: 'demo_rec_gym', name: 'Gym Membership', amountMinorUnits: 4500, categoryId: catId('Health'), frequency: 'monthly', startDate: daysAgo(18), active: true, createdAt },
  ];

  return {
    schemaVersion: 1,
    settings: { currency: 'USD', onboardingCompleted: true },
    monthlyBudgets: [{ id: 'demo_budget', month: currentMonthKey(), amountMinorUnits: 200000 }],
    categories,
    transactions,
    recurringExpenses,
  };
}

export const isDemoBuild = import.meta.env.VITE_DEMO_MODE === 'true';

// Re-exported for anywhere that needs "today" alongside demo data without
// importing shared/utils/date directly.
export { todayIso };
