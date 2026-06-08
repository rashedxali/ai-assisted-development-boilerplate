# Project structure and component conventions

Engineering standards (performance, UI system, architecture, and more) are mandatory — see **[engineering-rules.md](engineering-rules.md)**.

This document describes how we organize a **Next.js App Router + TypeScript** project.

---

## Folder layout

```
src/ (or repo root)
│
├── app/
│   ├── (public)/               # Public routes — no auth required
│   │   ├── page.tsx
│   │   ├── about/page.tsx
│   │   └── pricing/page.tsx
│   │
│   ├── (dashboard)/            # Authenticated routes — shared dashboard layout
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── users/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── settings/page.tsx
│   │
│   ├── api/                    # API route handlers
│   │   ├── auth/route.ts
│   │   └── web-vitals/route.ts
│   │
│   ├── layout.tsx              # Root layout
│   ├── loading.tsx             # Root loading UI
│   ├── error.tsx               # Root error boundary
│   ├── not-found.tsx           # 404 page
│   └── globals.css             # Global styles + Tailwind theme tokens
│
├── features/                   # Feature modules — each owns its full vertical slice
│   └── <feature>/
│       ├── actions/            # Next.js Server Actions
│       ├── components/         # Feature-specific UI components
│       ├── hooks/              # Feature-specific hooks
│       ├── queries/            # Data fetching (TanStack Query or raw fetch)
│       ├── schemas/            # Zod validation schemas
│       ├── services/           # API calls for this feature
│       ├── types/              # Feature-specific types
│       └── utils/              # Feature-specific pure helpers
│
├── components/
│   ├── ui/                     # shadcn/ui primitives (button, dialog, input, card…)
│   ├── globals/                # Mandatory project-specific primitives
│   │   ├── typography/         # BodyText, HeadingText, LeadText
│   │   ├── buttons/            # Button, SizeButton, QuantityButton…
│   │   ├── inputs/             # AppInput, AppPasswordInput…
│   │   └── others/             # Other shared primitives (e.g. WebVitals)
│   ├── layout/                 # Page chrome — header, footer, sidebar, nav
│   ├── common/                 # Shared non-route helpers, error boundaries, wrappers
│   └── scope/                  # Simple UI owned by exactly one route (no full feature module needed)
│
├── hooks/                      # Shared custom hooks used across multiple features
├── lib/                        # Third-party library setup — one file per package, no business logic
├── stores/                     # Global client state (Zustand / Redux)
├── providers/                  # React context providers (theme, query client, auth…)
├── services/                   # Shared domain logic / API calls not tied to a single feature
├── utils/                      # Pure, stateless helpers (formatting, date math, string transforms)
├── types/                      # Shared TypeScript types used across more than one module
├── constants/                  # App-wide constants (routes, roles, copy)
├── config/                     # Env validation (env.ts), SEO config (seo.ts)
│
└── proxy.ts               # Auth, redirects, locale routing
```

---

## Folder decision guide

### `features/` vs `components/scope/`

| Situation | Use |
|-----------|-----|
| Feature has actions, schemas, services, or queries | `features/<name>/` |
| Simple route-specific UI components only | `components/scope/<name>/` |

Start in `components/scope/`. Promote to `features/<name>/` when the feature grows beyond pure UI.

### `features/<name>/` internals

| Subfolder | Contains |
|-----------|----------|
| `actions/` | Next.js Server Actions (`"use server"`) |
| `components/` | Feature UI — renders data from hooks/queries |
| `hooks/` | Feature-scoped stateful logic, derived values |
| `queries/` | TanStack Query query/mutation definitions or raw fetch functions |
| `schemas/` | Zod schemas for forms and API validation |
| `services/` | Direct API/DB calls (called by actions or queries, not components) |
| `types/` | Feature-specific types; move to `types/` when shared |
| `utils/` | Feature-specific pure helpers; move to `utils/` when shared |

### `services/` (root) vs `features/<name>/services/`

- **Root `services/`** — shared domain logic called by multiple features (e.g. auth token refresh, shared analytics)
- **`features/<name>/services/`** — API calls specific to that feature

### `lib/` vs `utils/` vs `config/`

