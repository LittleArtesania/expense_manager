import type { CurrencyCode } from '../types/domain';

const LOCALE_BY_CURRENCY: Record<CurrencyCode, string> = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  PEN: 'es-PE',
};

export function formatCurrency(amountMinorUnits: number, currency: CurrencyCode): string {
  const amount = amountMinorUnits / 100;
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Parses a user-typed amount like "12.5" or "12,50" into minor units.
 *  Returns null when the input isn't a valid positive amount. */
export function parseAmountToMinorUnits(input: string): number | null {
  const normalized = input.trim().replace(',', '.');
  if (!normalized || !/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const value = Math.round(parseFloat(normalized) * 100);
  return value > 0 ? value : null;
}
