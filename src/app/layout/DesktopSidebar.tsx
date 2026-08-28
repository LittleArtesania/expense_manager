import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';
import { Button } from '../../shared/ui/Button';

interface DesktopSidebarProps {
  onAddExpense: () => void;
}

export function DesktopSidebar({ onAddExpense }: DesktopSidebarProps) {
  return (
    <aside
      className="hidden sm:flex flex-col w-64 shrink-0 border-r border-[var(--color-line)] bg-white/60 px-4 py-6"
      aria-label="Primary"
    >
      <div className="px-2 mb-8">
        <span className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">
          Expense<span className="text-[var(--color-bloom)]">.</span>
        </span>
      </div>

      <Button onClick={onAddExpense} icon={<Plus size={18} />} className="mb-6 w-full">
        Add Expense
      </Button>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 h-11 rounded-[var(--radius-control)] text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-bloom-tint)] text-[var(--color-bloom-deep)]'
                  : 'text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
