import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-[var(--color-bloom-deep)] text-white hover:brightness-90 active:brightness-90',
  secondary:
    'bg-[var(--color-paper-dim)] text-[var(--color-ink)] hover:bg-[var(--color-line)] border border-[var(--color-line)]',
  ghost: 'bg-transparent text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]',
};

const SIZE_CLASSES: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.95rem]',
  sm: 'h-9 px-4 text-sm',
};

export function Button({ variant = 'primary', size = 'md', icon, className = '', children, ...rest }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[var(--radius-control)] font-medium
        transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
