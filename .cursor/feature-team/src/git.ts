import { execSync } from "node:child_process";
import type { GitInfo } from "./types";
import { getRepoRoot } from "./paths";

function runGit(args: string): string {
  return execSync(`git ${args}`, {
    cwd: getRepoRoot(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function runGitSafe(args: string): string | null {
  try {
    return runGit(args);
  } catch {
    return null;
  }
}

export function detectDefaultBranch(): string {
  const symbolic = runGitSafe("symbolic-ref refs/remotes/origin/HEAD");
  if (symbolic) {
    const match = symbolic.match(/refs\/remotes\/origin\/(.+)/);
    if (match?.[1]) {
      return match[1];
    }
  }

  if (runGitSafe("rev-parse --verify main")) {
    return "main";
  }

  if (runGitSafe("rev-parse --verify master")) {
    return "master";
  }

  return "main";
}

export function getGitInfo(): GitInfo {
  const defaultBranch = detectDefaultBranch();
  const status = runGitSafe("status --porcelain") ?? "";
  const currentBranch = runGitSafe("branch --show-current") ?? "";
  const headCommit = runGitSafe("rev-parse HEAD") ?? "";

  let commitsAhead = false;
  if (currentBranch) {
    const count = runGitSafe(`rev-list ${defaultBranch}..HEAD --count`);
    commitsAhead = count !== null && Number(count) > 0;
  }

  return {
    workingTreeClean: status.length === 0,
    currentBranch,
    hasCommitsVsDefault: commitsAhead,
    headCommit,
    defaultBranch,
  };
}

export function getUncommittedDiff(): string {
  const staged = runGitSafe("diff --cached") ?? "";
  const unstaged = runGitSafe("diff") ?? "";
  return [staged, unstaged].filter(Boolean).join("\n\n");
}
