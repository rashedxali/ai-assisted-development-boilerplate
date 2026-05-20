import { z } from "zod";

export const workflowStateNames = [
  "PLANNING",
  "DEVELOPING",
  "REVIEWING",
  "COMMITTING",
  "BLOCKED",
  "COMPLETE",
] as const;

export type WorkflowStateName = (typeof workflowStateNames)[number];

export const iterationSchema = z.object({
  task: z.string(),
  developerDone: z.boolean(),
  developingHeadCommit: z.string().nullable(),
  reviewApproved: z.boolean(),
  reviewRejected: z.boolean(),
  rejectionReasons: z.array(z.string()),
  lintedFiles: z.array(z.string()),
  lintRanIteration: z.boolean(),
});

export type Iteration = z.infer<typeof iterationSchema>;

export const eventLogEntrySchema = z.object({
  op: z.string(),
  at: z.string(),
  detail: z.record(z.string(), z.unknown()),
});

export type EventLogEntry = z.infer<typeof eventLogEntrySchema>;

export const featureTeamStateSchema = z.object({
  state: z.enum(workflowStateNames),
  iteration: z.number().int().min(0),
  iterations: z.array(iterationSchema),
  featureBranch: z.string().nullable(),
  userApprovedPlan: z.boolean(),
  plan: z.string(),
  eventLog: z.array(eventLogEntrySchema),
});

export type FeatureTeamState = z.infer<typeof featureTeamStateSchema>;

export function createEmptyIteration(task = ""): Iteration {
  return {
    task,
    developerDone: false,
    developingHeadCommit: null,
    reviewApproved: false,
    reviewRejected: false,
    rejectionReasons: [],
    lintedFiles: [],
    lintRanIteration: false,
  };
}

export function createInitialState(): FeatureTeamState {
  return {
    state: "PLANNING",
    iteration: 0,
    iterations: [],
    featureBranch: null,
    userApprovedPlan: false,
    plan: "",
    eventLog: [],
  };
}
