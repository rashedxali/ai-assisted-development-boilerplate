#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

TASK="${1:-}"
if [ -z "$TASK" ]; then
  echo "Usage: spawn-developer.sh \"<task description>\"" >&2
  exit 1
fi

AGENT_PROMPT_FILE="$ROOT/.cursor/feature-team/agents/developer.md"
if [ ! -f "$AGENT_PROMPT_FILE" ]; then
  echo "Developer prompt not found: $AGENT_PROMPT_FILE" >&2
  exit 1
fi

bun run feature-team set-task "$TASK"
STATE_JSON="$(bun run feature-team inspect --json 2>/dev/null || bun .cursor/feature-team/src/cli.ts inspect --json)"

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

## Assigned task

$TASK

Implement the task, run lint on changed files, then signal done with:
bun run feature-team signal-done --linted-files=<paths>"

if [ "${FEATURE_TEAM_DRY_RUN:-}" = "1" ]; then
  echo "[dry-run] Would spawn developer with task: $TASK"
  bun run feature-team signal-done --linted-files=dry-run-placeholder.ts
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

echo "Spawning developer subprocess..."
"$CURSOR_AGENT" --print --force --prompt "$PROMPT"
EXIT_CODE=$?

bun run feature-team inspect
exit $EXIT_CODE
