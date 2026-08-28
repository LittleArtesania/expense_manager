import type { Category } from '../shared/types/domain';

/** Fixed ids so future logic (icons, sort order, "essentials" grouping)
 *  can reference defaults reliably even though users can rename them. */
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Dining', icon: '🍔', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_groceries', name: 'Groceries', icon: '🛒', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_transport', name: 'Transportation', icon: '🚗', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_housing', name: 'Housing', icon: '🏠', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_bills', name: 'Bills & Utilities', icon: '💡', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_shopping', name: 'Shopping', icon: '🛍️', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_entertainment', name: 'Entertainment', icon: '🎬', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_health', name: 'Health', icon: '💊', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_travel', name: 'Travel', icon: '✈️', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_education', name: 'Education', icon: '📚', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_subscriptions', name: 'Subscriptions', icon: '💻', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_personal_care', name: 'Personal Care', icon: '💄', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_pets', name: 'Pets', icon: '🐶', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_gifts', name: 'Gifts', icon: '🎁', isCustom: false, archived: false, createdAt: '' },
  { id: 'cat_other', name: 'Other', icon: '📦', isCustom: false, archived: false, createdAt: '' },
];
