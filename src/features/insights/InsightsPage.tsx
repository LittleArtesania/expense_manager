import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useData } from '../../app/DataContext';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { CategoryBreakdownChart } from './components/CategoryBreakdownChart';
import { MonthComparisonCard } from '../comparison/components/MonthComparisonCard';
import { CalendarView } from '../calendar/components/CalendarView';
import { currentMonthKey } from '../../shared/utils/date';
import { transactionsForMonth, categoryTotals, budgetForMonth, compareMonths } from '../../shared/utils/calculations';
import { generateInsights } from '../../shared/utils/insights';

type Tab = 'overview' | 'calendar';

export function InsightsPage() {
  const { data } = useData();
  const [tab, setTab] = useState<Tab>('overview');
  const monthKey = currentMonthKey();

  const monthTransactions = transactionsForMonth(data.transactions, monthKey);
  const totals = useMemo(() => categoryTotals(monthTransactions), [monthTransactions]);
  const budget = budgetForMonth(data.monthlyBudgets, monthKey);
  const comparison = useMemo(() => compareMonths(data.transactions, monthKey), [data.transactions, monthKey]);
  const insights = useMemo(
    () =>
      generateInsights({
        transactions: data.transactions,
        categories: data.categories,
        monthKey,
        budgetMinorUnits: budget,
        currency: data.settings.currency,
      }),
    [data.transactions, data.categories, monthKey, budget, data.settings.currency]
  );

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-4">Insights</h1>

      <div className="flex gap-1 mb-4 p-1 bg-[var(--color-paper-dim)] rounded-[var(--radius-pill)] w-fit">
        <TabButton active={tab === 'overview'} onClick={() => setTab('overview')}>
          Overview
        </TabButton>
        <TabButton active={tab === 'calendar'} onClick={() => setTab('calendar')}>
          Calendar
        </TabButton>
      </div>

      {tab === 'calendar' ? (
        <CalendarView />
      ) : monthTransactions.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Sparkles size={28} />}
            title="Add a few expenses and we'll start finding patterns"
            description="Insights like your biggest category or daily pace will appear here once there's enough data to work with."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          <Card>
            <p className="text-sm font-medium text-[var(--color-ink-soft)] mb-3">Spending by category</p>
            <CategoryBreakdownChart totals={totals} categories={data.categories} currency={data.settings.currency} />
          </Card>

          {comparison.previousMinorUnits > 0 && (
            <Card>
              <p className="text-sm font-medium text-[var(--color-ink-soft)] mb-3">Compared to last month</p>
              <MonthComparisonCard monthKey={monthKey} comparison={comparison} currency={data.settings.currency} />
            </Card>
          )}

          {insights.length > 0 && (
            <Card>
              <p className="text-sm font-medium text-[var(--color-ink-soft)] mb-3">What we noticed</p>
              <div className="flex flex-col gap-3">
                {insights.map((insight) => (
                  <div key={insight.id} className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]">
                    <span aria-hidden>{insight.emoji}</span>
                    <span>{insight.text}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 h-8 rounded-[var(--radius-pill)] text-sm font-medium transition-colors ${
        active ? 'bg-white text-[var(--color-ink)] shadow-sm' : 'text-[var(--color-ink-soft)]'
      }`}
    >
      {children}
    </button>
  );
}
