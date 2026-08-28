import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  tone: 'error' | 'success';
}

interface ToastContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message: string, tone: Toast['tone']) => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const showError = useCallback((message: string) => push(message, 'error'), [push]);
  const showSuccess = useCallback((message: string) => push(message, 'success'), [push]);

  return (
    <ToastContext.Provider value={{ showError, showSuccess }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-2.5 px-4 py-3 rounded-[var(--radius-control)] shadow-[var(--shadow-card)] text-sm
              ${t.tone === 'error' ? 'bg-[var(--color-berry)] text-white' : 'bg-[var(--color-ink)] text-white'}`}
          >
            {t.tone === 'error' ? (
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="shrink-0 opacity-80 hover:opacity-100">
              <X size={15} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
