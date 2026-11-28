import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { LocaleProvider } from "../LocaleProvider";
import { useLocale } from "../locale-context";

function Probe() {
  const localeInfo = useLocale();

  return <span data-testid="probe">{JSON.stringify(localeInfo)}</span>;
}

describe("LocaleProvider", () => {
  afterEach(cleanup);

  const userLocaleTimeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";

  it("injects the full locale info to children", () => {
    render(
      <LocaleProvider locale="fa">
        <Probe />
      </LocaleProvider>
    );

    expect(JSON.parse(screen.getByTestId("probe").textContent ?? "")).toEqual({
      locale: "fa",
      name: "فارسی",
      shortName: "FA",
      dir: "rtl",
      calendarType: "jalali",
      userLocaleTimeZone,
      active: true,
    });
  });

  it("provides full locale info for a ltr locale", () => {
    render(
      <LocaleProvider locale="en">
        <Probe />
      </LocaleProvider>
    );

    expect(JSON.parse(screen.getByTestId("probe").textContent ?? "")).toEqual({
      locale: "en",
      name: "English",
      shortName: "EN",
      dir: "ltr",
      calendarType: "gregory",
      userLocaleTimeZone,
      active: false,
    });
  });

  it("throws when useLocale is used outside of a LocaleProvider", () => {
    expect(() => render(<Probe />)).toThrow(
      "useLocale must be used within a LocaleProvider"
    );
  });
});
