# Getting started

## Before you begin

- **Node.js:** use **20.x or newer** (LTS recommended). This project targets **Next.js 16.2.6**; older Node versions often break the toolchain.
- **Package manager:** use **Bun** or **npm** — both work with the scripts in `package.json`.

## 1. Clone the repository

**HTTPS**

```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

**SSH**

```bash
git clone git@github.com:your-org/your-repo.git
cd your-repo
```

Replace `your-org/your-repo` with your actual remote.

## 2. Install dependencies

With Bun:

```bash
bun install
```

With npm:

```bash
npm install
```

## 3. Run the development server

```bash
bun dev
```

or

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Optional checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Use these before opening a PR to catch type and lint issues early. There is no `typecheck` npm script — run `npx tsc --noEmit` directly.

## Engineering standards

Everyone working in this repo must follow **[engineering-rules.md](engineering-rules.md)** (performance, design system, accessibility, security, and related gates).

For how the repo is organized, see **[Codebase overview](codebase.md)** and **[Project structure](project-structure.md)**.

## Troubleshooting

- **Weird Next or TypeScript errors after switching branches:** remove `.next`, reinstall, and run `npm run build` again.
- **Port 3000 already in use:** stop the other process or run Next on another port, for example `PORT=3001 npm run dev` (or your manager’s equivalent).
- **Wrong Node version:** run `node -v`; switch to Node 20+ with nvm, fnm, or volta.
