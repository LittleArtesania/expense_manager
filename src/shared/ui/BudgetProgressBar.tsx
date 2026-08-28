import { CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { BudgetStatus } from '../utils/calculations';

interface BudgetProgressBarProps {
  percent: number | null;
  status: BudgetStatus;
}

const STATUS_CONFIG: Record<
  Exclude<BudgetStatus, 'no-budget'>,
  { barColor: string; textColor: string; label: string; Icon: typeof CheckCircle2 }
> = {
  normal: { barColor: 'var(--color-moss)', textColor: 'var(--color-moss-text)', label: 'On track', Icon: CheckCircle2 },
  warning: { barColor: 'var(--color-amber)', textColor: 'var(--color-amber-text)', label: 'Approaching budget', Icon: AlertTriangle },
  critical: { barColor: 'var(--color-berry)', textColor: 'var(--color-berry)', label: 'Over budget', Icon: AlertOctagon },
};

export function BudgetProgressBar({ percent, status }: BudgetProgressBarProps) {
  if (status === 'no-budget' || percent === null) {
    return (
      <div className="stitch-divider" role="presentation" />
    );
  }

  const { barColor, textColor, label, Icon } = STATUS_CONFIG[status];
  const clampedWidth = Math.min(percent, 100);

  return (
    <div>
      <div
        className="h-2.5 w-full rounded-[var(--radius-pill)] bg-[var(--color-paper-dim)] overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percent}% of budget used — ${label}`}
      >
        <div
          className="h-full rounded-[var(--radius-pill)] transition-[width] duration-500"
          style={{ width: `${clampedWidth}%`, backgroundColor: barColor }}
        />
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-sm" style={{ color: textColor }}>
        <Icon size={15} />
        <span>
          {label} — {percent}% used
        </span>
      </div>
    </div>
  );
}
