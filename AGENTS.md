<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` / `build` / `lint` — standard Next.js.
- No typecheck script; run `npx tsc --noEmit` manually.
- Tests: Vitest + jsdom + Testing Library. `npm run test` is **watch mode**; use `npm run test:run` for one-shot. Single file: `npx vitest run __tests__/page.test.tsx`. Tests live in `__tests__/` (not colocated).
- Order when verifying: `lint`, then `tsc --noEmit`, then `test:run`.

## Stack quirks

- Next.js 16 + React 19 + Tailwind CSS **v4** — no `tailwind.config`; styling is CSS-based in `src/app/globals.css` (theme tokens live there). CSS is processed via `@tailwindcss/turbopack` (Turbopack rules in `next.config.ts`, which also enables `cacheComponents` and `partialPrefetching`).
- `components.json`: shadcn style **base-nova**, RSC on, lucide icons, base color neutral. Add UI primitives via the shadcn CLI into `src/components/ui`; do not hand-write them to match other registries.

## Path aliases & layout

- `@/*` → `src/*`, `@utils/*` → `src/utils/*`. App Router pages in `src/app`, UI primitives in `src/components/ui`, app components in `src/components`, hooks in `src/hooks`, shared helpers in `src/lib`, cookie/locale helpers in `src/utils`, i18n config and dictionaries in `src/internalization`.

## i18n (hard-won)

- Locales: `fa` is default and the only **active** locale; `en` exists but `active: false`. `fa` is **RTL** with a **Jalali calendar** — use `date-fns-jalali` / `@daypicker/persian` for fa date work, not plain `date-fns`/`react-day-picker`.
- Config in `src/internalization/localications.ts` (note the misspelling — don't "fix" without renaming imports). Dictionaries per namespace: `src/internalization/dictionaries/<namespace>/` containing `fa.json`, `en.json`, and a `dictionary.ts` that imports `server-only` and exports `getDictionary(locale)`. Dictionary types are derived from the JSON shape.
- Adding translated strings = create a new namespace directory in that pattern; loaders are server-only so dictionaries cannot leak into client components.

## Conventions (hard rules)

1. Always create a `__tests__` directory inside the directory being tested (e.g. tests for `src/utils/cookies.ts` go in `src/utils/__tests__/`).
2. Export at the end of the file when there are multiple exports.
3. Always export types separately (a dedicated `export type { ... }` statement, not inline with value exports).
