import { useState } from 'react';
import { Tags, Repeat } from 'lucide-react';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { useData } from '../../app/DataContext';
import type { CurrencyCode } from '../../shared/types/domain';
import { inputClasses, FormField } from '../../shared/ui/FormField';
import { CategoryManagerModal } from '../categories/components/CategoryManagerModal';
import { RecurringManagerModal } from '../recurring/components/RecurringManagerModal';
import { BackupSettingsCard } from './components/BackupSettingsCard';
import { InstallAppCard } from './components/InstallAppCard';

const CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'PEN'];

export function SettingsPage() {
  const { data, setCurrency } = useData();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-5">Settings</h1>

      <InstallAppCard />

      <Card className="mb-4">
        <FormField label="Currency" htmlFor="currency-select">
          <select
            id="currency-select"
            value={data.settings.currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className={inputClasses}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
        <p className="text-sm text-[var(--color-ink-soft)]">
          Your financial data is stored locally on your device. We don't require an account.
          Clearing your browser data or switching devices will remove it, so back up regularly from here.
        </p>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-ink)]">Categories</p>
            <p className="text-sm text-[var(--color-ink-soft)]">Add, rename, or remove spending categories.</p>
          </div>
          <Button variant="secondary" size="sm" icon={<Tags size={15} />} onClick={() => setCategoriesOpen(true)}>
            Manage
          </Button>
        </div>
      </Card>

      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-[var(--color-ink)]">Recurring Expenses</p>
            <p className="text-sm text-[var(--color-ink-soft)]">Track subscriptions and regular bills.</p>
          </div>
          <Button variant="secondary" size="sm" icon={<Repeat size={15} />} onClick={() => setRecurringOpen(true)}>
            Manage
          </Button>
        </div>
      </Card>

      <BackupSettingsCard />

      <CategoryManagerModal open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
      <RecurringManagerModal open={recurringOpen} onClose={() => setRecurringOpen(false)} />
    </div>
  );
}
