const localeNames = {
  fa: {
    name: "فارسی",
    shortName: "FA",
    dir: "rtl",
    calendarType: "jalali",
    active: true,
  },
  en: {
    name: "English",
    shortName: "EN",
    dir: "ltr",
    calendarType: "gregory",
    active: false,
  },
} as const;

type Locale = keyof typeof localeNames;

const locales = Object.keys(localeNames) as Locale[];

const defaultLocale: Locale = "fa";

function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

function isActiveLocale(value: string): value is Locale {
  return isLocale(value) && localeNames[value].active;
}

export { localeNames, locales, defaultLocale, isLocale, isActiveLocale };
export type { Locale };
