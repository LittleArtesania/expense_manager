import { useMemo, useState } from 'react';
import { Receipt } from 'lucide-react';
import { useData } from '../../app/DataContext';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { ConfirmDialog } from '../../shared/ui/ConfirmDialog';
import { relativeDayLabel } from '../../shared/utils/date';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { TransactionFilterBar } from './components/TransactionFilterBar';
import { TransactionRow } from './components/TransactionRow';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import type { Transaction } from '../../shared/types/domain';

export function TransactionsPage() {
  const { data, deleteTransaction } = useData();
  const { filters, updateFilter, filtered, availableMonths } = useTransactionFilters(data.transactions);
  const activeCategories = data.categories.filter((c) => !c.archived);

  const [editing, setEditing] = useState<Transaction | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Transaction | undefined>(undefined);

  const groups = useMemo(() => {
    // Preserves the sort order already applied by useTransactionFilters —
    // grouping here only clusters adjacent same-day rows under one label.
    const map = new Map<string, Transaction[]>();
    for (const t of filtered) {
      const label = filters.sort === 'newest' || filters.sort === 'oldest' ? relativeDayLabel(t.date) : t.date;
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(t);
    }
    return Array.from(map.entries());
  }, [filtered, filters.sort]);

  if (data.transactions.length === 0) {
    return (
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-5">Transactions</h1>
        <Card>
          <EmptyState
            icon={<Receipt size={28} />}
            title="Nothing recorded yet"
            description="Every expense you add will show up here, organized and easy to search."
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-4">Transactions</h1>

      <TransactionFilterBar
        filters={filters}
        onChange={updateFilter}
        availableMonths={availableMonths}
        categories={activeCategories}
      />

      {filtered.length === 0 ? (
        <Card>
          <EmptyState title="No transactions match these filters" description="Try a different month, category, or search term." />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {groups.map(([label, items]) => (
            <div key={label}>
              <p className="text-sm font-medium text-[var(--color-ink-soft)] mb-1.5 px-1">{label}</p>
              <Card className="p-2">
                {items.map((t) => (
                  <TransactionRow
                    key={t.id}
                    transaction={t}
                    category={data.categories.find((c) => c.id === t.categoryId)}
                    currency={data.settings.currency}
                    onEdit={() => setEditing(t)}
                    onDelete={() => setPendingDelete(t)}
                  />
                ))}
              </Card>
            </div>
          ))}
        </div>
      )}

      <ExpenseFormModal open={Boolean(editing)} onClose={() => setEditing(undefined)} transaction={editing} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this expense?"
        description={`This will permanently remove ${pendingDelete?.merchant || 'this expense'} from your history.`}
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          if (pendingDelete) deleteTransaction(pendingDelete.id);
          setPendingDelete(undefined);
        }}
      />
    </div>
  );
}
