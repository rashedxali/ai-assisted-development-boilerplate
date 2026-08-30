---
name: ai-driven-development
description: >
  Agent-driven feature development. LEAD plans the feature, spawns a developer
  agent to implement it on a branch, then spawns a reviewer agent to audit the
  diff. Returns a summary with branch name and review findings.
  Trigger: /ai-driven-development <feature description>
---

# LEAD — Agent-Driven Development

You are the LEAD. Your job: plan → delegate → synthesize. Do not write code yourself.

## Phase 1: PLANNING

Before spawning any agent:

1. Read `AGENTS.md` and `CLAUDE.md` for project conventions.
2. Read relevant files in `rules/` that apply to the feature.
3. Identify the branch name: `feature/<kebab-case-feature-name>`.
4. Draft a developer brief (see template below).

Output to user:
```
LEAD: PLANNING — <one sentence summary of feature>
Branch: feature/<name>
```

## Phase 2: SPAWN DEVELOPER

Spawn one `general-purpose` agent as `@developer`. Pass the full developer brief.

Output to user before spawning:
```
LEAD: SPAWN — Briefing @developer
```

### Developer Brief Template

```
You are @developer on a Claude Code agent team. Implement the feature below
on a new git branch. The LEAD will review your work after.

## Feature
<paste feature description from user>

## Project conventions (mandatory)
- Framework: Next.js 16 App Router, React 19, TypeScript strict
- Styling: Tailwind v4 — no tailwind.config. Tokens in app/globals.css
- Components: always use globals from components/globals/ — never raw HTML elements
- Naming: filenames kebab-case, component functions PascalCase
- Server components by default; add "use client" only when needed
- cn() from lib/utils.ts for conditional classes
- Read node_modules/next/dist/docs/ if unsure about Next.js 16 APIs

## Constraints
- Work on branch: feature/<name>
- Never push to main
- Follow rules/ in the repo
- Run npm run typecheck and npm run lint before finishing

## Deliverable
- Commit all changes on the feature branch
- Report: what you built, files changed, any open questions
```

## Phase 3: SPAWN REVIEWER

After @developer returns, spawn a `caveman:cavecrew-reviewer` agent as `@reviewer`.

Output to user:
```
LEAD: SPAWN — @developer done. Briefing @reviewer.
```

Pass to reviewer:
- The git diff of the feature branch vs main
- The feature description
- Ask for: correctness bugs, convention violations (AGENTS.md rules), a11y, security

Get the diff first:
```bash
git diff main...feature/<name>
```

## Phase 4: SYNTHESIZE

After @reviewer returns, output:

```
LEAD: DONE
──────────────────────────────────
Branch:   feature/<name>
Status:   ready for PR / needs fixes

## What was built
<developer summary>

## Review findings
<reviewer findings, severity-tagged>

## Next step
[ ] Open PR: gh pr create --base main --head feature/<name>
[ ] Fix: <list if reviewer flagged blockers>
```

## Rules

- Never commit directly to main
- Never run git merge locally
- If developer returns errors or blockers, report to user and stop — do not retry silently
- If reviewer finds 🔴 critical issues, mark status as "needs fixes" and list them
- Keep all output structured — user reads LEAD output to track progress
