import type { RecurringExpense } from '../types/domain';

function parseISO(date: string): { y: number; m: number; d: number } {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d };
}

function toISO(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function addDays(date: string, days: number): string {
  const { y, m, d } = parseISO(date);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return toISO(dt.getFullYear(), dt.getMonth() + 1, dt.getDate());
}

/** Adds whole months, clamping the day to the last day of the target month
 *  instead of letting it roll into the next month (Date's default
 *  behavior) — so "Jan 31 + 1 month" lands on Feb 28/29, not Mar 3. */
function addMonthsClamped(date: string, months: number): string {
  const { y, m, d } = parseISO(date);
  const total = y * 12 + (m - 1) + months;
  const newY = Math.floor(total / 12);
  const newM = (((total % 12) + 12) % 12) + 1;
  const lastDayOfTargetMonth = new Date(newY, newM, 0).getDate();
  return toISO(newY, newM, Math.min(d, lastDayOfTargetMonth));
}

function daysBetween(a: string, b: string): number {
  const { y: y1, m: m1, d: d1 } = parseISO(a);
  const { y: y2, m: m2, d: d2 } = parseISO(b);
  const ms = new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
  return Math.round(ms / 86_400_000);
}

/** The next date on or after `referenceDate` on which this recurrence fires. */
export function nextOccurrenceOnOrAfter(startDate: string, frequency: RecurringExpense['frequency'], referenceDate: string): string {
  if (startDate >= referenceDate) return startDate;

  if (frequency === 'weekly') {
    const diff = daysBetween(startDate, referenceDate);
    const weeks = Math.ceil(diff / 7);
    return addDays(startDate, weeks * 7);
  }

  const stepMonths = frequency === 'yearly' ? 12 : 1;
  const { y: sy, m: sm } = parseISO(startDate);
  const { y: ry, m: rm } = parseISO(referenceDate);
  let steps = Math.max(Math.floor(((ry - sy) * 12 + (rm - sm)) / stepMonths), 0);
  let candidate = addMonthsClamped(startDate, steps * stepMonths);
  while (candidate < referenceDate) {
    steps += 1;
    candidate = addMonthsClamped(startDate, steps * stepMonths);
  }
  return candidate;
}

export interface UpcomingOccurrence {
  expense: RecurringExpense;
  date: string;
}

export function upcomingOccurrences(expenses: RecurringExpense[], referenceDate: string): UpcomingOccurrence[] {
  return expenses
    .filter((e) => e.active)
    .map((expense) => ({ expense, date: nextOccurrenceOnOrAfter(expense.startDate, expense.frequency, referenceDate) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
