import { useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import { Modal } from '../../../shared/ui/Modal';
import { Button } from '../../../shared/ui/Button';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';
import { useData } from '../../../app/DataContext';
import type { Category } from '../../../shared/types/domain';

const ICON_CHOICES = ['🍔', '🛒', '🚗', '🏠', '💡', '🛍️', '🎬', '💊', '✈️', '📚', '💻', '💄', '🐶', '🎁', '📦', '💰', '🎓', '🧾'];

interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryManagerModal({ open, onClose }: CategoryManagerModalProps) {
  const { data, addCategory, renameCategory, removeCategory } = useData();
  const activeCategories = data.categories.filter((c) => !c.archived);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftIcon, setDraftIcon] = useState('📦');
  const [creating, setCreating] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Category | undefined>(undefined);

  const hasHistory = (categoryId: string) => data.transactions.some((t) => t.categoryId === categoryId);

  function startEdit(category: Category) {
    setCreating(false);
    setEditingId(category.id);
    setDraftName(category.name);
    setDraftIcon(category.icon);
  }

  function startCreate() {
    setEditingId(null);
    setCreating(true);
    setDraftName('');
    setDraftIcon('📦');
  }

  function cancelEdit() {
    setEditingId(null);
    setCreating(false);
  }

  function saveEdit() {
    if (!draftName.trim()) return;
    if (creating) {
      addCategory(draftName.trim(), draftIcon);
    } else if (editingId) {
      renameCategory(editingId, draftName.trim(), draftIcon);
    }
    cancelEdit();
  }

  return (
    <Modal open={open} onClose={onClose} title="Categories">
      <div className="flex flex-col gap-1 max-h-80 overflow-y-auto -mx-1 px-1">
        {activeCategories.map((c) =>
          editingId === c.id ? (
            <CategoryEditor
              key={c.id}
              name={draftName}
              icon={draftIcon}
              onNameChange={setDraftName}
              onIconChange={setDraftIcon}
              onSave={saveEdit}
              onCancel={cancelEdit}
            />
          ) : (
            <div key={c.id} className="flex items-center justify-between py-2 px-2 rounded-[var(--radius-control)] hover:bg-[var(--color-paper-dim)]">
              <span className="flex items-center gap-2.5 text-[var(--color-ink)]">
                <span className="text-lg">{c.icon}</span>
                {c.name}
              </span>
              <span className="flex items-center gap-1">
                <button
                  aria-label={`Rename ${c.name}`}
                  onClick={() => startEdit(c)}
                  className="p-1.5 rounded-full text-[var(--color-ink-soft)] hover:bg-white"
                >
                  <Pencil size={15} />
                </button>
                <button
                  aria-label={`Delete ${c.name}`}
                  onClick={() => setPendingDelete(c)}
                  className="p-1.5 rounded-full text-[var(--color-ink-soft)] hover:bg-white"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </div>
          )
        )}

        {creating && (
          <CategoryEditor
            name={draftName}
            icon={draftIcon}
            onNameChange={setDraftName}
            onIconChange={setDraftIcon}
            onSave={saveEdit}
            onCancel={cancelEdit}
            autoFocus
          />
        )}
      </div>

      {!creating && (
        <Button variant="secondary" icon={<Plus size={16} />} onClick={startCreate} className="w-full mt-4">
          New category
        </Button>
      )}

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={`Delete "${pendingDelete?.name}"?`}
        description={
          pendingDelete && hasHistory(pendingDelete.id)
            ? 'This category has past expenses. It will be hidden from new entries, but its history stays intact.'
            : 'This category has no expenses yet, so it will be removed completely.'
        }
        confirmLabel="Delete"
        onCancel={() => setPendingDelete(undefined)}
        onConfirm={() => {
          if (pendingDelete) removeCategory(pendingDelete.id);
          setPendingDelete(undefined);
        }}
      />
    </Modal>
  );
}

function CategoryEditor({
  name,
  icon,
  onNameChange,
  onIconChange,
  onSave,
  onCancel,
  autoFocus,
}: {
  name: string;
  icon: string;
  onNameChange: (v: string) => void;
  onIconChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  autoFocus?: boolean;
}) {
  return (
    <div className="p-2.5 rounded-[var(--radius-control)] bg-[var(--color-paper-dim)]">
      <div className="flex gap-2 mb-2">
        <select
          value={icon}
          onChange={(e) => onIconChange(e.target.value)}
          className="w-14 h-10 px-1.5 shrink-0 text-center text-base rounded-[var(--radius-control)]
            border border-[var(--color-line)] bg-white text-[var(--color-ink)]
            focus:outline-none focus:ring-2 focus:ring-[var(--color-bloom)]/40 focus:border-[var(--color-bloom)]"
          aria-label="Icon"
        >
          {ICON_CHOICES.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <input
          autoFocus={autoFocus}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Category name"
          className="h-10 flex-1 min-w-0 px-3.5 rounded-[var(--radius-control)]
            border border-[var(--color-line)] bg-white text-[var(--color-ink)]
            placeholder:text-[var(--color-ink-soft)]/60
            focus:outline-none focus:ring-2 focus:ring-[var(--color-bloom)]/40 focus:border-[var(--color-bloom)]"
          onKeyDown={(e) => e.key === 'Enter' && onSave()}
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} aria-label="Cancel" className="p-2 rounded-full text-[var(--color-ink-soft)] hover:bg-white">
          <X size={16} />
        </button>
        <button onClick={onSave} aria-label="Save" className="p-2 rounded-full text-white bg-[var(--color-bloom)] hover:bg-[var(--color-bloom-deep)]">
          <Check size={16} />
        </button>
      </div>
    </div>
  );
}
