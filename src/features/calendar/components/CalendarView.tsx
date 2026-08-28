import { useMemo, useState } from 'react';
import { useData } from '../../../app/DataContext';
import { Card } from '../../../shared/ui/Card';
import { formatCurrency } from '../../../shared/utils/currency';
import { currentMonthKey } from '../../../shared/utils/date';
import { buildCalendarDays, firstWeekdayOfMonth } from '../calendarUtils';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

/** Buckets a day's spend into a visual intensity step, relative to the
 *  month's own busiest day — so the calendar stays legible whether the
 *  user typically spends $20/day or $200/day. */
function intensityStyle(totalMinorUnits: number, maxMinorUnits: number): React.CSSProperties {
  if (totalMinorUnits === 0 || maxMinorUnits === 0) return { backgroundColor: 'var(--color-paper-dim)' };
  const ratio = totalMinorUnits / maxMinorUnits;
  const step = ratio > 0.66 ? 0.9 : ratio > 0.33 ? 0.55 : 0.28;
  return { backgroundColor: `color-mix(in srgb, var(--color-bloom) ${Math.round(step * 100)}%, white)` };
}

export function CalendarView() {
  const { data } = useData();
  const monthKey = currentMonthKey();
  const days = useMemo(() => buildCalendarDays(data.transactions, monthKey), [data.transactions, monthKey]);
  const leadingBlanks = firstWeekdayOfMonth(monthKey);
  const maxSpend = Math.max(...days.map((d) => d.totalMinorUnits), 0);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedDay = days.find((d) => d.date === selectedDate);
  const selectedTransactions = selectedDate ? data.transactions.filter((t) => t.date === selectedDate) : [];

  return (
    <Card>
      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {WEEKDAY_LABELS.map((w, i) => (
          <div key={i} className="text-center text-xs text-[var(--color-ink-soft)]">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {days.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(day.date === selectedDate ? null : day.date)}
            aria-label={`${day.date}: ${day.transactionCount} transactions`}
            className={`aspect-square rounded-[0.5rem] text-xs font-medium flex items-center justify-center transition-shadow
              ${selectedDate === day.date ? 'ring-2 ring-[var(--color-bloom-deep)]' : ''}`}
            style={intensityStyle(day.totalMinorUnits, maxSpend)}
          >
            <span className={day.totalMinorUnits > maxSpend * 0.66 ? 'text-white' : 'text-[var(--color-ink)]'}>
              {day.dayOfMonth}
            </span>
          </button>
        ))}
      </div>

      {selectedDay && (
        <div className="mt-4 pt-4 border-t border-[var(--color-line)]">
          {selectedDay.transactionCount === 0 ? (
            <p className="text-sm text-[var(--color-ink-soft)]">No expenses on {selectedDate}.</p>
          ) : (
            <>
              <p className="text-sm text-[var(--color-ink-soft)] mb-2">
                {selectedDay.transactionCount} transaction{selectedDay.transactionCount > 1 ? 's' : ''} ·{' '}
                {formatCurrency(selectedDay.totalMinorUnits, data.settings.currency)}
              </p>
              <div className="flex flex-col gap-1.5">
                {selectedTransactions.map((t) => {
                  const category = data.categories.find((c) => c.id === t.categoryId);
                  return (
                    <div key={t.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-[var(--color-ink)]">
                        <span>{category?.icon}</span>
                        {t.merchant || category?.name}
                      </span>
                      <span className="tabular-amount text-[var(--color-ink-soft)]">
                        {formatCurrency(t.amountMinorUnits, data.settings.currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
