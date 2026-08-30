# Getting started

## Before you begin

- **Node.js:** use **20.x or newer** (LTS recommended). This project targets **Next.js 16.2.6**; older Node versions often break the toolchain.
- **Package manager:** use **Bun** or **npm** — both work with the scripts in `package.json`.

## Option A — Create a new project (recommended)

```bash
npx create-agent-driven-app my-app
cd my-app
bun install
bun run setup   # only if you cloned the template repo instead of using npx
bun dev
```

The CLI prompts for optional features (Husky, Lighthouse CI, Fumadocs, Sentry, Storybook, Infisical, and more), then scaffolds a trimmed project.

## Option B — Clone this repo and configure in place

```bash
git clone git@github.com:rashedxali/agent-driven-development.git
cd agent-driven-development
bun install
bun run setup      # interactive — pick which features to keep
bun dev
```

### Non-interactive setup

```bash
bun run setup -- --yes                              # accept defaults
bun run setup -- --no-fumadocs --sentry --infisical # pick specific features
bun run setup -- --force --yes                      # re-run (clears .next/)
```

Flags: `--husky`, `--lighthouse`, `--github-ci`, `--fumadocs`, `--agent-tooling`, `--sentry`, `--storybook`, `--infisical` (prefix with `--no-` to disable).

## Optional features

| Feature | Default | Description |
|---------|---------|-------------|
| Husky + Commitlint | on | Git hooks — lint, typecheck, commit format, push guards |
| Lighthouse CI | on | Local + CI performance, a11y, SEO audits |
| GitHub Actions | on | Lighthouse workflow on pull requests |
| Fumadocs | on | Documentation site at `/docs` |
| Agent tooling | on | Cursor/Claude skills and AI workflow docs |
| Sentry | off | Error monitoring with Session Replay |
| Storybook | off | Component stories, Vitest browser tests, Chromatic |
| Infisical | off | Secret management via CLI for local dev scripts |

## Install dependencies

With Bun:

```bash
bun install
```

With npm:

```bash
npm install
```

## Run the development server

```bash
bun dev
```

or

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Infisical (when enabled)

1. Run `infisical init` once at the project root.
2. Add secrets in [Infisical Cloud](https://app.infisical.com) (dev environment).
3. Use `bun dev` — secrets are injected as `process.env`.
4. Use `bun run dev:build` / `bun run dev:start` for local prod preview with secrets.
5. CI and Husky use plain `bun run build` / `bun run perf` — no Infisical wrapper.

Prefix client-exposed secrets with `NEXT_PUBLIC_`.

## Optional checks

```bash
npm run lint
npm run typecheck
npm run build
npm run perf       # when Lighthouse CI is enabled
```

Use these before opening a PR to catch type and lint issues early.

## Engineering standards

Everyone working in this repo must follow **[engineering-rules.md](engineering-rules.md)** (performance, design system, accessibility, security, and related gates).

For how the repo is organized, see **[Codebase overview](codebase.md)** and **[Project structure](project-structure.md)**.

## Troubleshooting

- **Weird Next or TypeScript errors after switching branches or re-running setup:** remove `.next/`, reinstall, and run `npm run build` again. Re-running `bun run setup -- --force` clears `.next/` automatically.
- **`instrumentation.ts` not found after disabling Sentry:** delete `.next/` — stale cache from when Sentry was enabled.
- **Infisical / dev script fails:** run `infisical init`, ensure you are logged in, and verify secrets exist in your Infisical project.
- **Port 3000 already in use:** stop the other process or run Next on another port, for example `PORT=3001 npm run dev`.
- **Wrong Node version:** run `node -v`; switch to Node 20+ with nvm, fnm, or volta.
