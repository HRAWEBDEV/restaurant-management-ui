type AppVersion = string;

const FALLBACK_VERSION = "unknown";

function getAppVersion(): AppVersion {
  const version = process.env.APP_VERSION;
  return version ?? FALLBACK_VERSION;
}

export type { AppVersion };
export { FALLBACK_VERSION, getAppVersion };
