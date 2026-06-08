<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

# Project context

**agent-driven-development** — Next.js App Router project (TypeScript).

## Stack

| Layer | Version / tool |
|-------|----------------|
| Framework | Next.js **16.2.6** (App Router) |
| UI | React **19.2.4** |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS **v4** (via `@tailwindcss/postcss`) |
| Components | shadcn/ui — style: **`radix-nova`** |
| Utilities | `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui` |

## Tailwind v4

There is **no** `tailwind.config.*`. Theme tokens live in `@theme inline {}` inside [`app/globals.css`](app/globals.css). Custom variants use `@custom-variant`. shadcn styles are imported via `@import "shadcn/tailwind.css"`.

## Path alias

`@/*` maps to the repo root (see `tsconfig.json`).

## Class names

Always merge conditional classes with `cn()` from [`lib/utils.ts`](lib/utils.ts).

## Naming conventions

- **Filenames:** `kebab-case.tsx` / `kebab-case.ts` everywhere under `components/`
- **Component functions:** `PascalCase` (`BodyText`, `PageHeader`)
- **Props:** always typed (`type Props` or inline)

## Project structure

See [`rules/project-structure.md`](rules/project-structure.md) for the full folder layout, decision guide, and checklist.

### Key folders

| Path | Purpose |
|------|---------|
| `app/(public)/` | Public-facing routes — no auth |
| `app/(dashboard)/` | Authenticated routes — shared dashboard layout |
| `app/api/` | API route handlers |
| `features/<name>/` | Full feature module: `actions/`, `components/`, `hooks/`, `queries/`, `schemas/`, `services/`, `types/`, `utils/` |
| `components/ui/` | shadcn/ui primitives — add with `npx shadcn@latest add <component>` |
| `components/globals/` | **Mandatory** project primitives: typography, buttons, inputs, others |
| `components/globals/typography/` | `body-text.tsx`, `heading-text.tsx`, `lead-text.tsx` |
| `components/globals/buttons/` | `button.tsx`, `size-button.tsx`, `quantity-button.tsx`, `print-select-button.tsx` |
| `components/globals/inputs/` | `app-input.tsx` |
| `components/globals/others/` | Other shared primitives (e.g. `web-vitals.tsx`) |
| `components/layout/` | Page chrome — `header/header.tsx`, `footer/footer.tsx` |
| `components/common/` | Shared non-route helpers, error boundaries |
| `components/scope/` | Simple route-specific UI with no full feature module needed |
| `hooks/` | Shared custom hooks across multiple features |
| `lib/` | Third-party library setup — one file per package, no business logic |
| `stores/` | Global client state (Zustand / Redux) |
| `providers/` | React context providers |
| `services/` | Shared domain logic not tied to a single feature |
| `utils/` | Pure stateless helpers |
| `types/` | Shared TypeScript types |
| `constants/` | App-wide constants (routes, roles, copy) |
| `config/` | Env validation (`env.ts`), SEO config (`seo.ts`) |

## Typography system (mandatory)

**Always** use the shared typography, button, and input components from `components/globals/`. Custom typography, buttons, or inputs are **prohibited** unless there is genuinely no existing component that can satisfy the requirement.

| Need | Use |
|------|-----|
| Body copy | `BodyText` from `@/components/globals/typography/body-text` |
| Headings | `HeadingText` from `@/components/globals/typography/heading-text` |
| Lead / emphasis | `LeadText` from `@/components/globals/typography/lead-text` |
| Primary actions | `Button` from `@/components/globals/buttons/button` |
| Size / quantity / print selectors | `SizeButton`, `QuantityButton`, `PrintSelectButton` from `@/components/globals/buttons/` |
| Form fields | `AppInput`, `AppPasswordInput`, etc. from `@/components/globals/inputs/app-input` |

- Do **not** use raw Tailwind type classes (`text-lg`, `font-bold`, etc.) when a typography component variant covers the need.
- Do **not** create one-off `<button>`, `<input>`, or styled text elements in feature code.
- If a required variant or control is missing, **extend the existing globals component** rather than building a custom alternative inline.

All three typography components are polymorphic via the `as` prop. Variant keys are size+weight codes (e.g. `"16r"`, `"44l"`).

## Server vs client

- **Server Components** by default
- Add `"use client"` only when you need browser APIs, event handlers, or client hooks (`useState`, `useEffect`, etc.)

## Scripts

```bash
npm run dev        # development server
npm run build      # production build
npm run start      # serve production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check (tsc --noEmit)
```

## Git workflow

- **Never push directly to `main`.** All changes reach `main` through a pull request.
- **Direct git merge is not allowed.** Do not run `git merge` locally into `main` or merge branches outside the PR process.
- Work on a feature branch, open a PR, get review, and merge via the platform (GitHub).

## Git hooks (Husky)

Hooks live in `.husky/` directly:

| Hook | Runs |
|------|------|
| pre-commit | `npm run lint` and `npm run typecheck` |
| commit-msg | Commitlint — follow [`rules/commit-guidelines.md`](rules/commit-guidelines.md) |
| pre-merge-commit | Blocks direct merge into `main` |
| pre-push | Blocks push to `main`; then runs `npm run build` |

## Engineering rules

All implementation must follow the docs in [`rules/`](rules/):

- [`engineering-rules.md`](rules/engineering-rules.md) — mandatory standards (performance, a11y, security)
- [`project-structure.md`](rules/project-structure.md) — folder layout and naming
- [`contribution.md`](rules/contribution.md) — PR checklist and component placement
- [`codebase.md`](rules/codebase.md) — mental model overview
<!-- END:nextjs-agent-rules -->
