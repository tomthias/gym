import { cookies } from "next/headers";
import { defaultLocale, isLocale, localeTags, LOCALE_COOKIE, type Locale } from "./config";
import { messages } from "./messages";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Translations for server components and server actions. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, tag: localeTags[locale], t: messages[locale] };
}
