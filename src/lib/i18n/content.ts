import type { Locale } from "./config";

/** Per-locale overrides stored in the `translations` JSONB column. */
export type ContentTranslations = Partial<Record<Locale, Record<string, string | undefined>>>;

/**
 * Returns `row` with the given text fields replaced by their translation
 * for `locale`, falling back to the Italian base column when missing.
 */
export function localize<T extends { translations?: unknown }, K extends keyof T>(
  row: T,
  locale: Locale,
  fields: readonly K[]
): T {
  if (locale === "it") return row;
  const tr = (row.translations as ContentTranslations | null | undefined)?.[locale];
  if (!tr) return row;
  const out = { ...row };
  for (const field of fields) {
    const value = tr[field as string];
    if (value) out[field] = value as T[K];
  }
  return out;
}
