import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DesktopSidebar } from './layout/DesktopSidebar';
import { MobileNav } from './layout/MobileNav';
import { useExpenseManagerData } from '../shared/hooks/useExpenseManagerData';
import { ExpenseFormModal } from '../features/expenses/components/ExpenseFormModal';
import { OnboardingFlow } from '../features/onboarding/OnboardingFlow';
import { DataContext } from './DataContext';
import { OfflineBanner } from '../shared/ui/OfflineBanner';
import { DemoBanner } from '../shared/ui/DemoBanner';

export function AppShell() {
  const store = useExpenseManagerData();
  const [addExpenseOpen, setAddExpenseOpen] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const showOnboarding = !store.data.settings.onboardingCompleted && !onboardingDismissed;

  return (
    <DataContext.Provider value={store}>
      {showOnboarding && (
        <OnboardingFlow
          onDone={() => setOnboardingDismissed(true)}
          onAddFirstExpense={() => setAddExpenseOpen(true)}
        />
      )}
      <div className="min-h-dvh flex bg-[var(--color-paper)]">
        <DesktopSidebar onAddExpense={() => setAddExpenseOpen(true)} />

        <div
          className="flex-1 flex flex-col min-w-0"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <DemoBanner />
          <OfflineBanner />
          <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 sm:pb-10">
            <Outlet />
          </main>
        </div>

        <MobileNav onAddExpense={() => setAddExpenseOpen(true)} />

        <ExpenseFormModal open={addExpenseOpen} onClose={() => setAddExpenseOpen(false)} />
      </div>
    </DataContext.Provider>
  );
}
