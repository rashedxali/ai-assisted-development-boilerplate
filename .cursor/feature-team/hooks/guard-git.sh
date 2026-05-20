#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$ROOT"

exec bun .cursor/feature-team/src/hooks/guard-git.ts
