# Codebase overview

**Next.js App Router** project (TypeScript). Routes live under `app/`, all UI under `components/`, non-UI logic split across `hooks/`, `lib/`, `utils/`, `services/`, `providers/`, `constants/`, and `types/`.

---

## Folder map

### `app/`

Routes, layouts, and global CSS (`globals.css`). Each folder is a route segment. Add dev-only pages (e.g. `/style-guide`) here to preview tokens and components locally.

### `components/`

All React UI — never put components outside this tree.

| Sub-folder | What goes here |
|------------|----------------|
| `components/ui/` | Generic, unstyled-or-minimally-styled primitives — shadcn/ui, Base UI, `cva` patterns (`button`, `input`, `dialog`, etc.) |
| `components/globals/` | Project design-system primitives: typography (`body-text`, `heading-text`, `lead-text`), global buttons, inputs. **Mandatory** — never write custom typography, buttons, or inputs in feature code |
| `components/layout/` | Page chrome shared across routes: `header`, `footer`, `sidebar`, nav wrappers |
| `components/common/` | Small cross-cutting helpers not tied to any route (error boundaries, portal wrappers, etc.) |
| `components/scope/` | Components owned by exactly one parent component — not shared with others. Nest under the parent: `components/scope/<parent>/`. Example: `LiveBadge` used only inside `Card` → `components/scope/card/live-badge.tsx` |

### `hooks/`

Shared custom React hooks reusable across multiple features (e.g. `useDebounce`, `useMediaQuery`). Co-locate a hook with its feature under `components/scope/<feature>/` if it is only used there.

### `lib/`

Third-party library setup and configuration — Axios instance, Swiper config, `cn` utility, and similar. Each file configures or wraps one external package. No business logic.

### `utils/`

Pure, stateless helper functions with no external dependencies — formatting, validation, date math, string transforms.

### `types/`

Shared TypeScript types and interfaces used across more than one module. Co-locate types inside the module if they are not shared.

### `services/`

Domain logic that calls external APIs or performs async I/O. Group by domain (e.g. `services/auth/login.ts`, `services/orders/create.ts`).

### `providers/`

React context providers, theme setup, and query clients. Wrap the app tree in `app/layout.tsx`.

### `constants/`

App-wide constants: route paths, role names, static copy, lookup tables, and other values that must not be magic strings.

---

For naming rules, folder checklist, and file conventions see **[project-structure.md](project-structure.md)**.  
All implementation must align with **[engineering-rules.md](engineering-rules.md)** (mandatory engineering standards).