| Folder | Rule |
|--------|------|
| `lib/` | Third-party library setup — one file per package, wraps or configures it, no business logic |
| `utils/` | Pure stateless transforms — formatting, clamping, validation; no network, no external deps |
| `config/` | Env validation (`env.ts`), SEO defaults (`seo.ts`) — read at startup, not in hot paths |

### `stores/`

Global client state that must survive navigation (UI state, auth session cache, etc.). Use Zustand or Redux. Do **not** duplicate server state here — that belongs in TanStack Query.

---

## Component structure

**Components render UI only.** Business logic, data fetching, and transforms must live outside the component — see [engineering-rules.md §22](engineering-rules.md#22-component--ui-only-separation-of-concerns).

Prefer this order inside components:

1. Hook calls (data + state — from `hooks/` or `features/<name>/hooks/`)
2. Event handlers (thin — delegate to hooks/utils, no logic inline)
3. Return TSX

Co-locate small subcomponents in the same file or a sibling file under the same folder.

---

## Naming

- **Files:** `kebab-case.tsx` / `kebab-case.ts` everywhere under `components/` and `features/`
- **Components:** `PascalCase` function names (`PageHeader`, `StatsCard`, `BodyText`)
- **Props:** Always type props (`type Props` or inline `{ ... }: Props`)

---

## Route groups

| Group | Purpose |
|-------|---------|
| `app/(public)/` | Marketing, landing, and unauthenticated pages — no auth middleware |
| `app/(dashboard)/` | Authenticated app — shares a dashboard layout with nav/sidebar |
| `app/api/` | API route handlers — never import client components here |

Route groups use `(name)` parentheses and are invisible in the URL. Add `layout.tsx` inside a group to scope the shell to those routes only.

---

## Next.js notes

- Prefer **Server Components** by default; add **`"use client"`** only when you need browser APIs, event handlers, or client hooks.
- Add **`proxy.ts`** when you implement auth, redirects, or locale routing.
- Follow the framework version in `package.json` (**Next.js 16.2.6**) and official Next.js docs when APIs change. Consult `node_modules/next/dist/docs/` for this version's APIs.

---

## Optional tooling (install only if used)

| Concern | Placement |
|---------|-----------|
| Forms | React Hook Form — schemas in `features/<name>/schemas/`, field components in `components/ui/` |
| Server/async state | TanStack Query — query defs in `features/<name>/queries/`, provider in `providers/` |
| Global client state | Zustand / Redux — stores in `stores/`, provider in `providers/` |
| HTTP | Axios or `fetch` wrapper in `lib/fetcher.ts`, called from `services/` or feature services |
| Auth | Next-Auth / Clerk — config in `lib/auth/`, Server Actions in `features/auth/actions/` |
| DB | Prisma / Drizzle — client in `lib/db/`, queries in feature `queries/` or `services/` |

Do **not** add these packages until the feature needs them.

---

## Error handling

- Root `app/error.tsx` catches unhandled errors across the app.
- Add `error.tsx` per route segment for isolated error scopes.
- Wrap fragile subtrees with `react-error-boundary` when finer control is needed.

---

## Checklist

- [ ] **[engineering-rules.md](engineering-rules.md)** — all mandatory standards met
- [ ] Typography, buttons, and inputs use **`components/globals/`** — no custom one-offs
- [ ] Kebab-case filenames; PascalCase component identifiers; typed props
- [ ] `ui` / `globals` / `common` / `layout` / `scope` respected — no dumping at `components/` root
- [ ] Feature with actions, schemas, or services lives in `features/<name>/` not `components/scope/`
- [ ] Components render UI only — no business logic, fetch calls, or transforms inline ([§22](engineering-rules.md#22-component--ui-only-separation-of-concerns))
- [ ] Logic split: `hooks/` (stateful/derived), `services/` (shared domain), feature `services/` (feature-specific), `utils/` (pure), `lib/` (third-party config)
- [ ] Global client state in `stores/`, not duplicating server/query state
- [ ] Env variables validated in `config/env.ts` — never read `process.env` raw in components
- [ ] `error.tsx` present at root; fragile subtrees have error boundaries
- [ ] Types in `types/` (shared) or `features/<name>/types/` (feature-scoped)
