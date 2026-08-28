import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();
  if (online) return null;

  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2 text-sm text-white bg-[var(--color-ink)] py-2 px-4"
    >
      <WifiOff size={14} />
      You're offline — everything you add here still saves on this device.
    </div>
  );
}
