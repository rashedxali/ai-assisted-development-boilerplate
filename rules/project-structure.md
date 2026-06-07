# Project structure and component conventions

Engineering standards (performance, UI system, architecture, and more) are mandatory — see **[engineering-rules.md](engineering-rules.md)**.

This document describes how we organize a **Next.js App Router + TypeScript** project. All UI lives under **`components/`** with predictable sub-folders; add route-specific UI under **`scope/`** when needed.

## Folder layout

| Path | Purpose |
|------|---------|
| [`app/`](../app/) | Routes, layouts, global styles (`globals.css`). Optional `/style-guide` for local token and component review. |
| [`components/`](../components/) | **All React UI.** Sub-folders below — do not dump feature code at the root of `components/`. |
| [`components/ui/`](../components/ui/) | **Generic primitives** (shadcn/ui, Base UI, `cva`): `button.tsx`, `input.tsx`, `dialog.tsx`, etc. Reusable across the app. |
| [`components/globals/`](../components/globals/) | **Project-specific primitives (mandatory for UI):** typography (`body-text.tsx`, `heading-text.tsx`, `lead-text.tsx`), global buttons, inputs. **Always use these** — custom typography, buttons, or inputs are prohibited unless no existing component can satisfy the requirement. |
| [`components/common/`](../components/common/) | **Shared non-route helpers:** error boundaries, small wrappers, meta helpers. Not for one-off page content. |
| [`components/layout/`](../components/layout/) | **Page shells and chrome:** `header.tsx`, `footer.tsx`, `sidebar.tsx`, nav, main layout wrappers. |
| [`components/scope/`](../components/scope/) | **Components owned by exactly one parent component** — not shared with others. Nest under the parent name. Example: `LiveBadge` used only inside `Card` → `scope/card/live-badge.tsx`. |
| [`hooks/`](../hooks/) | Shared custom hooks reusable across multiple features (`use-debounce.ts`, etc.). Co-locate with the feature under `scope/<feature>/` if only used there. |
| [`lib/`](../lib/) | Third-party library setup and configuration — Axios instance, Swiper config, `cn` utility, etc. Each file configures or wraps one external package. No business logic. |
| [`utils/`](../utils/) | Pure, stateless helpers with no external dependencies: formatting, validation, date math, string transforms. |
| [`types/`](../types/) | Shared TypeScript types and interfaces used across more than one module. Co-locate inside the module if not shared. |
| [`services/`](../services/) | Domain logic that calls external APIs or performs async I/O. Group by domain (e.g. `services/auth/login.ts`, `services/orders/create.ts`). |
| [`providers/`](../providers/) | React context, theme, query clients. |
| [`constants/`](../constants/) | App-wide constants (routes, roles, copy). |

**Optional folders** (create when you adopt them):

- `data/` — fixtures or mock data for local development.
- `components/dashboard/` — dashboard-only UI once you add `/dashboard` routes (or use `scope/dashboard/`).

## Naming

- **Files:** `kebab-case.tsx` / `kebab-case.ts` everywhere under `components/` (including `components/globals/`).
- **Components:** `PascalCase` function names (`PageHeader`, `StatsCard`, `BodyText`).
- **Props:** Always type props (`type Props` or inline `{ ... }: Props`).

## Component structure

Prefer this order inside components:

1. State hooks  
2. Handlers / derived values  
3. Effects (`useEffect`, subscriptions)  
4. Return TSX  

Co-locate small subcomponents in the same file or a sibling file under the same folder.

## `lib` vs `utils`

- **`utils/`** — pure, stateless transforms (formatting, clamping, validation); no network, no external deps.
- **`lib/`** — third-party library setup (`cn`, Axios instance, Swiper config); each file owns one external package, no business logic — that belongs in `services/`.

## Next.js notes

- Prefer **Server Components** by default; add **`"use client"`** only when you need browser APIs, event handlers, or client hooks.
- Add **`middleware.ts`** when you implement auth, redirects, or locale routing.
- Follow the framework version in `package.json` (**Next.js 16.2.6**) and official Next.js docs when APIs change. Consult `node_modules/next/dist/docs/` for this version's APIs.

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
- [ ] Typography, buttons, and inputs use **`components/globals/`** — no custom one-offs  
- [ ] Kebab-case filenames; PascalCase component identifiers  
- [ ] Typed props for every component  
- [ ] `ui` vs `common` vs `layout` vs `scope` respected  
- [ ] Logic split: `services/` (domain/API calls), `lib/` (third-party config/wrappers), `utils/` (pure helpers)  
- [ ] Error boundaries on fragile subtrees  
- [ ] Types live under `types/` (avoid giant inline `any`)
