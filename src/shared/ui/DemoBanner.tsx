import { Sparkles } from 'lucide-react';
import { isDemoBuild } from '../../data/demoSeed';

export function DemoBanner() {
  if (!isDemoBuild) return null;

  return (
    <div className="flex items-center justify-center gap-2 text-sm text-white bg-[var(--color-bloom-deep)] py-2 px-4 text-center">
      <Sparkles size={14} className="shrink-0" />
      You're viewing a demo with sample data — nothing here is saved permanently, and it may reset for other visitors.
    </div>
  );
}
