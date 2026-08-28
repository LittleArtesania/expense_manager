import { useState } from 'react';
import { MoreVertical, Pencil, Trash2 } from 'lucide-react';
import type { Category, CurrencyCode, Transaction } from '../../../shared/types/domain';
import { formatCurrency } from '../../../shared/utils/currency';

interface TransactionRowProps {
  transaction: Transaction;
  category: Category | undefined;
  currency: CurrencyCode;
  onEdit: () => void;
  onDelete: () => void;
}

export function TransactionRow({ transaction, category, currency, onEdit, onDelete }: TransactionRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between py-3 px-1 border-b border-[var(--color-line)] last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0" aria-hidden>
          {category?.icon ?? '📦'}
        </span>
        <div className="min-w-0">
          <p className="font-medium text-[var(--color-ink)] truncate">
            {transaction.merchant || category?.name || 'Expense'}
          </p>
          <p className="text-sm text-[var(--color-ink-soft)] truncate">
            {category?.name ?? 'Uncategorized'}
            {transaction.note ? ` · ${transaction.note}` : ''}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 pl-2">
        <p className="tabular-amount font-medium text-[var(--color-ink)]">
          -{formatCurrency(transaction.amountMinorUnits, currency)}
        </p>

        <div className="relative">
          <button
            aria-label="Transaction actions"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
          >
            <MoreVertical size={17} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-white border border-[var(--color-line)] rounded-[var(--radius-control)] shadow-[var(--shadow-card)] z-20 overflow-hidden">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-[var(--color-ink)] hover:bg-[var(--color-paper-dim)]"
                >
                  <Pencil size={15} /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-sm text-[var(--color-berry)] hover:bg-[var(--color-berry-tint)]"
                >
                  <Trash2 size={15} /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
