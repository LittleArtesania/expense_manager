import { useMemo, useState } from 'react';
import type { Transaction } from '../../../shared/types/domain';
import { monthKeyOf } from '../../../shared/utils/date';

export type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export interface TransactionFilters {
  month: string; // '' = all months
  categoryId: string; // '' = all categories
  search: string;
  sort: SortOption;
}

const DEFAULT_FILTERS: TransactionFilters = {
  month: '',
  categoryId: '',
  search: '',
  sort: 'newest',
};

export function useTransactionFilters(transactions: Transaction[]) {
  const [filters, setFilters] = useState<TransactionFilters>(DEFAULT_FILTERS);

  const availableMonths = useMemo(() => {
    const months = new Set(transactions.map((t) => monthKeyOf(t.date)));
    return Array.from(months).sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    let result = transactions;

    if (filters.month) {
      result = result.filter((t) => monthKeyOf(t.date) === filters.month);
    }
    if (filters.categoryId) {
      result = result.filter((t) => t.categoryId === filters.categoryId);
    }
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (t) => t.merchant?.toLowerCase().includes(q) || t.note?.toLowerCase().includes(q)
      );
    }

    const sorted = [...result].sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt);
        case 'oldest':
          return a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt);
        case 'highest':
          return b.amountMinorUnits - a.amountMinorUnits;
        case 'lowest':
          return a.amountMinorUnits - b.amountMinorUnits;
      }
    });

    return sorted;
  }, [transactions, filters]);

  function updateFilter<K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return { filters, updateFilter, filtered, availableMonths, resetFilters: () => setFilters(DEFAULT_FILTERS) };
}
