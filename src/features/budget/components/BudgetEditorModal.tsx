import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { FormField, inputClasses } from '../../../shared/ui/FormField';
import { useData } from '../../../app/DataContext';
import { parseAmountToMinorUnits, formatCurrency } from '../../../shared/utils/currency';
import { formatMonthLabel } from '../../../shared/utils/date';

interface BudgetEditorModalProps {
  open: boolean;
  onClose: () => void;
  monthKey: string;
  currentBudget: number | null;
}

export function BudgetEditorModal({ open, onClose, monthKey, currentBudget }: BudgetEditorModalProps) {
  const { data, setBudgetForMonth } = useData();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setAmount(currentBudget !== null ? (currentBudget / 100).toFixed(2) : '');
      setError('');
    }
  }, [open, currentBudget]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const minorUnits = parseAmountToMinorUnits(amount);
    if (minorUnits === null) {
      setError('Enter a budget greater than zero.');
      return;
    }
    setBudgetForMonth(monthKey, minorUnits);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Budget — ${formatMonthLabel(monthKey)}`}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Monthly budget" htmlFor="budget-amount" error={error || undefined}>
          <input
            id="budget-amount"
            inputMode="decimal"
            placeholder={`0.00 ${data.settings.currency}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClasses} tabular-amount text-lg`}
            autoFocus
          />
        </FormField>
        {currentBudget !== null && (
          <p className="text-sm text-[var(--color-ink-soft)] mb-4">
            Current budget: {formatCurrency(currentBudget, data.settings.currency)}
          </p>
        )}
        <Button type="submit" className="w-full">
          Save Budget
        </Button>
      </form>
    </Modal>
  );
}
