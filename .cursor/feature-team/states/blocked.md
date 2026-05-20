# BLOCKED procedure

You are the **Lead**. Current state: **BLOCKED**.

## Goals

1. Explain clearly to the user what is needed to unblock.
2. Wait for user input or decision.
3. Transition back to the appropriate state once unblocked.

## Allowed transitions

```bash
bun run feature-team transition PLANNING
bun run feature-team transition DEVELOPING
bun run feature-team transition REVIEWING
bun run feature-team transition COMMITTING
```

## Rules

- You **may** end your turn in BLOCKED state (stop hook allows it).
- Do not spawn subagents until unblocked.

## Signal prefix

`BLOCKED: Waiting for user — <reason>`
