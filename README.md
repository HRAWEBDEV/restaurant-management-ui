# restaurant-management-ui

Next.js dashboard UI for a restaurant management system. Next.js 16 + React 19 + Tailwind CSS v4 + TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to a locale-prefixed route (`/fa` by default — `fa` is the only active locale, RTL).

Other scripts:

```bash
npm run build        # production build
npm run lint         # eslint
npm run test:run     # vitest one-shot (npm run test = watch mode)
npx tsc --noEmit     # typecheck (no dedicated script)
```

The project uses local fonts (`IRANSansWebFaNum` for `fa`, variable `Roboto` for `en`, in `public/fonts`). The default is set per locale in `src/app/[lang]/layout.tsx` via the `--font-sans` CSS variable; `font-iran-sans` and `font-roboto` utilities come from `src/app/globals.css`.

## Versioning & Releases

The app follows [Semantic Versioning](https://semver.org) (`MAJOR.MINOR.PATCH`) with release automation:

- **Conventional Commits**: commit/PR titles like `feat:`, `fix:`, `chore:` (scope optional, e.g. `feat(menu): add categories`). `feat:` → MINOR bump, `fix:` → PATCH, `BREAKING CHANGE:` footer → MAJOR.
- **release-please**: a GitHub Action (`.github/workflows/release-please.yml`) watches `main` and opens/updates a **Release PR** that bumps the version and writes `CHANGELOG.md`. A release happens when a human merges that PR — the bot then tags the release (`v0.2.0`) and creates a GitHub Release.
- **Required repo setting**: Settings → Actions → General → Workflow permissions → enable **"Allow GitHub Actions to create and approve pull requests"** (and the same option on the org level, if it is overridden there). Without it, release-please fails with "GitHub Actions is not permitted to create or approve pull requests".
- **Version in the UI**: `next.config.ts` reads `package.json` at build time and exposes it as `process.env.APP_VERSION`. App code reads it via `getAppVersion()` (`src/lib/version.ts`); it is displayed in the UI through the `<AppVersion />` component (`src/components/app-version.tsx`, shown in the home page footer).
- Never bump `package.json`'s `version` or edit release sections in `CHANGELOG.md` by hand — release-please owns both.
- **Milestones**: use GitHub milestones (named `v0.2.0` etc.) to group issues/PRs per planned release; release-please links merged PRs into the matching release notes.
