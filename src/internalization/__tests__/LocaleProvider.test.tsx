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

  it("injects the full locale info to children", () => {
    render(
      <LocaleProvider locale="fa">
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("probe").textContent).toBe(
      JSON.stringify({
        locale: "fa",
        name: "فارسی",
        shortName: "FA",
        dir: "rtl",
        calendarType: "jalali",
        active: true,
      })
    );
  });

  it("provides full locale info for a ltr locale", () => {
    render(
      <LocaleProvider locale="en">
        <Probe />
      </LocaleProvider>
    );

    expect(screen.getByTestId("probe").textContent).toBe(
      JSON.stringify({
        locale: "en",
        name: "English",
        shortName: "EN",
        dir: "ltr",
        calendarType: "gregory",
        active: false,
      })
    );
  });

  it("throws when useLocale is used outside of a LocaleProvider", () => {
    expect(() => render(<Probe />)).toThrow(
      "useLocale must be used within a LocaleProvider"
    );
  });
});
