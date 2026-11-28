import { getAppVersion } from "@/lib/version";

function AppVersion() {
  const version = getAppVersion();

  return (
    <p className="text-xs text-muted-foreground" data-testid="app-version">
      v{version}
    </p>
  );
}

export { AppVersion };
