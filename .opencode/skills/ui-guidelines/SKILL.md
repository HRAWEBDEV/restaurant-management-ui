---
name: ui-guidelines
description: Hard UI rules for this restaurant-management project. Load before creating or modifying any component, style, page, or layout — covers design tokens, RTL discipline, component layering, i18n, and verification gates.
---

# UI Guidelines (restaurant-management-ui)

Load these rules whenever touching UI. The full reference with examples lives in `docs/design-system.md`.

## 1. Tokens only — never hardcode visual values

- All colors, radii, shadows, and font sizes come from the theme tokens in `src/app/globals.css` (Tailwind v4 `@theme inline` + shadcn tokens).
- Use semantic utilities: `bg-background`, `text-foreground`, `bg-primary`, `text-muted-foreground`, `border-border`, `ring-ring`, `rounded-lg`, etc.
- NEVER use raw hex/rgb/oklch values in components, and never invent one-off CSS variables per component. To change branding, edit the token values in `globals.css` (`:root` and `.dark`), nothing else.
- Arbitrary values (`w-[13px]`) require justification; prefer the Tailwind scale.

## 2. RTL discipline (fa is RTL — the default locale)

- Use logical utilities everywhere: `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, `text-start`/`text-end`.
- NEVER use `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right` in component code.
- Icons with direction (arrows, chevrons) must flip or use directional variants for `dir=rtl`.
- Numbers/Jalali dates: use `date-fns-jalali` / `@daypicker/persian` for fa date work — never plain `date-fns` / `react-day-picker` for fa.

## 3. Component layering

- UI primitives: ONLY via the shadcn CLI (`npx shadcn add ...`) into `src/components/ui`, style `base-nova`. Do not hand-write primitives or copy from other registries.
- Composed app components: `src/components/`, PascalCase files named after the component (e.g. `AppVersion.tsx`).
- Providers are always split: `<name>Context` (plain kebab-case `.ts` context module with hook + types) and `<Name>Provider.tsx` (the only React component).
- Client vs server: components that need state/handlers are `"use client"`; pages/layouts stay server components by default.

## 4. i18n is not optional

- All user-facing strings come from a dictionary namespace under `src/internalization/dictionaries/<namespace>/` (`fa.json`, `en.json`, `dictionary.ts` with `getDictionary`). Create a new namespace following the existing pattern when needed.
- Dictionary loaders are server-only (`server-only` import) — translated strings must be passed down as props to client components, never imported there.
- `en` exists but `active: false`; keep dictionaries in sync anyway.

## 5. Styling conventions

- Tailwind v4 CSS-first: global theme/variants live in `src/app/globals.css`; no `tailwind.config`.
- Animations via `tw-animate-css` utilities; keep durations subtle and consistent.
- Focus visibility: interactive elements keep the default `outline-ring/50` treatment — do not remove focus styles.
- `cn()` from `src/lib` (or wherever the project's `cn` helper lives) for conditional classes; never string-concatenate class names.

## 6. Verification gate — run before declaring any UI work done

In this order:
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run test:run` (Vitest; tests live in `__tests__/` directories)

New components need tests in a `__tests__/` directory next to the component's directory. If any step fails, fix it before continuing.
