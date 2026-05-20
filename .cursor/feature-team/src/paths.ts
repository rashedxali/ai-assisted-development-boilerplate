import path from "node:path";
import { fileURLToPath } from "node:url";

const featureTeamRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

export function getRepoRoot(): string {
  return path.resolve(featureTeamRoot, "..", "..");
}

export function getStateFilePath(): string {
  return path.join(getRepoRoot(), ".cursor", "state", "feature-team-state.json");
}

export function getFeatureTeamRoot(): string {
  return featureTeamRoot;
}

export function getStateProcedurePath(stateName: string): string {
  return path.join(featureTeamRoot, "states", `${stateName.toLowerCase()}.md`);
}

export function getAgentPromptPath(agentName: string): string {
  return path.join(featureTeamRoot, "agents", `${agentName}.md`);
}
