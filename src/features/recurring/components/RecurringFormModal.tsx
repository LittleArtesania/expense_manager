import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { FormField, inputClasses } from '../../../shared/ui/FormField';
import { useData } from '../../../app/DataContext';
import { parseAmountToMinorUnits } from '../../../shared/utils/currency';
import { todayIso } from '../../../shared/utils/date';
import type { RecurringExpense, RecurringFrequency } from '../../../shared/types/domain';

interface RecurringFormModalProps {
  open: boolean;
  onClose: () => void;
  editing?: RecurringExpense;
}

const FREQUENCIES: { value: RecurringFrequency; label: string }[] = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function RecurringFormModal({ open, onClose, editing }: RecurringFormModalProps) {
  const { data, addRecurringExpense, updateRecurringExpense } = useData();
  const activeCategories = data.categories.filter((c) => !c.archived);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id ?? '');
  const [frequency, setFrequency] = useState<RecurringFrequency>('monthly');
  const [startDate, setStartDate] = useState(todayIso());
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    if (editing) {
      setName(editing.name);
      setAmount((editing.amountMinorUnits / 100).toFixed(2));
      setCategoryId(editing.categoryId);
      setFrequency(editing.frequency);
      setStartDate(editing.startDate);
    } else {
      setName('');
      setAmount('');
      setCategoryId(activeCategories[0]?.id ?? '');
      setFrequency('monthly');
      setStartDate(todayIso());
    }
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, editing]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountMinorUnits = parseAmountToMinorUnits(amount);
    if (!name.trim()) {
      setError('Give this recurring expense a name.');
      return;
    }
    if (amountMinorUnits === null) {
      setError('Enter an amount greater than zero.');
      return;
    }
    const payload = { name: name.trim(), amountMinorUnits, categoryId, frequency, startDate, active: true };
    if (editing) {
      updateRecurringExpense(editing.id, payload);
    } else {
      addRecurringExpense(payload);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Recurring Expense' : 'New Recurring Expense'}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Name" htmlFor="recurring-name" error={error || undefined}>
          <input
            id="recurring-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Netflix"
            className={inputClasses}
            autoFocus
          />
        </FormField>

        <FormField label="Amount" htmlFor="recurring-amount">
          <input
            id="recurring-amount"
            inputMode="decimal"
            placeholder={`0.00 ${data.settings.currency}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClasses} tabular-amount`}
          />
        </FormField>

        <FormField label="Category" htmlFor="recurring-category">
          <select
            id="recurring-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={inputClasses}
          >
            {activeCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Frequency" htmlFor="recurring-frequency">
          <select
            id="recurring-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
            className={inputClasses}
          >
            {FREQUENCIES.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Starts on" htmlFor="recurring-start">
          <input
            id="recurring-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={inputClasses}
          />
        </FormField>

        <p className="text-sm text-[var(--color-ink-soft)] mb-4">
          This tracks the expected charge and shows it as upcoming — it won't create transactions automatically.
        </p>

        <Button type="submit" className="w-full">
          {editing ? 'Save Changes' : 'Add Recurring Expense'}
        </Button>
      </form>
    </Modal>
  );
}
