import fs from "node:fs";
import { getStateProcedurePath } from "../paths";
import { readState } from "../state-store";
import type { WorkflowStateName } from "../state-schema";

export async function readHookInput<T>(): Promise<T> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) {
    return {} as T;
  }

  return JSON.parse(raw) as T;
}

export function writeHookOutput(payload: Record<string, unknown>): void {
  process.stdout.write(`${JSON.stringify(payload)}\n`);
}

export function loadStateProcedure(stateName: WorkflowStateName): string {
  const procedurePath = getStateProcedurePath(stateName);
  if (!fs.existsSync(procedurePath)) {
    return `# ${stateName}\n\n(No procedure file found.)`;
  }

  return fs.readFileSync(procedurePath, "utf8");
}

export function getWorkflowState(): WorkflowStateName | null {
  const state = readState();
  return state?.state ?? null;
}
