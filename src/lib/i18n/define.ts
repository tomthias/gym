import type { Locale } from "./config";

/**
 * Define a message namespace. The Italian block is the source of truth:
 * English and French must have exactly the same shape.
 * Values can be strings or functions (for interpolation / plurals).
 */
export function defineMessages<T>(messages: { it: T } & Record<Exclude<Locale, "it">, T>) {
  return messages;
}
