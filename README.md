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

### Option A — Create a new project (recommended)

```bash
npx create-agent-driven-app my-app
cd my-app
bun dev            # or: npm run dev
```

The CLI asks which optional features you want (Husky, Lighthouse CI, Fumadocs, Sentry, Storybook, and more), then scaffolds a trimmed project.

### Option B — Clone this repo and configure in place

```bash
git clone git@github.com:rashedxali/agent-driven-development.git
cd agent-driven-development
bun install        # or: npm install
bun run setup      # interactive feature selection
bun dev
```

### Non-interactive flags

Skip prompts and use defaults (or override individual features):

```bash
# Accept all defaults
bun run setup -- --yes

# Enable/disable specific features
bun run setup -- --no-fumadocs --sentry --storybook

# Re-run setup (destructive — re-applies from full template state)
bun run setup -- --force --yes --no-husky
```

Available flags: `--husky`, `--lighthouse`, `--github-ci`, `--fumadocs`, `--agent-tooling`, `--sentry`, `--storybook`, `--infisical` (prefix with `--no-` to disable).

Open [http://localhost:3000](http://localhost:3000).

---

## Optional features

During setup you can enable or disable:

| Feature | Default | Description |
|---------|---------|-------------|
| Husky + Commitlint | on | Git hooks for lint, typecheck, commit format |
| Lighthouse CI | on | Performance, a11y, and SEO audits |
| GitHub Actions | on | Lighthouse workflow on pull requests |
| Fumadocs | on | Documentation site at `/docs` |
| Agent tooling | on | Cursor/Claude skills and AI workflow docs |
| Sentry | off | Error monitoring — instrumentation, Session Replay, global error page |
| Storybook | off | Component stories with Vitest browser tests, a11y, and Chromatic |
| Infisical | off | Secret management — `dev` / `dev:build` / `dev:start` use Infisical CLI |

Core stack (Next.js, React, TypeScript, Tailwind v4, shadcn globals) is always included.

Optional add-on sources live in [`addons/`](addons/) (Sentry, Storybook, Infisical, Husky). The setup engine copies or removes them based on your selections. Monorepo tooling lives in [`packages/`](packages/) (`setup-engine`, `create-app` CLI).

### Publishing the CLI

```bash
bun run build:packages          # build setup-engine + bundle template
cd packages/create-app
npm publish                     # publishes create-agent-driven-app
```

---

## Scripts

Default scripts (without Infisical):

```bash
npm run dev          # Development server
npm run build        # Production build (CI / pre-push)
npm run start        # Serve production build
npm run lint         # ESLint
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run setup        # Interactive feature selection (first-time or --force)
npm run lhci         # Lighthouse CI audit (requires build first)
npm run perf         # build + Lighthouse CI
```

When **Infisical** is enabled during setup, these scripts are added or changed:

| Script | Command | Use when |
|--------|---------|----------|
| `dev` | `infisical run -- next dev` | Local dev with secrets injected |
| `dev:build` | `infisical run -- next build` | Local prod build with secrets |
| `dev:start` | `infisical run -- next start` | Local prod server with secrets |
| `build` | `next build` | CI, Husky pre-push, deployments — **no Infisical** |
| `start` | `next start` | Production serve — **no Infisical** |

Infisical setup (one-time): run `infisical init`, add secrets in [Infisical Cloud](https://app.infisical.com), then `bun dev`. Secrets are exposed as `process.env` — use `NEXT_PUBLIC_` prefix for client-side values.

Optional scripts when other features are enabled: `storybook`, `build-storybook`, `deploy-storybook` (Storybook).

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
>
> **Docs styling:** Fumadocs uses a separate stylesheet — `app/docs/docs.css` — so the docs site does not pull Fumadocs CSS into the main app bundle.

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
| `pre-push` | Blocks push to `main`; runs `npm run perf` (Lighthouse CI) |

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
| Weird Next / TS errors after branch switch or `setup --force` | Delete `.next/`, reinstall, re-run `npm run build`. Setup with `--force` clears `.next` automatically. |
| `instrumentation.ts` not found after disabling Sentry | Delete `.next/` — stale cache from when Sentry was enabled |
| Infisical / `dev` fails on first run | Run `infisical init` and log in; ensure secrets exist in your Infisical project |
| Port 3000 in use | `PORT=3001 npm run dev` |
| Wrong Node version | Switch to Node 20+ via nvm / fnm / volta |


---

# About AI-Driven Development Workflow

The biggest feature of this boilerplate is its **agent-driven development workflow**.

Instead of manually prompting an AI for every step, simply run:

```text
/ai-driven-development <feature description>
```

Example:

```text
/ai-driven-development Build a complete authentication system with email/password and Google login.
```

The workflow automatically coordinates multiple AI agents that follow your project's engineering standards, architecture, and development workflow.

## How It Works

### 1. 🧠 LEAD Agent — Planning

The **LEAD** agent never writes code.

Instead, it:

- Reads `AGENTS.md` and `CLAUDE.md`
- Reads relevant documents inside `rules/`
- Understands the requested feature
- Creates an implementation plan
- Generates a feature branch

Example:

```text
feature/user-authentication
```

It then creates a detailed implementation brief for the developer agent.

---

### 2. 👨‍💻 Developer Agent

The **Developer** agent receives the complete implementation brief and:

- Creates the feature on its own branch
- Follows all project conventions
- Uses the mandatory design system
- Keeps Server Components by default
- Implements the requested feature
- Runs:

```bash
npm run lint
npm run typecheck
```

before finishing.

The developer reports:

- What was built
- Files changed
- Any remaining questions

---

### 3. 🔍 Reviewer Agent

After development finishes, a dedicated reviewer agent automatically audits the implementation.

It reviews:

- Git diff against `main`
- Engineering rules
- Accessibility
- Security
- Performance
- Architecture
- Design system compliance
- Project conventions

It also checks for:

- Bugs
- Missing edge cases
- Code quality issues
- Violations of `AGENTS.md`
- Violations of `rules/`

---

### 4. 📋 LEAD Summary

Finally, the LEAD agent combines both reports into a structured summary.

Example:

```text
LEAD: DONE

Branch:
feature/user-authentication

Status:
Ready for PR

What was built
✔ Authentication
✔ Google Login
✔ Protected Routes
✔ Session Management

Review Findings
🟢 No critical issues
🟡 Improve loading state

Next Steps
□ Open Pull Request
```

---

## Workflow Rules

The workflow automatically enforces the project's engineering standards.

- ✅ Never commits directly to `main`
- ✅ Always creates a feature branch
- ✅ Never performs local merges
- ✅ Runs lint and type checks
- ✅ Uses the required design system
- ✅ Follows every document inside `rules/`
- ✅ Produces review-ready pull requests

---

## Why This Matters

Traditional AI coding requires developers to repeatedly explain project structure, coding standards, architecture, and best practices.

With **Agent-Driven Development**, those rules are already built into the workflow.

Simply describe **what** you want to build, and the agents handle **how** to build it while following your team's engineering standards.

This transforms AI from a code generator into a reliable engineering teammate capable of planning, implementing, reviewing, and preparing production-ready features.
