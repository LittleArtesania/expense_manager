/**
 * All dates in this app are plain 'YYYY-MM-DD' strings with no time
 * component. We deliberately avoid `new Date(dateString)` for parsing
 * ('2026-08-25' is parsed as UTC midnight by the spec, which shifts to
 * the previous day in negative-UTC-offset timezones) and instead do
 * string-level or explicit local-component comparisons everywhere.
 */

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function currentMonthKey(): string {
  return todayIso().slice(0, 7); // 'YYYY-MM'
}

export function monthKeyOf(dateIso: string): string {
  return dateIso.slice(0, 7);
}

/** Number of calendar days in a given 'YYYY-MM' month, leap-year safe. */
export function daysInMonth(monthKey: string): number {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

/** How many days of the given month have elapsed so far (>=1).
 *  For a past month, returns the full length of that month. */
export function elapsedDaysInMonth(monthKey: string): number {
  const total = daysInMonth(monthKey);
  if (monthKey === currentMonthKey()) {
    return new Date().getDate();
  }
  return monthKey < currentMonthKey() ? total : 0;
}

export function previousMonthKey(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 2, 1); // month is 1-indexed in the key
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/** Human-friendly group label for a transaction list: "Today", "Yesterday",
 *  or a short date — computed from plain date-string comparison, never
 *  from Date-object arithmetic, so it can't drift across timezones. */
export function relativeDayLabel(dateIso: string): string {
  const today = todayIso();
  if (dateIso === today) return 'Today';

  const [y, m, d] = today.split('-').map(Number);
  const yesterday = new Date(y, m - 1, d - 1);
  const yesterdayIso = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(
    yesterday.getDate()
  ).padStart(2, '0')}`;
  if (dateIso === yesterdayIso) return 'Yesterday';

  const [year, month, day] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: year !== y ? 'numeric' : undefined,
  });
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}
