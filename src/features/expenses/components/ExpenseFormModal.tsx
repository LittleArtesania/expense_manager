import { useEffect, useState } from 'react';
import { Modal } from '../../../shared/ui/Modal';
import { FormField, inputClasses } from '../../../shared/ui/FormField';
import { Button } from '../../../shared/ui/Button';
import { useData } from '../../../app/DataContext';
import { parseAmountToMinorUnits } from '../../../shared/utils/currency';
import { todayIso } from '../../../shared/utils/date';
import type { PaymentMethod, Transaction } from '../../../shared/types/domain';

interface ExpenseFormModalProps {
  open: boolean;
  onClose: () => void;
  /** When present, the modal edits this transaction instead of creating one. */
  transaction?: Transaction;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'digital_wallet', label: 'Digital Wallet' },
  { value: 'other', label: 'Other' },
];

function centsToInput(minorUnits: number): string {
  return (minorUnits / 100).toFixed(2);
}

export function ExpenseFormModal({ open, onClose, transaction }: ExpenseFormModalProps) {
  const { data, addTransaction, updateTransaction } = useData();
  const activeCategories = data.categories.filter((c) => !c.archived);
  const isEditing = Boolean(transaction);

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(activeCategories[0]?.id ?? '');
  const [date, setDate] = useState(todayIso());
  const [merchant, setMerchant] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [error, setError] = useState('');

  // Re-seed the form whenever the modal opens (either fresh, or with the
  // transaction being edited) so stale state from a previous open never leaks.
  useEffect(() => {
    if (!open) return;
    if (transaction) {
      setAmount(centsToInput(transaction.amountMinorUnits));
      setCategoryId(transaction.categoryId);
      setDate(transaction.date);
      setMerchant(transaction.merchant ?? '');
      setNote(transaction.note ?? '');
      setPaymentMethod(transaction.paymentMethod ?? '');
    } else {
      setAmount('');
      setCategoryId(activeCategories[0]?.id ?? '');
      setDate(todayIso());
      setMerchant('');
      setNote('');
      setPaymentMethod('');
    }
    setError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transaction]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountMinorUnits = parseAmountToMinorUnits(amount);
    if (amountMinorUnits === null) {
      setError('Enter an amount greater than zero.');
      return;
    }
    if (!categoryId) {
      setError('Choose a category.');
      return;
    }

    const payload = {
      amountMinorUnits,
      categoryId,
      date,
      merchant: merchant.trim() || undefined,
      note: note.trim() || undefined,
      paymentMethod: paymentMethod || undefined,
    };

    if (isEditing && transaction) {
      updateTransaction(transaction.id, payload);
    } else {
      addTransaction(payload);
    }
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={isEditing ? 'Edit Expense' : 'Add Expense'}>
      <form onSubmit={handleSubmit} noValidate>
        <FormField label="Amount" htmlFor="expense-amount" error={error || undefined}>
          <input
            id="expense-amount"
            inputMode="decimal"
            placeholder={`0.00 ${data.settings.currency}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={`${inputClasses} tabular-amount text-lg`}
            autoFocus
          />
        </FormField>

        <FormField label="Category" htmlFor="expense-category">
          <select
            id="expense-category"
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

        <FormField label="Date" htmlFor="expense-date">
          <input
            id="expense-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Merchant" htmlFor="expense-merchant" optional>
          <input
            id="expense-merchant"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            placeholder="Starbucks"
            className={inputClasses}
          />
        </FormField>

        <FormField label="Payment method" htmlFor="expense-payment" optional>
          <select
            id="expense-payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod | '')}
            className={inputClasses}
          >
            <option value="">Not specified</option>
            {PAYMENT_METHODS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Note" htmlFor="expense-note" optional>
          <input
            id="expense-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Coffee with friends"
            className={inputClasses}
          />
        </FormField>

        <Button type="submit" className="w-full mt-2">
          {isEditing ? 'Save Changes' : 'Save Expense'}
        </Button>
      </form>
    </Modal>
  );
}
