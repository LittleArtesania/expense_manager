// ============================================================
// DOMAIN TYPES — the single source of truth for the app's shape.
// All monetary values are stored as integer minor units
// (e.g. $12.50 -> 1250) to avoid floating point drift.
// ============================================================

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'PEN';

export type PaymentMethod =
  | 'cash'
  | 'debit_card'
  | 'credit_card'
  | 'bank_transfer'
  | 'digital_wallet'
  | 'other';

export type RecurringFrequency = 'weekly' | 'monthly' | 'yearly';

export interface Category {
  id: string;
  name: string;
  icon: string; // an emoji or lucide icon name, resolved by the UI layer
  isCustom: boolean;
  /** Archived categories are hidden from pickers but never deleted,
   *  so historical transactions keep a valid reference. */
  archived: boolean;
  createdAt: string; // ISO datetime
}

export interface Transaction {
  id: string;
  amountMinorUnits: number;
  categoryId: string;
  date: string; // ISO date, 'YYYY-MM-DD' — no time component, no timezone drift
  merchant?: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  /** Present when this transaction was generated from a recurring definition. */
  recurringExpenseId?: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface MonthlyBudget {
  id: string;
  month: string; // 'YYYY-MM'
  amountMinorUnits: number;
}

export interface RecurringExpense {
  id: string;
  name: string;
  amountMinorUnits: number;
  categoryId: string;
  frequency: RecurringFrequency;
  startDate: string; // 'YYYY-MM-DD'
  active: boolean;
  paymentMethod?: PaymentMethod;
  createdAt: string;
}

export interface AppSettings {
  currency: CurrencyCode;
  onboardingCompleted: boolean;
}

/** The full shape persisted to localStorage. Bump schemaVersion on any
 *  breaking shape change and add a migration in data/migrations.ts. */
export interface ExpenseManagerData {
  schemaVersion: number;
  settings: AppSettings;
  monthlyBudgets: MonthlyBudget[];
  categories: Category[];
  transactions: Transaction[];
  recurringExpenses: RecurringExpense[];
}
