# REVIEWING procedure

You are the **Lead**. Current state: **REVIEWING**.

## Goals

1. Spawn the reviewer subprocess.
2. Wait for APPROVED or REJECTED verdict in state.
3. On APPROVED → transition to COMMITTING.
4. On REJECTED → transition to DEVELOPING (starts next iteration with feedback).

## Required CLI steps

```bash
# Spawn reviewer:
.cursor/feature-team/scripts/spawn-reviewer.sh

# Inspect verdict:
bun run feature-team inspect

# If approved:
bun run feature-team transition COMMITTING

# If rejected:
bun run feature-team transition DEVELOPING
```

## Rules

- Do **not** review code yourself — delegate to the reviewer subprocess.
- Do **not** commit during REVIEWING (hooks will block `git commit`).

## Signal prefix

`REVIEWING: Reviewer evaluating uncommitted changes`
