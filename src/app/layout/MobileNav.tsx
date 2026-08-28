import { NavLink } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { NAV_ITEMS } from './navConfig';

interface MobileNavProps {
  onAddExpense: () => void;
}

export function MobileNav({ onAddExpense }: MobileNavProps) {
  const [left, right] = [NAV_ITEMS.slice(0, 2), NAV_ITEMS.slice(2)];

  return (
    <nav
      className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-[var(--color-line)]
        pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="relative grid grid-cols-5 items-center h-16 px-1">
        {left.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        {/* spacer for the raised FAB */}
        <div />

        {right.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <button
          onClick={onAddExpense}
          aria-label="Add expense"
          className="absolute left-1/2 -translate-x-1/2 -top-6 h-14 w-14 rounded-full
            bg-[var(--color-bloom)] text-white shadow-[var(--shadow-card)]
            flex items-center justify-center active:scale-95 transition-transform"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
      </div>
    </nav>
  );
}

function NavItem({ to, label, Icon }: (typeof NAV_ITEMS)[number]) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-0.5 text-[0.65rem] ${
          isActive ? 'text-[var(--color-bloom-deep)]' : 'text-[var(--color-ink-soft)]'
        }`
      }
    >
      <Icon size={20} />
      {label}
    </NavLink>
  );
}
