import fs from "node:fs";
import path from "node:path";
import {
  createInitialState,
  featureTeamStateSchema,
  type FeatureTeamState,
} from "./state-schema";
import { getStateFilePath } from "./paths";

function ensureStateDir(): void {
  const stateDir = path.dirname(getStateFilePath());
  fs.mkdirSync(stateDir, { recursive: true });
}

export function readState(): FeatureTeamState | null {
  const statePath = getStateFilePath();
  if (!fs.existsSync(statePath)) {
    return null;
  }

  const raw = fs.readFileSync(statePath, "utf8");
  return featureTeamStateSchema.parse(JSON.parse(raw));
}

export function writeState(state: FeatureTeamState): void {
  ensureStateDir();
  const statePath = getStateFilePath();
  const tempPath = `${statePath}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, statePath);
}

export function initState(idempotent = false): FeatureTeamState {
  const existing = readState();
  if (existing && idempotent) {
    return existing;
  }

  const state = existing ?? createInitialState();
  writeState(state);
  return state;
}

export function updateState(
  updater: (state: FeatureTeamState) => FeatureTeamState,
): FeatureTeamState {
  const current = readState();
  if (!current) {
    throw new Error("State file not initialized. Run: bun run feature-team init");
  }

  const next = updater(current);
  writeState(next);
  return next;
}

export function getCurrentIteration(state: FeatureTeamState) {
  return state.iterations[state.iteration] ?? null;
}
