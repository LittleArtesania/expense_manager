import type { ExpenseManagerData } from '../shared/types/domain';
import { DEFAULT_CATEGORIES } from './seedCategories';
import { createDemoData, isDemoBuild } from './demoSeed';

// Namespaced key so this product can never collide with the Saving Planner
// (or any future product) sharing the same domain/browser profile.
const STORAGE_KEY = 'expense-manager:v1:data';
const CURRENT_SCHEMA_VERSION = 1;

function nowIso(): string {
  return new Date().toISOString();
}

export function createEmptyData(): ExpenseManagerData {
  if (isDemoBuild) return createDemoData();

  const createdAt = nowIso();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    settings: {
      currency: 'USD',
      onboardingCompleted: false,
    },
    monthlyBudgets: [],
    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c, createdAt })),
    transactions: [],
    recurringExpenses: [],
  };
}

/** Runs any pending migrations in sequence. Add a case per version bump —
 *  never mutate old cases, so old backups keep replaying correctly. */
function migrate(data: any): ExpenseManagerData {
  let migrated = data;
  if (!migrated.schemaVersion || migrated.schemaVersion < 1) {
    migrated = { ...migrated, schemaVersion: 1 };
  }
  // Future: if (migrated.schemaVersion < 2) { migrated = migrateV1ToV2(migrated); }
  return migrated as ExpenseManagerData;
}

export function loadData(): ExpenseManagerData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyData();
    const parsed = JSON.parse(raw);
    return migrate(parsed);
  } catch (error) {
    console.error('Failed to load expense manager data, starting fresh:', error);
    return createEmptyData();
  }
}

export function saveData(data: ExpenseManagerData): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save expense manager data:', error);
    return false;
  }
}

export function resetData(): ExpenseManagerData {
  const fresh = createEmptyData();
  saveData(fresh);
  return fresh;
}

export { STORAGE_KEY, CURRENT_SCHEMA_VERSION };
