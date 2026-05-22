/**
 * Locale-aware formatters. Use these instead of toLocaleString() calls so
 * the formatting style is consistent across pages.
 */

const CURRENCY_FORMATTER = new Intl.NumberFormat("fr-DZ", {
  style: "decimal",
  maximumFractionDigits: 0,
});

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-DZ", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat("fr-DZ", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const RELATIVE_FORMATTER = new Intl.RelativeTimeFormat("fr-DZ", {
  numeric: "auto",
});

/**
 * Format an Algerian dinar amount. By default we render the Arabic
 * abbreviation "دج" — it's the standard Algerian abbreviation and works
 * in both French and Arabic contexts on the storefront.
 *
 * Pass `locale: "fr"` if you ever need the latin "DZD" form back
 * (e.g. on Latin-only print receipts).
 */
export function formatDZD(amount: number, locale: "fr" | "ar" = "ar"): string {
  const symbol = locale === "fr" ? "DZD" : "دج";
  return `${CURRENCY_FORMATTER.format(amount)} ${symbol}`;
}

export function formatPercent(rate: number, digits = 0): string {
  return `${(rate * 100).toFixed(digits)} %`;
}

export function formatDate(iso: string): string {
  return DATE_FORMATTER.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return DATETIME_FORMATTER.format(new Date(iso));
}

export function formatRelative(iso: string, now = Date.now()): string {
  const diffMs = +new Date(iso) - now;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const abs = Math.abs(diffMs);
  if (abs < hour)
    return RELATIVE_FORMATTER.format(Math.round(diffMs / minute), "minute");
  if (abs < day)
    return RELATIVE_FORMATTER.format(Math.round(diffMs / hour), "hour");
  if (abs < 30 * day)
    return RELATIVE_FORMATTER.format(Math.round(diffMs / day), "day");
  return formatDate(iso);
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
