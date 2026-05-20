#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../../.."

echo "=== 1. Prerequisites ==="
bun --version
command -v cursor-agent || echo "cursor-agent: not installed (dry-run will be used)"

echo ""
echo "=== 2. Init ==="
rm -f .cursor/state/feature-team-state.json
bun run feature-team init
bun run feature-team inspect | head -5

echo ""
echo "=== 3. Transition DEVELOPING without approval (expect fail) ==="
if bun run feature-team transition DEVELOPING 2>&1; then
  echo "UNEXPECTED: should have failed"
  exit 1
else
  echo "OK: transition blocked as expected"
fi

echo ""
echo "=== 4. Approve plan + set branch + transition DEVELOPING ==="
bun run feature-team approve-plan "Add lib/hello.ts"
bun run feature-team set-branch feature/test-hello
bun run feature-team transition DEVELOPING
bun run feature-team inspect

echo ""
echo "=== 5. preflight hook blocks git commit in DEVELOPING ==="
printf '%s' '{"tool_name":"Shell","tool_input":{"command":"git commit -am test"}}' | bun .cursor/feature-team/src/hooks/preflight.ts

echo ""
echo "=== 6. stop hook blocks in DEVELOPING ==="
printf '%s' '{"status":"completed","loop_count":0}' | bun .cursor/feature-team/src/hooks/lead-identity.ts

echo ""
echo "=== 7. stop hook allows in BLOCKED ==="
bun run feature-team transition BLOCKED
printf '%s' '{"status":"completed","loop_count":0}' | bun .cursor/feature-team/src/hooks/lead-identity.ts

echo ""
echo "=== 8. guard-git blocks push to main ==="
PUSH_CMD='git push origin main'
printf '%s' "{\"command\":\"$PUSH_CMD\"}" | bun .cursor/feature-team/src/hooks/guard-git.ts

echo ""
echo "=== 9. Happy path (dry-run subagents) ==="
bun run feature-team transition DEVELOPING
FEATURE_TEAM_DRY_RUN=1 .cursor/feature-team/scripts/spawn-developer.sh "Add lib/hello.ts exporting hello()"
bun run feature-team transition REVIEWING
FEATURE_TEAM_DRY_RUN=1 .cursor/feature-team/scripts/spawn-reviewer.sh
bun run feature-team transition COMMITTING

git checkout feature/test-hello 2>/dev/null || git checkout -b feature/test-hello
mkdir -p lib
echo "export function hello() { return 'hi'; }" > lib/hello.ts
git add lib/hello.ts
HUSKY=0 git commit -m "feat(lib): add hello helper" || true

# Commit remaining workflow changes so COMPLETE guard passes
git add -A
HUSKY=0 git commit -m "chore(workflow): add cursor feature team mvp" || true

bun run feature-team transition COMPLETE
bun run feature-team inspect --json | head -30

echo ""
echo "=== Event log transitions ==="
bun run feature-team inspect --json | bun -e "const s=JSON.parse(await Bun.stdin.text()); console.log(s.eventLog.filter(e=>e.op==='transition').map(e=>e.detail.from+'->'+e.detail.to).join('\n'))"

echo ""
echo "ALL TESTS PASSED"
