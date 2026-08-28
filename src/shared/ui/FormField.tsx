import type { ReactNode } from 'react';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, optional, children }: FormFieldProps) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[var(--color-ink)] mb-1.5">
        {label}
        {optional && <span className="text-[var(--color-ink-soft)] font-normal"> (optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-sm text-[var(--color-berry)]">
          {error}
        </p>
      )}
    </div>
  );
}

export const inputClasses =
  'w-full h-11 px-3.5 rounded-[var(--radius-control)] border border-[var(--color-line)] bg-white ' +
  'text-[var(--color-ink)] placeholder:text-[var(--color-ink-soft)]/60 ' +
  'focus:outline-none focus:ring-2 focus:ring-[var(--color-bloom)]/40 focus:border-[var(--color-bloom)]';
