import { Repeat } from 'lucide-react';
import { useData } from '../../../app/DataContext';
import { Card } from '../../../shared/ui/Card';
import { formatCurrency } from '../../../shared/utils/currency';
import { todayIso } from '../../../shared/utils/date';
import { totalRecurringMonthly } from '../../../shared/utils/calculations';
import { upcomingOccurrences } from '../../../shared/utils/recurring';

export function UpcomingRecurringCard() {
  const { data } = useData();
  if (data.recurringExpenses.length === 0) return null;

  const monthlyTotal = totalRecurringMonthly(data.recurringExpenses);
  const upcoming = upcomingOccurrences(data.recurringExpenses, todayIso()).slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-[var(--color-ink-soft)] flex items-center gap-1.5">
          <Repeat size={14} /> Recurring
        </p>
        <p className="text-sm tabular-amount text-[var(--color-ink-soft)]">
          {formatCurrency(monthlyTotal, data.settings.currency)}/mo
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        {upcoming.map(({ expense, date }) => {
          const category = data.categories.find((c) => c.id === expense.categoryId);
          return (
            <div key={expense.id} className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[var(--color-ink)]">
                <span>{category?.icon}</span>
                {expense.name}
              </span>
              <span className="flex items-center gap-3">
                <span className="text-[var(--color-ink-soft)]">{date}</span>
                <span className="tabular-amount text-[var(--color-ink)]">
                  {formatCurrency(expense.amountMinorUnits, data.settings.currency)}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
