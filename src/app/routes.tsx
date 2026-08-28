import { lazy, Suspense } from 'react';
import { createBrowserRouter, createHashRouter } from 'react-router-dom';
import { AppShell } from './AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { TransactionsPage } from '../features/expenses/TransactionsPage';
import { SettingsPage } from '../features/settings/SettingsPage';

// Recharts is only needed on this page — code-split it so the initial
// bundle (Dashboard, Add Expense) stays light for a snappy PWA install.
const InsightsPage = lazy(() => import('../features/insights/InsightsPage').then((m) => ({ default: m.InsightsPage })));

const routes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'transactions', element: <TransactionsPage /> },
      {
        path: 'insights',
        element: (
          <Suspense fallback={null}>
            <InsightsPage />
          </Suspense>
        ),
      },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
];

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true';

// GitHub Pages serves static files with no server-side rewrite, so a
// deep link or refresh on e.g. /expense-manager/transactions would 404.
// Hash routing (#/transactions) sidesteps that entirely for the demo —
// the real product on Vercel gets normal, pretty URLs via BrowserRouter.
export const router = isDemo
  ? createHashRouter(routes)
  : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
