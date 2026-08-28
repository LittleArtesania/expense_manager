import { LayoutDashboard, Receipt, Sparkles, Settings } from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', Icon: Receipt },
  { to: '/insights', label: 'Insights', Icon: Sparkles },
  { to: '/settings', label: 'Settings', Icon: Settings },
] as const;
