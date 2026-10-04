import type { Locale } from "../config";
import { common } from "./common";
import { settings } from "./settings";
import { dashboard } from "./dashboard";
import { history } from "./history";
import { invoices } from "./invoices";
import { workout } from "./workout";
import { nutrition } from "./nutrition";

const namespaces = { common, settings, dashboard, history, invoices, workout, nutrition };

type Namespaces = typeof namespaces;
export type Messages = { [K in keyof Namespaces]: Namespaces[K]["it"] };

function build(locale: Locale): Messages {
  return Object.fromEntries(
    Object.entries(namespaces).map(([key, ns]) => [key, ns[locale]])
  ) as Messages;
}

export const messages: Record<Locale, Messages> = {
  it: build("it"),
  en: build("en"),
  fr: build("fr"),
};
