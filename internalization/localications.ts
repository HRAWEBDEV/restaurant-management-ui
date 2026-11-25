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

export { localeNames, locales, defaultLocale, isLocale };
export type { Locale };
