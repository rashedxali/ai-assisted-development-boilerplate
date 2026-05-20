# DEVELOPING procedure

You are the **Lead**. Current state: **DEVELOPING**.

## Goals

1. Assign a clear task for this iteration.
2. Spawn the developer subprocess and wait for it to finish.
3. Verify `developerDone` and `lintRanIteration` in state.
4. Transition to REVIEWING.

## Required CLI steps

```bash
# Assign task and spawn developer:
.cursor/feature-team/scripts/spawn-developer.sh "<task description>"

# Inspect state after subprocess exits:
bun run feature-team inspect

# Transition when developer signalled done:
bun run feature-team transition REVIEWING
```

## Rules

- Do **not** implement code yourself — delegate to the developer subprocess.
- Do **not** commit during DEVELOPING (hooks will block `git commit`).
- If the developer fails or does not signal done, transition to BLOCKED and explain to the user.

## Signal prefix

`DEVELOPING (Iteration N): Developer implementing`
