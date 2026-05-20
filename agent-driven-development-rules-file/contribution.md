# Contribution guidelines

Before opening a PR, confirm your work complies with **[engineering-rules.md](engineering-rules.md)** (performance, design system, state/data, a11y, security).

## Git hooks (local)

After **`npm install`**, the **`prepare`** script configures **Husky**. Hooks run automatically:

| Hook | What runs |
|------|-----------|
| **pre-commit** | **`npm run lint`** and **`npm run typecheck`** |
| **commit-msg** | **Commitlint** — message must match **[commit-guidelines.md](commit-guidelines.md)** (allowed types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `ci`, `perf`; breaking changes use `!` after type or scope; descriptions cannot be only “updated”/“fixed” or start with capitalised “Updated”/“Fixed” — see **Disallowed vague subjects** in that doc). |
| **pre-push** | **`npm run build`** |

To skip temporarily (not recommended): set **`HUSKY=0`** in the environment for that Git invocation.

## Components

All UI lives under **`components/`**. Pick the sub-folder that matches the kind of UI you are adding.

### Where to put new UI

| Kind of UI | Location |
|------------|----------|
| Generic primitive (shadcn/ui, Base UI, `cva`, app-wide controls) | `components/ui/` |
| Error boundaries, small shared non-route helpers | `components/common/` |
| Page shells — Header, Footer, Sidebar, nav, main layout wrappers | `components/layout/` |
| One-off feature / route UI | `components/scope/<feature>/` |
| Shared custom React hooks | `hooks/` |

### File and export conventions

- **Filenames:** `kebab-case.tsx` / `kebab-case.ts`.
- **Component functions:** `PascalCase`.
- **Props:** always typed (`type Props`, exported prop types when reused).
- **Barrels:** use folder-level `index.ts` where it improves imports (e.g. `components/ui/index.ts`).

### Structure inside a component file

Prefer this order:

1. State hooks  
2. Handlers / derived values  
3. Effects (`useEffect`, subscriptions)  
4. Return JSX  

Co-locate tiny subcomponents in the same file or a sibling file in the same folder.

### Client vs server

- Add **`"use client"`** only when the component needs browser-only APIs, event handlers on interactive subtrees that cannot stay server-side, or hooks like `useState` / `useEffect` at the top level.
- Prefer **Server Components** by default so bundles stay smaller.

### Styling

- Use **Tailwind** utility classes; compose with **`cn`** from [`lib/utils.ts`](../lib/utils.ts) when merging conditional classes.
- Prefer **design tokens** from [`globals.css`](../app/globals.css) for consistent spacing, color, and typography.

## Hooks

When you add shared hooks:

- Create **`hooks/`** at the repo root (or co-locate next to the feature under `scope/` if truly single-use).
- **Filename:** `use-something.ts` or `use-something.tsx` if it returns JSX (rare).
- **Name:** exported function `useSomething` matching the file.
- Keep hooks **pure** where possible; network and side effects belong in clearly named hooks, not buried inside random components.

## Framework and tooling

- Use the **Next.js** version pinned in `package.json` and official docs when something does not match older blog posts.
- Do **not** add optional stacks (TanStack Query, Zustand, etc.) until a feature requires them; see [Project structure — optional tooling](project-structure.md#optional-tooling-install-only-if-used).

## Checklist before you open a PR

- [ ] **[engineering-rules.md](engineering-rules.md)** respected (performance, design system, a11y, security, etc.)
- [ ] Right folder under **`components/`** (`ui` vs `common` vs `layout` vs `scope`) or **`hooks/`** for shared hooks  
- [ ] Kebab-case files, PascalCase components, typed props  
- [ ] `"use client"` only when needed  
- [ ] **`npm run lint`** and **`npm run typecheck`** (pre-commit hooks run both)
- [ ] **`npm run build`** succeeds (also enforced on **`git push`**)
- [ ] Commit message follows **[commit-guidelines.md](commit-guidelines.md)** (enforced by commit-msg hook)
