import "server-only";

import type { Locale } from "../../localications";

import fa from "./fa.json";
import en from "./en.json";

const dictionaries = { fa, en } as const;

export type Dictionary = (typeof dictionaries)[Locale];

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
