import { Search } from 'lucide-react';
import type { Category } from '../../../shared/types/domain';
import type { TransactionFilters, SortOption } from '../hooks/useTransactionFilters';
import { formatMonthLabel } from '../../../shared/utils/date';
import { inputClasses } from '../../../shared/ui/FormField';

interface TransactionFilterBarProps {
  filters: TransactionFilters;
  onChange: <K extends keyof TransactionFilters>(key: K, value: TransactionFilters[K]) => void;
  availableMonths: string[];
  categories: Category[];
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest first',
  oldest: 'Oldest first',
  highest: 'Highest amount',
  lowest: 'Lowest amount',
};

export function TransactionFilterBar({ filters, onChange, availableMonths, categories }: TransactionFilterBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-2.5">
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-soft)]" />
        <input
          value={filters.search}
          onChange={(e) => onChange('search', e.target.value)}
          placeholder="Search merchant or note"
          className={`${inputClasses} pl-10`}
          aria-label="Search transactions"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        <select
          value={filters.month}
          onChange={(e) => onChange('month', e.target.value)}
          className={`${inputClasses} w-auto h-9 text-sm shrink-0`}
          aria-label="Filter by month"
        >
          <option value="">All months</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>

        <select
          value={filters.categoryId}
          onChange={(e) => onChange('categoryId', e.target.value)}
          className={`${inputClasses} w-auto h-9 text-sm shrink-0`}
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.icon} {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.sort}
          onChange={(e) => onChange('sort', e.target.value as SortOption)}
          className={`${inputClasses} w-auto h-9 text-sm shrink-0`}
          aria-label="Sort transactions"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
