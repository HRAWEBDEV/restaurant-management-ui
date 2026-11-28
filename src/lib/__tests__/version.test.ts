import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { FALLBACK_VERSION, getAppVersion } from "../version";

describe("getAppVersion", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  test("returns the build-time injected APP_VERSION", () => {
    vi.stubEnv("APP_VERSION", "1.2.3");
    expect(getAppVersion()).toBe("1.2.3");
  });

  test("falls back when APP_VERSION is not set", () => {
    vi.stubEnv("APP_VERSION", undefined);
    expect(getAppVersion()).toBe(FALLBACK_VERSION);
  });
});
