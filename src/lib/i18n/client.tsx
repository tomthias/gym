"use client";

import { createContext, useContext } from "react";
import { defaultLocale, localeTags, type Locale } from "./config";
import { messages } from "./messages";

const I18nContext = createContext<Locale>(defaultLocale);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return <I18nContext.Provider value={locale}>{children}</I18nContext.Provider>;
}

/** Translations for client components. */
export function useI18n() {
  const locale = useContext(I18nContext);
  return { locale, tag: localeTags[locale], t: messages[locale] };
}
