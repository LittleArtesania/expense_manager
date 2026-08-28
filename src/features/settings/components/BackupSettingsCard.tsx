import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, AlertCircle } from 'lucide-react';
import { Card } from '../../../shared/ui/Card';
import { Button } from '../../../shared/ui/Button';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useData } from '../../../app/DataContext';
import { useToast } from '../../../shared/ui/Toast';
import { exportToJson, parseImportedJson } from '../../../data/schema';

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function BackupSettingsCard() {
  const { data, replaceAllData, resetAllData } = useData();
  const { showSuccess } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [pendingImportRaw, setPendingImportRaw] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  function handleExport() {
    const filename = `expense-manager-backup-${new Date().toISOString().slice(0, 10)}.json`;
    downloadTextFile(filename, exportToJson(data));
    showSuccess('Backup downloaded.');
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result ?? '');
      const { data: parsed, result } = parseImportedJson(raw);
      if (!result.valid || !parsed) {
        setImportErrors(result.errors);
        setPendingImportRaw(null);
        return;
      }
      // Valid — but we still confirm before replacing current data.
      setImportErrors([]);
      setPendingImportRaw(raw);
    };
    reader.readAsText(file);
  }

  function confirmImport() {
    if (!pendingImportRaw) return;
    const { data: parsed } = parseImportedJson(pendingImportRaw);
    if (parsed) {
      replaceAllData(parsed);
      showSuccess('Backup imported successfully.');
    }
    setPendingImportRaw(null);
  }

  return (
    <Card className="mb-4">
      <p className="font-medium text-[var(--color-ink)] mb-1">Backup & Restore</p>
      <p className="text-sm text-[var(--color-ink-soft)] mb-4">
        Your data lives only on this device. Export a backup regularly — especially before clearing your browser
        or switching devices.
      </p>

      <div className="flex flex-col gap-2.5">
        <Button variant="secondary" icon={<Download size={16} />} onClick={handleExport} className="w-full">
          Export backup (JSON)
        </Button>

        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleFileSelected} />
        <Button
          variant="secondary"
          icon={<Upload size={16} />}
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          Import backup
        </Button>

        {importErrors.length > 0 && (
          <div className="flex items-start gap-2 text-sm text-[var(--color-berry)] bg-[var(--color-berry-tint)] rounded-[var(--radius-control)] p-3">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">This file couldn't be imported. Your current data is untouched.</p>
              <ul className="list-disc list-inside space-y-0.5">
                {importErrors.slice(0, 5).map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          icon={<RotateCcw size={16} />}
          onClick={() => setResetConfirmOpen(true)}
          className="w-full text-[var(--color-berry)]"
        >
          Reset all data
        </Button>
      </div>

      <ConfirmDialog
        open={Boolean(pendingImportRaw)}
        title="Replace your current data?"
        description="Importing this backup will replace all transactions, categories, budgets, and recurring expenses currently on this device. This can't be undone unless you have another backup."
        confirmLabel="Replace data"
        onCancel={() => setPendingImportRaw(null)}
        onConfirm={confirmImport}
      />

      <ConfirmDialog
        open={resetConfirmOpen}
        title="Reset all data?"
        description="This permanently deletes every transaction, category, budget, and recurring expense on this device. Export a backup first if you might want it later."
        confirmLabel="Reset everything"
        onCancel={() => setResetConfirmOpen(false)}
        onConfirm={() => {
          resetAllData();
          setResetConfirmOpen(false);
        }}
      />
    </Card>
  );
}
