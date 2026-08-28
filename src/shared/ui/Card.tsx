import type { HTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-white rounded-[var(--radius-card)] border border-[var(--color-line)]
        shadow-[var(--shadow-card)] p-5 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
