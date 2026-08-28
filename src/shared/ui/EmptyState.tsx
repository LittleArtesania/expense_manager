import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-10 px-6">
      {icon && <div className="mb-3 text-[var(--color-bloom)]">{icon}</div>}
      <p className="font-[family-name:var(--font-display)] text-lg text-[var(--color-ink)]">{title}</p>
      {description && <p className="mt-1.5 text-sm text-[var(--color-ink-soft)] max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
