# Project structure and component conventions

Engineering standards (performance, UI system, architecture, and more) are mandatory — see **[engineering-rules.md](engineering-rules.md)**.

This document describes how we organize a **Next.js App Router + TypeScript** project. All UI lives under **`components/`** with predictable sub-folders; add route-specific UI under **`scope/`** when needed.

## Folder layout

| Path | Purpose |
|------|---------|
| [`app/`](../app/) | Routes, layouts, global styles (`globals.css`). Optional `/style-guide` for local token and component review. |
| [`components/`](../components/) | **All React UI.** Sub-folders below — do not dump feature code at the root of `components/`. |
| [`components/ui/`](../components/ui/) | **Generic primitives** (shadcn/ui, Base UI, `cva`): `button.tsx`, `input.tsx`, `dialog.tsx`, etc. Reusable across the app. |
| [`components/common/`](../components/common/) | **Shared non-route helpers:** error boundaries, small wrappers, meta helpers. Not for one-off page content. |
| [`components/layout/`](../components/layout/) | **Page shells and chrome:** `header.tsx`, `footer.tsx`, `sidebar.tsx`, nav, main layout wrappers. |
| [`components/scope/`](../components/scope/) | **Feature- or route-only components** that are not generic primitives or layout chrome. Example: `scope/dashboard/stats-card.tsx`. |
| [`hooks/`](../hooks/) | Shared custom hooks (`use-debounce.ts`, etc.). Create when you adopt them. |
| [`lib/`](../lib/) | Shared modules **with** dependencies beyond tiny helpers: `utils.ts` (`cn` from `clsx` + `tailwind-merge`), fetchers, auth helpers, DB clients. |
| [`utils/`](../utils/) | Pure helpers **without** external services: formatting, validation, slug helpers. |
| [`types/`](../types/) | Shared TypeScript types and interfaces. |
| [`services/`](../services/) | Domain logic calling APIs or `lib/` (e.g. `services/auth/login.ts`). |
| [`providers/`](../providers/) | React context, theme, query clients. |
| [`constants/`](../constants/) | App-wide constants (routes, roles, copy). |

**Optional folders** (create when you adopt them):

- `data/` — fixtures or mock data for local development.
- `components/dashboard/` — dashboard-only UI once you add `/dashboard` routes (or use `scope/dashboard/`).

## Naming

- **Files:** `kebab-case.tsx` / `kebab-case.ts`.
- **Components:** `PascalCase` function names (`PageHeader`, `StatsCard`).
- **Props:** Always type props (`type Props` or inline `{ ... }: Props`).

## Component structure

Prefer this order inside components:

1. State hooks  
2. Handlers / derived values  
3. Effects (`useEffect`, subscriptions)  
4. Return TSX  

Co-locate small subcomponents in the same file or a sibling file under the same folder.

## `lib` vs `utils`

- **`utils/`** — formatting, clamping, pure transforms; no network, DB, or env secrets.
- **`lib/`** — class-name merging (`cn`), fetch wrappers, Prisma client, token parsing, etc.

## Next.js notes

- Prefer **Server Components** by default; add **`"use client"`** only when you need browser APIs, event handlers, or client hooks.
- Add **`middleware.ts`** when you implement auth, redirects, or locale routing.
- Follow the framework version in `package.json` and official Next.js docs when APIs change.

## Optional tooling (install only if used)

| Concern | Typical placement |
|---------|-------------------|
| Forms | React Hook Form — field components under `components/ui/` or shells under `components/common/` / `scope/` as appropriate. |
| Server/async state | TanStack Query — providers in `providers/`. |
| Global client state | Redux or Zustand — store + providers under `providers/` or `lib/store`. |
| HTTP | Axios or `fetch` wrapper in `lib/fetcher.ts`, called from `services/`. |

Do **not** add these packages until the feature needs them.

## Error handling

Important UI trees should be wrapped with **`react-error-boundary`** (or Next.js `error.tsx` boundaries per route) so unexpected errors do not blank the whole app. Place a root error boundary in the root layout or a shared `components/common/` wrapper.

## Checklist

- [ ] **[engineering-rules.md](engineering-rules.md)** (project standards)  
- [ ] Kebab-case filenames; PascalCase component identifiers  
- [ ] Typed props for every component  
- [ ] `ui` vs `common` vs `layout` vs `scope` respected  
- [ ] Logic split: `services/` (domain), `lib/` (IO/clients), `utils/` (pure helpers)  
- [ ] Error boundaries on fragile subtrees  
- [ ] Types live under `types/` (avoid giant inline `any`)
