import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[var(--color-ink)]/30 backdrop-blur-[2px]"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-[var(--color-paper)] rounded-t-[var(--radius-card)] sm:rounded-[var(--radius-card)]
          border border-[var(--color-line)] shadow-[var(--shadow-card)] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 id="modal-title" className="font-[family-name:var(--font-display)] text-xl text-[var(--color-ink)]">
            {title}
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-[var(--color-ink-soft)] hover:bg-[var(--color-paper-dim)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
