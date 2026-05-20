#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

AGENT_PROMPT_FILE="$ROOT/.cursor/feature-team/agents/reviewer.md"
if [ ! -f "$AGENT_PROMPT_FILE" ]; then
  echo "Reviewer prompt not found: $AGENT_PROMPT_FILE" >&2
  exit 1
fi

STATE_JSON="$(bun run feature-team inspect --json 2>/dev/null || bun .cursor/feature-team/src/cli.ts inspect --json)"
DIFF="$(git diff; git diff --cached)"

find_cursor_agent() {
  if command -v cursor-agent >/dev/null 2>&1; then
    command -v cursor-agent
    return 0
  fi

  for candidate in \
    "$HOME/.cursor/bin/cursor-agent" \
    "$HOME/.local/bin/cursor-agent" \
    "/usr/local/bin/cursor-agent"; do
    if [ -x "$candidate" ]; then
      echo "$candidate"
      return 0
    fi
  done

  return 1
}

PROMPT="$(cat "$AGENT_PROMPT_FILE")

---

## Current workflow state

\`\`\`json
$STATE_JSON
\`\`\`

## Uncommitted diff

\`\`\`diff
$DIFF
\`\`\`

Run typecheck, build, and lint. Then signal APPROVED or REJECTED via the workflow CLI."

if [ "${FEATURE_TEAM_DRY_RUN:-}" = "1" ]; then
  echo "[dry-run] Would spawn reviewer"
  bun run feature-team signal-review APPROVED
  exit 0
fi

CURSOR_AGENT="$(find_cursor_agent || true)"
if [ -z "$CURSOR_AGENT" ]; then
  echo "error: cursor-agent not found on PATH." >&2
  echo "Install Cursor CLI or set FEATURE_TEAM_DRY_RUN=1 for local testing." >&2
  exit 127
fi

if [ -z "${CURSOR_API_KEY:-}" ]; then
  echo "warning: CURSOR_API_KEY is not set. cursor-agent may fail auth." >&2
fi

echo "Spawning reviewer subprocess..."
"$CURSOR_AGENT" --print --force --prompt "$PROMPT"
EXIT_CODE=$?

bun run feature-team inspect
exit $EXIT_CODE
