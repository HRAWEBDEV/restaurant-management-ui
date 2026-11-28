"use client";

import { useMemo } from "react";
import { localeNames, type Locale } from "@/internalization/localications";
import { LocaleContext } from "@/internalization/locale-context";

type LocaleProviderProps = {
  locale: Locale;
  children: React.ReactNode;
};

function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const value = useMemo(() => {
    const userLocaleTimeZone =
      Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

    return {
      locale,
      ...localeNames[locale],
      userLocaleTimeZone,
    };
  }, [locale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export type { LocaleProviderProps };
export { LocaleProvider };
