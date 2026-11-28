# Design System — restaurant-management-ui

The deep reference for UI rules in this project. Agents get the short version via the `ui-guidelines` skill (`.opencode/skills/ui-guidelines/SKILL.md`); this document explains the "why" and gives examples.

**Stack:** Next.js 16 (Turbopack) · React 19 · Tailwind CSS v4 (CSS-first, no config file) · shadcn/ui (`base-nova` style) · Radix primitives · lucide icons.

---

## 1. Architecture: three layers of UI code

```
src/app/            → routes, layouts, pages (server components by default)
src/components/ui/  → UI primitives (shadcn CLI output — DO NOT hand-edit beyond thin glue)
src/components/     → composed app components (PascalCase, e.g. AppVersion.tsx)
```

Rules:

- **Primitives** are added only through the shadcn CLI: `npx shadcn@latest add button`. The registry style is `base-nova` (see `components.json`). Do not copy component code from other registries or older shadcn versions.
- **Composed components** combine primitives + app logic. PascalCase file named after the component. Co-located tests go in a `__tests__/` directory *inside the component's directory* (e.g. `src/components/__tests__/`).
- **Providers** are always split into two files:
  - `<name>-context.ts` — plain `.ts` module: context object, `useXxx()` hook, types.
  - `<Name>Provider.tsx` — the only React component, PascalCase file.
- **Types are exported separately**: a dedicated `export type { ... }` statement, never inline with value exports.
- **Multiple exports**: `export` statements go at the end of the file.

## 2. Design tokens (single source of truth)

Everything visual flows from the tokens in `src/app/globals.css`. There is no `tailwind.config` — Tailwind v4 is CSS-first, and the `@theme inline` block maps raw CSS variables to utility names.

### Token map

| Token | Use for |
|---|---|
| `background` / `foreground` | Page surface and default text |
| `card` / `card-foreground` | Card surfaces |
| `popover` / `popover-foreground` | Dropdowns, popovers, menus |
| `primary` / `primary-foreground` | Primary actions (default buttons), key accents |
| `secondary` / `secondary-foreground` | Secondary buttons, softer emphasis |
| `muted` / `muted-foreground` | De-emphasized text, subtle backgrounds |
| `accent` / `accent-foreground` | Hover states, selected-item backgrounds |
| `destructive` | Errors, destructive actions |
| `border`, `input`, `ring` | Borders, form inputs, focus rings |
| `chart-1..5` | Data visualization series — nothing else |
| `sidebar-*` | Sidebar surface/actions |
| `--radius` (+ sm/md/lg/xl/2xl/3xl/4xl) | Corner rounding, scaled from one root value |

All values are `oklch` (light in `:root`, dark in `.dark`). The `.dark` class variant is switched by `ThemeProvider` (`src/components/ui/theme-provider.tsx`).

### Hard rules

1. **Never hardcode** hex/rgb/oklch colors, px shadows, or radii in components. Use the semantic utility (`bg-primary`, `text-muted-foreground`, `border-border`, `rounded-lg`).
2. **Rebranding = edit `:root` / `.dark` token values in `globals.css`.** No component changes needed — this is the point of the system.
3. **`chart-1..5`** are reserved for chart series (`src/components/ui/chart.tsx`). Don't borrow them as UI colors.
4. **Arbitrary values** (`w-[37px]`) are exceptions, not style: justify them in review.

### Correct vs incorrect

```tsx
// ✅ correct
<div className="rounded-lg border border-border bg-card p-4 text-foreground">
  <p className="text-sm text-muted-foreground">…</p>
  <Button variant="destructive">حذف</Button>
</div>

// ❌ incorrect — hardcoded values defeat theming and dark mode
<div className="rounded-[9px] border border-[#e5e5e5] bg-white p-4 text-[#171717]">
  <p className="text-sm text-[#737373]">…</p>
</div>
```

## 3. RTL discipline (the default locale is `fa`, RTL)

Persian is the primary and only active locale (`en` exists but `active: false`). The `<html dir>` is RTL — physical-direction utilities will silently break for Persian users.

### Use logical utilities, always

| Instead of (physical ❌) | Use (logical ✅) |
|---|---|
| `ml-2` / `mr-2` | `ms-2` / `me-2` |
| `pl-4` / `pr-4` | `ps-4` / `pe-4` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `rounded-l-lg` / `rounded-r-lg` | `rounded-s-lg` / `rounded-e-lg` |
| `border-l` / `border-r` | `border-s` / `border-e` |

### Directional icons

Arrows/chevrons from lucide point one way. For `dir="rtl"` they must flip (e.g. `ArrowRight` ↔ `ArrowLeft`, or wrap in a container that applies `rtl:-scale-x-100` / the project's `direction.tsx` helper in `src/components/ui`).

### Dates and numbers

- `fa` uses the **Jalali calendar**: use `date-fns-jalali` and `@daypicker/persian`. Never plain `date-fns` or `react-day-picker` for Persian dates.
- The `fa` UI font is `IRANSansWebFaNum` (`--font-iran-sans`), `en` uses Roboto (`--font-roboto`). Fonts are loaded in `src/app/[lang]/layout.tsx`; the default `--font-sans` is set per-locale on `<html>`. Heading font is aliased to `--font-sans` (`--font-heading`).

## 4. Spacing, typography, motion

- **Spacing:** Tailwind scale only (`gap-2`, `p-4`, `mt-6`). Consistent rhythm beats pixel perfection.
- **Typography:** use `text-*` size utilities and token colors (`text-foreground`, `text-muted-foreground`). Don't set `font-size` in px, don't add new font families without registering them via `next/font/local` in `src/app/[lang]/layout.tsx` and exposing them in `@theme inline`.
- **Icons:** lucide only (`lucide-react`), sized with Tailwind (`size-4`), stroked by default.
- **Motion:** `tw-animate-css` utilities for enter/exit animations (already wired into the primitives). Keep durations subtle; no bounce/spring theatrics in an admin UI.
- **Focus:** never remove focus styles. The base layer applies `outline-ring/50` globally — keep it that way.

## 5. Internationalization (i18n)

- Locales/config: `src/internalization/localications.ts` (the misspelling is intentional — don't rename without updating all imports).
- Dictionaries: `src/internalization/dictionaries/<namespace>/` with `fa.json`, `en.json`, and `dictionary.ts` that imports `server-only` and exports `getDictionary(locale)`.
- **Hard rule:** dictionary loaders are server-only. Client components receive translated strings as props.
- **No string literals in JSX** for user-facing copy. If a string doesn't exist, create/extend a namespace — don't inline it.
- Adding a namespace: copy the existing pattern exactly (`fa.json` + `en.json` + `dictionary.ts`), keep both JSON files structurally identical (types derive from the JSON shape).

## 6. Verification gate

Before any UI change is "done", run in order:

```bash
npm run lint        # ESLint
npx tsc --noEmit    # types (no typecheck script exists)
npm run test:run    # Vitest one-shot (npm run test is watch mode)
```

A component PR that skips tests or fails one of these steps is not finished. New behavior needs tests in the appropriate `__tests__/` directory.

## 7. Decision guide

- "I need a select/modal/toast/table…" → check `src/components/ui/` first; if missing, `npx shadcn@latest add <name>`.
- "This primitive needs custom behavior for my feature" → don't edit the primitive; compose a new component in `src/components/` that wraps it.
- "This color looks wrong in dark mode" → fix the token in `globals.css`, not the component.
- "This text is in Persian in code" → move it to the dictionary namespace.
- "The calendar shows Gregorian dates for fa" → switch to `date-fns-jalali` / `@daypicker/persian`.
