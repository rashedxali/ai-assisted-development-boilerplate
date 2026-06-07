# Agent-Driven Development — Next.js Boilerplate

A production-ready Next.js boilerplate engineered for agent-driven development workflows. Opinionated architecture, strict quality gates, and a comprehensive design system built in from day one.

---

## Stack

| Layer | Version |
|-------|---------|
| Framework | Next.js **16.2.6** (App Router) |
| UI | React **19.2.4** |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS **v4** |
| Components | shadcn/ui — `radix-nova` style |
| Utilities | `cva`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui` |

---

## Quick Start

**Requirements:** Node.js 20+ · Bun or npm

```bash
# Clone
git clone git@github.com:rashedxali/agent-driven-development.git
cd agent-driven-development

# Install
bun install        # or: npm install

# Develop
bun dev            # or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run start        # Serve production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
```

---

## Project Structure

```
├── app/              # Routes, layouts, global CSS (globals.css)
├── components/
│   ├── ui/           # shadcn/ui primitives (button, input, dialog…)
│   ├── globals/      # Mandatory design-system components
│   │   ├── typography/   # BodyText, HeadingText, LeadText
│   │   ├── buttons/      # Button, SizeButton, QuantityButton, PrintSelectButton
│   │   └── inputs/       # AppInput and variants
│   ├── layout/       # Header, Footer, page chrome
│   ├── common/       # Shared non-route helpers
│   └── scope/        # Components owned by a single parent feature
├── hooks/            # Shared custom React hooks
├── lib/              # Third-party config/wrappers (cn, Axios, etc.)
├── utils/            # Pure stateless helpers
├── services/         # Domain logic / external API calls
├── providers/        # React context, query clients, theme
├── constants/        # App-wide constants
└── types/            # Shared TypeScript types
```

---

## Design System

This project enforces a mandatory design system. **Do not** write raw typography, buttons, or inputs in feature code — use the globals components:

| Need | Component |
|------|-----------|
| Body copy | `BodyText` from `@/components/globals/typography/body-text` |
| Headings | `HeadingText` from `@/components/globals/typography/heading-text` |
| Lead / emphasis | `LeadText` from `@/components/globals/typography/lead-text` |
| Primary actions | `Button` from `@/components/globals/buttons/button` |
| Size / quantity / print selectors | `SizeButton`, `QuantityButton`, `PrintSelectButton` |
| Form fields | `AppInput` and variants from `@/components/globals/inputs/app-input` |

All three typography components accept an `as` prop (polymorphic) and use size+weight variant keys like `"16r"` or `"44l"`.

> **Tailwind v4 note:** no `tailwind.config.*` exists. Theme tokens live in `@theme inline {}` inside `app/globals.css`. shadcn styles are imported via `@import "shadcn/tailwind.css"`.

---

## Git Workflow

- **Never push to `main` directly** — all changes go through a pull request.
- **No local git merges into `main`** — merge only via the PR platform.
- Work on a feature branch → push → open PR → review → merge.

### Husky Hooks

| Hook | What it enforces |
|------|-----------------|
| `pre-commit` | `npm run lint` + `npm run typecheck` |
| `commit-msg` | Commitlint — see [`rules/commit-guidelines.md`](rules/commit-guidelines.md) |
| `pre-merge-commit` | Blocks direct merge into `main` |
| `pre-push` | Blocks push to `main`; runs `npm run build` |

### Commit Format

```
feat(scope): add something new
fix: correct broken behavior
chore: housekeeping change
refactor: restructure without behavior change
```

Full rules in [`rules/commit-guidelines.md`](rules/commit-guidelines.md).

---

## Engineering Standards

All work must comply with the rules in [`rules/`](rules/):

| Document | Covers |
|----------|--------|
| [`engineering-rules.md`](rules/engineering-rules.md) | Performance (LCP < 2.5s, CLS < 0.1), a11y, security, design-system gates |
| [`project-structure.md`](rules/project-structure.md) | Folder layout, naming conventions |
| [`contribution.md`](rules/contribution.md) | PR checklist, component placement |
| [`codebase.md`](rules/codebase.md) | Mental model and folder responsibilities |
| [`getting-started.md`](rules/getting-started.md) | Setup, tooling, troubleshooting |

---

## PR Checklist

- [ ] Engineering rules respected (performance, a11y, security)
- [ ] Typography / buttons / inputs use `components/globals/` — no custom one-offs
- [ ] Correct sub-folder under `components/` (`ui` vs `common` vs `layout` vs `scope`)
- [ ] Kebab-case filenames · PascalCase component functions · typed props
- [ ] `"use client"` only where browser APIs / event handlers / client hooks are needed
- [ ] `npm run lint` and `npm run typecheck` pass
- [ ] `npm run build` succeeds
- [ ] Commit messages follow commit guidelines
- [ ] Changes are on a feature branch — not pushed to `main`

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Weird Next / TS errors after branch switch | Delete `.next/`, reinstall, re-run `npm run build` |
| Port 3000 in use | `PORT=3001 npm run dev` |
| Wrong Node version | Switch to Node 20+ via nvm / fnm / volta |
