import type { Category, Transaction } from '../types/domain';
import {
  transactionsForMonth,
  totalSpent,
  categoryTotals,
  topCategory,
  averageDailySpending,
  projectedMonthEndSpending,
  budgetUsagePercent,
} from './calculations';
import { previousMonthKey, elapsedDaysInMonth } from './date';
import type { CurrencyCode } from '../types/domain';
import { formatCurrency } from './currency';

export interface Insight {
  id: string;
  emoji: string;
  text: string;
}

interface GenerateInsightsInput {
  transactions: Transaction[];
  categories: Category[];
  monthKey: string;
  budgetMinorUnits: number | null;
  currency: CurrencyCode;
}

/** Minimum signal required before we say anything about a pattern — avoids
 *  drawing conclusions ("Food is your biggest category") from one $3 coffee. */
const MIN_TRANSACTIONS_FOR_PATTERN = 3;

export function generateInsights({
  transactions,
  categories,
  monthKey,
  budgetMinorUnits,
  currency,
}: GenerateInsightsInput): Insight[] {
  const insights: Insight[] = [];
  const monthTx = transactionsForMonth(transactions, monthKey);

  if (monthTx.length === 0) {
    return insights;
  }

  const spent = totalSpent(monthTx);
  const elapsed = elapsedDaysInMonth(monthKey);

  // Top category — only once there's enough data for it to mean something.
  if (monthTx.length >= MIN_TRANSACTIONS_FOR_PATTERN) {
    const top = topCategory(monthTx);
    if (top && top.percentOfTotal >= 25) {
      const categoryName = categories.find((c) => c.id === top.categoryId)?.name ?? 'This category';
      insights.push({
        id: 'top-category',
        emoji: '📊',
        text: `${categoryName} is your biggest spending category this month, at ${top.percentOfTotal}% of your total.`,
      });
    }
  }

  // Daily pace — needs at least a couple of days elapsed to be meaningful.
  if (elapsed >= 2) {
    const daily = averageDailySpending(spent, monthKey);
    insights.push({
      id: 'daily-pace',
      emoji: '💡',
      text: `You're currently spending about ${formatCurrency(daily, currency)} per day this month.`,
    });
  }

  // Category month-over-month change — only for categories with enough
  // history in both months to compare fairly.
  if (monthTx.length >= MIN_TRANSACTIONS_FOR_PATTERN) {
    const prevKey = previousMonthKey(monthKey);
    const prevTx = transactionsForMonth(transactions, prevKey);
    if (prevTx.length >= MIN_TRANSACTIONS_FOR_PATTERN) {
      const currentTotals = categoryTotals(monthTx);
      const prevTotals = categoryTotals(prevTx);
      for (const cur of currentTotals) {
        const prev = prevTotals.find((p) => p.categoryId === cur.categoryId);
        if (prev && prev.totalMinorUnits > 0) {
          const change = Math.round(((cur.totalMinorUnits - prev.totalMinorUnits) / prev.totalMinorUnits) * 100);
          if (Math.abs(change) >= 15) {
            const categoryName = categories.find((c) => c.id === cur.categoryId)?.name ?? 'a category';
            const direction = change > 0 ? 'more' : 'less';
            insights.push({
              id: `change-${cur.categoryId}`,
              emoji: change > 0 ? '📈' : '✨',
              text: `You've spent ${Math.abs(change)}% ${direction} on ${categoryName} than last month.`,
            });
            break; // one comparison insight is enough to stay uncluttered
          }
        }
      }
    }
  }

  // Budget projection — only when a budget exists and enough of the month
  // has elapsed for a projection to be more than a guess.
  if (budgetMinorUnits !== null && elapsed >= 5) {
    const projected = projectedMonthEndSpending(spent, monthKey);
    const usage = budgetUsagePercent(projected, budgetMinorUnits);
    if (usage !== null && usage > 100) {
      const over = projected - budgetMinorUnits;
      insights.push({
        id: 'projection-over',
        emoji: '⚠️',
        text: `At your current pace, you may exceed your monthly budget by about ${formatCurrency(over, currency)}.`,
      });
    } else if (usage !== null && usage <= 80) {
      insights.push({
        id: 'projection-under',
        emoji: '✨',
        text: `At your current pace, you're on track to stay comfortably within your budget this month.`,
      });
    }
  }

  return insights;
}
