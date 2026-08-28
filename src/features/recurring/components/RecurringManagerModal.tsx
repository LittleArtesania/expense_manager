import { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useData } from '../../../app/DataContext';
import { formatCurrency } from '../../../shared/utils/currency';
import { RecurringFormModal } from './RecurringFormModal';
import type { RecurringExpense } from '../../../shared/types/domain';

interface RecurringManagerModalProps {
  open: boolean;
  onClose: () => void;
}

const FREQUENCY_LABEL: Record<RecurringExpense['frequency'], string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export function RecurringManagerModal({ open, onClose }: RecurringManagerModalProps) {
  const { data, setRecurringActive, deleteRecurringExpense } = useData();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<RecurringExpense | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<RecurringExpense | undefined>(undefined);

  return (
    <Modal open={open} onClose={onClose} title="Recurring Expenses">
      {data.recurringExpenses.length === 0 ? (
        <p className="text-sm text-[var(--color-ink-soft)] mb-4">
          Track subscriptions and regular bills here — like Netflix or rent — so their upcoming charges show up on your Dashboard.
        </p>
      ) : (
        <div className="flex flex-col gap-1 max-h-72 overflow-y-auto -mx-1 px-1 mb-4">
          {data.recurringExpenses.map((r) => {
            const category = data.categories.find((c) => c.id === r.categoryId);
            return (
              <div
                key={r.id}
                className={`flex items-center justify-between py-2.5 px-2 rounded-[var(--radius-control)] ${
                  r.active ? '' : 'opacity-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{category?.icon}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-[var(--color-ink)] truncate">{r.name}</p>
                    <p className="text-sm text-[var(--color-ink-soft)]">
                      {formatCurrency(r.amountMinorUnits, data.settings.currency)} · {FREQUENCY_LABEL[r.frequency]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer mr-1">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={r.active}
                      onChange={(e) => setRecurringActive(r.id, e.target.checked)}
                      aria-label={`${r.active ? 'Pause' : 'Resume'} ${r.name}`}
                    />
                    <div className="w-9 h-5 bg-[var(--color-line)] rounded-full peer-checked:bg-[var(--color-bloom)] transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                  </label>
                  <button
                    aria-label={`Edit ${r.name}`}
                    onClick={() => {
                      setEditing(r);
                      setFormOpen(true);
                    }}
                    className="p-1.5 rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    aria-label={`Delete ${r.name}`}
                    onClick={() => setPendingDelete(r)}
                    className="p-1.5 rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="secondary"
        icon={<Plus size={16} />}
        className="w-full"
        onClick={() => {
          setEditing(undefined);
          setFormOpen(true);
        }}
      >
        New recurring expense
      </Button>

      <RecurringFormModal open={formOpen} onClose={() => setFormOpen(false)} editing={editing} />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This stops tracking it as a recurring expense. Past transactions it may have generated stay untouched."
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          if (pendingDelete) deleteRecurringExpense(pendingDelete.id);
          setPendingDelete(undefined);
        }}
      />
    </Modal>
  );
}
