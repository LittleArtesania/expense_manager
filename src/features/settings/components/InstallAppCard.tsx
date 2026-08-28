import { Download, Share, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { useInstallPrompt } from '../../../shared/hooks/useInstallPrompt';

export function InstallAppCard() {
  const { installed, canPromptInstall, promptInstall, isIos } = useInstallPrompt();

  if (installed) {
    return (
      <Card className="mb-4">
        <div className="flex items-center gap-2 text-[var(--color-moss)]">
          <CheckCircle2 size={18} />
          <p className="font-medium text-[var(--color-ink)]">Installed</p>
        </div>
        <p className="text-sm text-[var(--color-ink-soft)] mt-1">
          You're using Expense Manager as an installed app — it works offline and keeps your data on this device.
        </p>
      </Card>
    );
  }

  if (isIos) {
    return (
      <Card className="mb-4">
        <p className="font-medium text-[var(--color-ink)] mb-1">Add to Home Screen</p>
        <p className="text-sm text-[var(--color-ink-soft)] flex items-start gap-1.5">
          <Share size={15} className="shrink-0 mt-0.5" />
          Tap the Share button in Safari, then "Add to Home Screen", to install and use it offline.
        </p>
      </Card>
    );
  }

  if (!canPromptInstall) return null;

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-[var(--color-ink)]">Install this app</p>
          <p className="text-sm text-[var(--color-ink-soft)]">Use it offline, right from your home screen or desktop.</p>
        </div>
        <Button size="sm" icon={<Download size={15} />} onClick={promptInstall}>
          Install
        </Button>
      </div>
    </Card>
  );
}
