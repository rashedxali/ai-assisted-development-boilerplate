# Codebase overview

This is a **Next.js App Router** project (TypeScript). UI is organized under **`app/`** routes and a **`components/`** tree with clear sub-folders for primitives, shared helpers, layout shells, and feature-specific UI.

## Mental model

- **`app/`** — Routes, layouts, and global CSS (`globals.css`). Add internal pages such as **`/style-guide`** when you need to review tokens and components locally.
- **`components/`** — All React UI. Sub-folders:
  - **`components/ui/`** — Generic primitives (e.g. shadcn/ui, Base UI, `cva` patterns such as `button`, `input`, `dialog`).
  - **`components/globals/`** — Project-specific primitives: typography (`body-text`, `heading-text`, `lead-text`), global buttons, inputs. **Always use these for typography, buttons, and inputs** — custom alternatives are prohibited unless no existing component can satisfy the requirement.
  - **`components/common/`** — Cross-cutting pieces that are not route-specific (e.g. error boundaries, small wrappers).
  - **`components/layout/`** — Page shells and shared chrome: `header`, `footer`, `sidebar`, nav.
  - **`components/scope/`** — Feature- or route-specific components when they should not live in `ui/` or `layout/`.
- **`hooks/`** — Shared custom React hooks (`useDebounce`, etc.).
- **`lib/`** — Shared modules with dependencies beyond pure helpers; typically includes `lib/utils.ts` (`cn` for class names). Add fetchers, auth helpers, and clients here as the app grows.
- **`utils/`** — Pure helpers without external services (formatting, validation helpers, etc.).
- **`types/`** — Shared TypeScript types and interfaces.
- **`services/`** — Domain logic that calls APIs or `lib/` (e.g. `services/auth/login.ts`).
- **`providers/`** — React context, theme, and query clients.
- **`constants/`** — App-wide constants (routes, roles, copy).

For the full table, naming rules, and checklist, see **[Project structure](project-structure.md)**.

All implementation must align with **[engineering-rules.md](engineering-rules.md)** (mandatory engineering standards).
