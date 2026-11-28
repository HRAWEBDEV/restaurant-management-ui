import { createContext, useContext } from "react";
import { localeNames, type Locale } from "@/internalization/localications";
import { OutOfContextError } from "@/utils/out-of-context";

type LocaleInfo = (typeof localeNames)[Locale];

type LocaleContextValue = {
  locale: Locale;
  userLocaleTimeZone: string;
} & LocaleInfo;

const LocaleContext = createContext<LocaleContextValue | null>(null);

function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new OutOfContextError("useLocale", "LocaleProvider");
  }

  return context;
}

export type { LocaleContextValue, LocaleInfo };
export { LocaleContext, useLocale };
