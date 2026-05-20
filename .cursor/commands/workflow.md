# Feature Team Workflow CLI

Quick reference for the lead agent. All commands run from repo root.

## State

```bash
bun run feature-team init [--idempotent]
bun run feature-team inspect [--json]
bun run feature-team transition <PLANNING|DEVELOPING|REVIEWING|COMMITTING|BLOCKED|COMPLETE>
```

## Planning

```bash
bun run feature-team approve-plan "<markdown plan>"
bun run feature-team set-branch feature/<name>
```

## Subagents

```bash
.cursor/feature-team/scripts/spawn-developer.sh "<task>"
.cursor/feature-team/scripts/spawn-reviewer.sh
```

## Developer / reviewer signals

```bash
bun run feature-team set-task "<task>"
bun run feature-team signal-done --linted-files=path/a.ts,path/b.ts
bun run feature-team signal-review APPROVED
bun run feature-team signal-review REJECTED --reasons="file.ts:1 — reason"
```

## State machine

```
PLANNING → DEVELOPING → REVIEWING → COMMITTING → COMPLETE
                ↑            |
                └────────────┘
```

Any state → BLOCKED. BLOCKED → any active state.

## Enforcement

Hooks block: stopping outside BLOCKED/COMPLETE, git commit during DEVELOPING/REVIEWING, push/merge/commit on main.
