import "@testing-library/jest-dom/vitest";
import { expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppVersion } from "../app-version";

test("renders the current app version", () => {
  vi.stubEnv("APP_VERSION", "0.1.0");
  render(<AppVersion />);
  expect(screen.getByTestId("app-version")).toHaveTextContent("v0.1.0");
});
