import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ExpenseManagerData,
  Transaction,
  Category,
  MonthlyBudget,
  RecurringExpense,
  CurrencyCode,
} from '../types/domain';
import { loadData, saveData, resetData as resetPersistedData } from '../../data/storage';
import { useToast } from '../ui/Toast';

function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/**
 * The single hook every feature reads and writes through. Nothing outside
 * data/storage.ts and this hook touches localStorage directly, per the
 * project's persistence strategy.
 */
export function useExpenseManagerData() {
  const [data, setData] = useState<ExpenseManagerData>(() => loadData());
  const { showError } = useToast();
  const isFirstRun = useRef(true);

  // Persist on every change. Cheap at this data volume — no debounce needed.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return; // don't re-save the data we just loaded
    }
    const ok = saveData(data);
    if (!ok) {
      showError("Couldn't save your changes — your device storage may be full or private browsing may be blocking it.");
    }
  }, [data, showError]);

  const addTransaction = useCallback((input: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
    const timestamp = nowIso();
    const transaction: Transaction = { ...input, id: generateId('txn'), createdAt: timestamp, updatedAt: timestamp };
    setData((prev) => ({ ...prev, transactions: [transaction, ...prev.transactions] }));
    return transaction;
  }, []);

  const updateTransaction = useCallback((id: string, patch: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowIso() } : t)),
    }));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setData((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) }));
  }, []);

  const addCategory = useCallback((name: string, icon: string) => {
    const category: Category = { id: generateId('cat'), name, icon, isCustom: true, archived: false, createdAt: nowIso() };
    setData((prev) => ({ ...prev, categories: [...prev.categories, category] }));
    return category;
  }, []);

  const renameCategory = useCallback((id: string, name: string, icon?: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === id ? { ...c, name, icon: icon ?? c.icon } : c)),
    }));
  }, []);

  /** Categories with existing transactions are archived, never deleted,
   *  so historical spending data always resolves to a valid category. */
  const removeCategory = useCallback((id: string) => {
    setData((prev) => {
      const hasHistory = prev.transactions.some((t) => t.categoryId === id);
      if (hasHistory) {
        return { ...prev, categories: prev.categories.map((c) => (c.id === id ? { ...c, archived: true } : c)) };
      }
      return { ...prev, categories: prev.categories.filter((c) => c.id !== id) };
    });
  }, []);

  const setBudgetForMonth = useCallback((month: string, amountMinorUnits: number) => {
    setData((prev) => {
      const existing = prev.monthlyBudgets.find((b) => b.month === month);
      if (existing) {
        return {
          ...prev,
          monthlyBudgets: prev.monthlyBudgets.map((b) => (b.month === month ? { ...b, amountMinorUnits } : b)),
        };
      }
      const budget: MonthlyBudget = { id: generateId('bud'), month, amountMinorUnits };
      return { ...prev, monthlyBudgets: [...prev.monthlyBudgets, budget] };
    });
  }, []);

  const addRecurringExpense = useCallback((input: Omit<RecurringExpense, 'id' | 'createdAt'>) => {
    const expense: RecurringExpense = { ...input, id: generateId('rec'), createdAt: nowIso() };
    setData((prev) => ({ ...prev, recurringExpenses: [...prev.recurringExpenses, expense] }));
    return expense;
  }, []);

  const setRecurringActive = useCallback((id: string, active: boolean) => {
    setData((prev) => ({
      ...prev,
      recurringExpenses: prev.recurringExpenses.map((r) => (r.id === id ? { ...r, active } : r)),
    }));
  }, []);

  const updateRecurringExpense = useCallback((id: string, patch: Partial<Omit<RecurringExpense, 'id' | 'createdAt'>>) => {
    setData((prev) => ({
      ...prev,
      recurringExpenses: prev.recurringExpenses.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const deleteRecurringExpense = useCallback((id: string) => {
    setData((prev) => ({ ...prev, recurringExpenses: prev.recurringExpenses.filter((r) => r.id !== id) }));
  }, []);

  const setCurrency = useCallback((currency: CurrencyCode) => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, currency } }));
  }, []);

  const completeOnboarding = useCallback(() => {
    setData((prev) => ({ ...prev, settings: { ...prev.settings, onboardingCompleted: true } }));
  }, []);

  const replaceAllData = useCallback((next: ExpenseManagerData) => {
    setData(next);
  }, []);

  const resetAllData = useCallback(() => {
    setData(resetPersistedData());
  }, []);

  return {
    data,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCategory,
    renameCategory,
    removeCategory,
    setBudgetForMonth,
    addRecurringExpense,
    setRecurringActive,
    updateRecurringExpense,
    deleteRecurringExpense,
    setCurrency,
    completeOnboarding,
    replaceAllData,
    resetAllData,
  };
}
