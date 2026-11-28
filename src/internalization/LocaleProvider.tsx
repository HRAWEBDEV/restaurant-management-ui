"use client";

import { useMemo } from "react";
import { localeNames, type Locale } from "@/internalization/localications";
import { LocaleContext } from "@/internalization/locale-context";

type LocaleProviderProps = {
  locale: Locale;
  children: React.ReactNode;
};

function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const value = useMemo(
    () => ({ locale, ...localeNames[locale] }),
    [locale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export type { LocaleProviderProps };
export { LocaleProvider };
