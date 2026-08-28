import { useState } from 'react';
import { Sparkles, Wallet, Plus } from 'lucide-react';
import { useData } from '../../app/DataContext';
import { Button } from '../../shared/ui/Button';
import { inputClasses } from '../../shared/ui/FormField';
import { parseAmountToMinorUnits } from '../../shared/utils/currency';
import { currentMonthKey } from '../../shared/utils/date';
import type { CurrencyCode } from '../../shared/types/domain';

const CURRENCIES: CurrencyCode[] = ['USD', 'EUR', 'GBP', 'PEN'];

interface OnboardingFlowProps {
  onDone: () => void;
  onAddFirstExpense: () => void;
}

export function OnboardingFlow({ onDone, onAddFirstExpense }: OnboardingFlowProps) {
  const { data, setCurrency, setBudgetForMonth, completeOnboarding } = useData();
  const [step, setStep] = useState(0);
  const [budgetInput, setBudgetInput] = useState('');

  function finish() {
    const parsed = parseAmountToMinorUnits(budgetInput);
    if (parsed !== null) setBudgetForMonth(currentMonthKey(), parsed);
    completeOnboarding();
    onDone();
  }

  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-paper)] flex flex-col items-center justify-center px-6 text-center">
      <button
        onClick={finish}
        className="absolute top-5 right-5 text-sm text-[var(--color-ink-soft)] hover:text-[var(--color-ink)]"
      >
        Skip
      </button>

      {step === 0 && (
        <StepLayout
          icon={<Sparkles size={28} />}
          title="Welcome to your Expense Manager"
          description="A calm, private way to see where your money goes — no account, no spreadsheets. Let's set a couple of things up."
        >
          <Button onClick={() => setStep(1)} className="w-full max-w-xs">
            Get started
          </Button>
        </StepLayout>
      )}

      {step === 1 && (
        <StepLayout icon={<Wallet size={28} />} title="Choose your currency" description="You can change this anytime in Settings.">
          <select
            value={data.settings.currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className={`${inputClasses} max-w-xs mb-4`}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Button onClick={() => setStep(2)} className="w-full max-w-xs">
            Continue
          </Button>
        </StepLayout>
      )}

      {step === 2 && (
        <StepLayout
          icon={<Wallet size={28} />}
          title="Set a monthly budget"
          description="Optional, but it's what powers your progress bar and pace insights. You can always add or change this later."
        >
          <input
            inputMode="decimal"
            placeholder={`0.00 ${data.settings.currency}`}
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className={`${inputClasses} max-w-xs mb-4 text-center tabular-amount`}
            autoFocus
          />
          <Button onClick={() => setStep(3)} className="w-full max-w-xs">
            Continue
          </Button>
        </StepLayout>
      )}

      {step === 3 && (
        <StepLayout
          icon={<Plus size={28} />}
          title="Add your first expense"
          description="This is the whole point — try it now, or jump straight to your dashboard."
        >
          <div className="flex flex-col gap-2.5 w-full max-w-xs">
            <Button
              onClick={() => {
                finish();
                onAddFirstExpense();
              }}
              className="w-full"
            >
              Add an expense
            </Button>
            <Button variant="secondary" onClick={finish} className="w-full">
              Go to dashboard
            </Button>
          </div>
        </StepLayout>
      )}

      <div className="flex gap-1.5 mt-8">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === step ? '1.25rem' : '0.375rem',
              backgroundColor: i === step ? 'var(--color-bloom)' : 'var(--color-line)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

function StepLayout({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center max-w-sm">
      <div className="text-[var(--color-bloom)] mb-4">{icon}</div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl text-[var(--color-ink)] mb-2">{title}</h1>
      <p className="text-sm text-[var(--color-ink-soft)] mb-6">{description}</p>
      {children}
    </div>
  );
}
