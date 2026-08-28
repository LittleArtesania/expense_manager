import { createContext, useContext } from 'react';
import type { useExpenseManagerData } from '../shared/hooks/useExpenseManagerData';

type Store = ReturnType<typeof useExpenseManagerData>;

export const DataContext = createContext<Store | null>(null);

export function useData(): Store {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataContext.Provider (AppShell)');
  return ctx;
}
