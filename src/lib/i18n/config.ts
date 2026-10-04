export const locales = ["it", "en", "fr"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";
export const LOCALE_COOKIE = "locale";

// BCP 47 tags for Intl / toLocale*String
export const localeTags: Record<Locale, string> = {
  it: "it-IT",
  en: "en-GB",
  fr: "fr-FR",
};

export const localeNames: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  fr: "Français",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
