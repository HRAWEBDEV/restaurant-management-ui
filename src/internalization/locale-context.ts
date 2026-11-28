import { createContext, useContext } from "react";
import { localeNames, type Locale } from "@/internalization/localications";

type LocaleInfo = (typeof localeNames)[Locale];

type LocaleContextValue = {
  locale: Locale;
} & LocaleInfo;

const LocaleContext = createContext<LocaleContextValue | null>(null);

function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }

  return context;
}

export type { LocaleContextValue, LocaleInfo };
export { LocaleContext, useLocale };
