import { useState } from 'react';
import { Sparkles, Pencil } from 'lucide-react';
import { useData } from '../../app/DataContext';
import { Card } from '../../shared/ui/Card';
import { EmptyState } from '../../shared/ui/EmptyState';
import { BudgetProgressBar } from '../../shared/ui/BudgetProgressBar';
import { Button } from '../../shared/ui/Button';
import { BudgetEditorModal } from '../budget/components/BudgetEditorModal';
import { UpcomingRecurringCard } from '../recurring/components/UpcomingRecurringCard';
import { formatCurrency } from '../../shared/utils/currency';
import { currentMonthKey, formatMonthLabel } from '../../shared/utils/date';
import {
  transactionsForMonth,
  totalSpent,
  budgetForMonth,
  remainingBudget,
  budgetUsagePercent,
  budgetStatus,
  averageDailySpending,
  topCategory,
} from '../../shared/utils/calculations';

export function DashboardPage() {
  const { data } = useData();
  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const monthKey = currentMonthKey();
  const monthTransactions = transactionsForMonth(data.transactions, monthKey);
  const spent = totalSpent(monthTransactions);
  const budget = budgetForMonth(data.monthlyBudgets, monthKey);
  const remaining = remainingBudget(spent, budget);
  const usagePercent = budgetUsagePercent(spent, budget);
  const status = budgetStatus(usagePercent);
  const dailyAverage = averageDailySpending(spent, monthKey);
  const top = topCategory(monthTransactions);
  const topCategoryName = top ? data.categories.find((c) => c.id === top.categoryId)?.name : null;
  const currency = data.settings.currency;

  if (monthTransactions.length === 0) {
    return (
      <div>
        <PageHeader monthKey={monthKey} />
        <Card>
          <EmptyState
            icon={<Sparkles size={28} />}
            title="Your spending story starts here"
            description="Add your first expense and this dashboard will fill in — spending by category, daily averages, and gentle insights."
          />
        </Card>
        <UpcomingRecurringCard />
        <BudgetEditorModal
          open={budgetModalOpen}
          onClose={() => setBudgetModalOpen(false)}
          monthKey={monthKey}
          currentBudget={budget}
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader monthKey={monthKey} />

      <Card className="mb-4">
        <p className="text-sm text-[var(--color-ink-soft)] mb-1">Spent this month</p>
        <p className="font-[family-name:var(--font-display)] text-4xl tabular-amount text-[var(--color-ink)]">
          {formatCurrency(spent, currency)}
        </p>

        <div className="mt-5">
          <BudgetProgressBar percent={usagePercent} status={status} />
        </div>

        {budget !== null ? (
          <div className="mt-4 flex items-center justify-between">
            <div className="grid grid-cols-2 gap-4 text-sm flex-1">
              <Stat label="Budget" value={formatCurrency(budget, currency)} />
              <Stat
                label="Remaining"
                value={formatCurrency(remaining ?? 0, currency)}
                tone={remaining !== null && remaining < 0 ? 'critical' : undefined}
              />
            </div>
            <button
              onClick={() => setBudgetModalOpen(true)}
              aria-label="Edit budget"
              className="p-2 rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
            >
              <Pencil size={16} />
            </button>
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm text-[var(--color-ink-soft)]">Set a monthly budget to start tracking your progress.</p>
            <Button size="sm" variant="secondary" onClick={() => setBudgetModalOpen(true)}>
              Set budget
            </Button>
          </div>
        )}
      </Card>

      <BudgetEditorModal
        open={budgetModalOpen}
        onClose={() => setBudgetModalOpen(false)}
        monthKey={monthKey}
        currentBudget={budget}
      />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="text-sm text-[var(--color-ink-soft)] mb-1">Transactions</p>
          <p className="font-[family-name:var(--font-display)] text-2xl">{monthTransactions.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-[var(--color-ink-soft)] mb-1">Daily average</p>
          <p className="font-[family-name:var(--font-display)] text-2xl tabular-amount">
            {formatCurrency(dailyAverage, currency)}
          </p>
        </Card>
      </div>

      {topCategoryName && (
        <Card className="mt-4">
          <p className="text-sm text-[var(--color-ink-soft)]">Top category</p>
          <p className="mt-1 text-[var(--color-ink)] font-medium">
            {topCategoryName} — {top?.percentOfTotal}% of spending
          </p>
        </Card>
      )}

      <UpcomingRecurringCard />
    </div>
  );
}

function PageHeader({ monthKey }: { monthKey: string }) {
  return (
    <div className="mb-5">
      <p className="text-sm text-[var(--color-ink-soft)]">{formatMonthLabel(monthKey)}</p>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)]">Overview</h1>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'critical' }) {
  return (
    <div>
      <p className="text-[var(--color-ink-soft)]">{label}</p>
      <p
        className="tabular-amount font-medium"
        style={{ color: tone === 'critical' ? 'var(--color-berry)' : 'var(--color-ink)' }}
      >
        {value}
      </p>
    </div>
  );
}
