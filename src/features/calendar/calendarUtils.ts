import type { Transaction } from '../../shared/types/domain';
import { daysInMonth } from '../../shared/utils/date';

export interface CalendarDay {
  date: string; // 'YYYY-MM-DD'
  dayOfMonth: number;
  totalMinorUnits: number;
  transactionCount: number;
}

export function buildCalendarDays(transactions: Transaction[], monthKey: string): CalendarDay[] {
  const total = daysInMonth(monthKey);
  const byDate = new Map<string, { total: number; count: number }>();
  for (const t of transactions) {
    if (!t.date.startsWith(monthKey)) continue;
    const entry = byDate.get(t.date) ?? { total: 0, count: 0 };
    entry.total += t.amountMinorUnits;
    entry.count += 1;
    byDate.set(t.date, entry);
  }

  return Array.from({ length: total }, (_, i) => {
    const dayOfMonth = i + 1;
    const date = `${monthKey}-${String(dayOfMonth).padStart(2, '0')}`;
    const entry = byDate.get(date);
    return { date, dayOfMonth, totalMinorUnits: entry?.total ?? 0, transactionCount: entry?.count ?? 0 };
  });
}

/** Weekday (0=Sun) of the 1st of the month, so the grid can start with the
 *  correct leading blanks. */
export function firstWeekdayOfMonth(monthKey: string): number {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).getDay();
}
