# COMMITTING procedure

You are the **Lead**. Current state: **COMMITTING**.

## Goals

1. Ensure review is approved and working tree is clean (or commit remaining changes on the feature branch).
2. Commit and push to the feature branch (never `main`).
3. Ask the user whether to run another iteration or finish.

## Required CLI steps

```bash
# Commit and push on feature branch (example):
git add -A
git commit -m "feat(scope): describe change"
git push -u origin "$(git branch --show-current)"

# Another iteration:
bun run feature-team transition DEVELOPING

# Or finish:
bun run feature-team transition COMPLETE
```

## Rules

- Never push to `main`.
- Guards require: working tree clean, lint ran, commits beyond default branch.

## Signal prefix

`COMMITTING: Review approved — committing and pushing`
