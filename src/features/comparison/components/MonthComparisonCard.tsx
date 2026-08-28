import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import type { CurrencyCode } from '../../../shared/types/domain';
import type { MonthComparison } from '../../../shared/utils/calculations';
import { formatCurrency } from '../../../shared/utils/currency';
import { formatMonthLabel, previousMonthKey } from '../../../shared/utils/date';

interface MonthComparisonCardProps {
  monthKey: string;
  comparison: MonthComparison;
  currency: CurrencyCode;
}

export function MonthComparisonCard({ monthKey, comparison, currency }: MonthComparisonCardProps) {
  const { currentMinorUnits, previousMinorUnits, differenceMinorUnits, percentChange } = comparison;
  const prevKey = previousMonthKey(monthKey);

  const Icon = differenceMinorUnits > 0 ? ArrowUp : differenceMinorUnits < 0 ? ArrowDown : Minus;
  const tone =
    differenceMinorUnits > 0 ? 'var(--color-berry)' : differenceMinorUnits < 0 ? 'var(--color-moss-text)' : 'var(--color-ink-soft)';

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-[var(--color-ink-soft)]">{formatMonthLabel(monthKey)}</p>
        <p className="font-[family-name:var(--font-display)] text-2xl tabular-amount text-[var(--color-ink)]">
          {formatCurrency(currentMinorUnits, currency)}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-[var(--color-ink-soft)]">{formatMonthLabel(prevKey)}</p>
        <p className="tabular-amount text-[var(--color-ink)]">{formatCurrency(previousMinorUnits, currency)}</p>
      </div>
      <div className="flex items-center gap-1 pl-3 shrink-0" style={{ color: tone }}>
        <Icon size={16} />
        <span className="text-sm font-medium tabular-amount">
          {percentChange !== null ? `${Math.abs(percentChange)}%` : formatCurrency(Math.abs(differenceMinorUnits), currency)}
        </span>
      </div>
    </div>
  );
}
