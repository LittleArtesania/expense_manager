import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { Category, CurrencyCode } from '../../../shared/types/domain';
import type { CategoryTotal } from '../../../shared/utils/calculations';
import { formatCurrency } from '../../../shared/utils/currency';

interface CategoryBreakdownChartProps {
  totals: CategoryTotal[];
  categories: Category[];
  currency: CurrencyCode;
}

// A muted, editorial ramp derived from the "Ledger & Bloom" palette —
// deliberately not a rainbow of saturated defaults.
const SLICE_COLORS = [
  '#B9707E', // bloom
  '#7C8C68', // moss
  '#C08A3E', // amber
  '#6E5E76', // ink-soft
  '#9C3F4E', // berry
  '#A8927E', // warm taupe
  '#8FA3A0', // muted teal
  '#D3B08C', // sand
];

export function CategoryBreakdownChart({ totals, categories, currency }: CategoryBreakdownChartProps) {
  const top = totals.slice(0, 6);
  const otherTotal = totals.slice(6).reduce((sum, t) => sum + t.totalMinorUnits, 0);
  const slices = otherTotal > 0 ? [...top, { categoryId: '__other__', totalMinorUnits: otherTotal, percentOfTotal: 0 }] : top;

  const nameFor = (categoryId: string) =>
    categoryId === '__other__' ? 'Other categories' : categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorized';

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <div className="w-40 h-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="totalMinorUnits"
              nameKey="categoryId"
              innerRadius="65%"
              outerRadius="100%"
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((entry, i) => (
                <Cell key={entry.categoryId} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 w-full flex flex-col gap-2">
        {slices.map((s, i) => (
          <div key={s.categoryId} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-[var(--color-ink)] truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }}
              />
              {nameFor(s.categoryId)}
            </span>
            <span className="tabular-amount text-[var(--color-ink-soft)] shrink-0 pl-2">
              {formatCurrency(s.totalMinorUnits, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
