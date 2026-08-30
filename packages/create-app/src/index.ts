#!/usr/bin/env node
import { cp, mkdir, readdir } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import * as p from "@clack/prompts";
import {
  applyFeatures,
  finalizeScaffoldPackageJson,
  getDefaultSelections,
  hasYesFlag,
  parseFeatureFlags,
  pinResolvableVersions,
  promptFeatureSelection,
  summarizeSelections,
  type FeatureSelection,
} from "@agent-driven/setup-engine";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const repoRoot = resolve(packageRoot, "../..");

/** Paths excluded when copying the template */
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  "packages",
  "addons",
  ".git-rewrite",
  "dist",
  "template",
  "scripts",
]);

const EXCLUDE_FILES = new Set([
  ".boilerplate.json",
  "bun.lockb",
  "package-lock.json",
  "pnpm-lock.yaml",
  "yarn.lock",
]);

async function copyTemplate(source: string, dest: string): Promise<void> {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name) || EXCLUDE_FILES.has(entry.name)) {
      continue;
    }

    const srcPath = join(source, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyTemplate(srcPath, destPath);
    } else if (entry.isFile()) {
      await cp(srcPath, destPath);
    }
  }
}

function detectPackageManager(): "bun" | "npm" | "pnpm" {
  try {
    execSync("bun --version", { stdio: "ignore" });
    return "bun";
  } catch {
    /* continue */
  }
  try {
    execSync("pnpm --version", { stdio: "ignore" });
    return "pnpm";
  } catch {
    /* continue */
  }
  return "npm";
}

function installDeps(cwd: string, pm: "bun" | "npm" | "pnpm"): void {
  const cmd =
    pm === "bun"
      ? "bun install"
      : pm === "pnpm"
        ? "pnpm install"
        : "npm install";
  execSync(cmd, { cwd, stdio: "inherit" });
}

function initGit(cwd: string): void {
  execSync("git init", { cwd, stdio: "ignore" });
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const positional = argv.filter((a) => !a.startsWith("-"));
  const yes = hasYesFlag(argv);
  const flagOverrides = parseFeatureFlags(argv);

  p.intro("create-agent-driven-app");

  let projectName = positional[0];

  if (!projectName) {
    const input = await p.text({
      message: "Project name",
      placeholder: "my-app",
      validate: (value) => {
        if (!value) return "Project name is required";
        if (!/^[a-z0-9-_]+$/i.test(value)) {
          return "Use letters, numbers, hyphens, and underscores only";
        }
      },
    });

    if (p.isCancel(input)) {
      p.cancel("Cancelled.");
      process.exit(0);
    }

    projectName = input as string;
  }

  const targetDir = resolve(process.cwd(), projectName!);

  if (existsSync(targetDir)) {
    p.log.error(`Directory already exists: ${targetDir}`);
    process.exit(1);
  }

  // Prefer bundled template when published; fall back to monorepo root in dev
  const templateSource = existsSync(join(packageRoot, "template"))
    ? join(packageRoot, "template")
    : repoRoot;

  const s = p.spinner();
  s.start("Copying template…");
  await copyTemplate(templateSource, targetDir);
  s.stop("Template copied.");

  const defaults = {
    ...getDefaultSelections(),
    ...flagOverrides,
  } as FeatureSelection;

  const selections = await promptFeatureSelection({
    defaults,
    yes,
  });

  p.log.info(summarizeSelections(selections));

  const bundled = existsSync(join(packageRoot, "template"));
  const addonsRoot = bundled ? join(packageRoot, "template") : repoRoot;

  s.start("Applying feature selections…");
  await applyFeatures({
    targetDir,
    repoRoot: addonsRoot,
    selections,
  });
  await pinResolvableVersions(targetDir);
  await finalizeScaffoldPackageJson(targetDir, { name: projectName! });
  s.stop("Features applied.");

  s.start("Initializing git…");
  initGit(targetDir);
  s.stop("Git initialized.");

  const pm = detectPackageManager();
  s.start(`Installing dependencies (${pm})…`);
  installDeps(targetDir, pm);
  s.stop("Dependencies installed.");

  p.note(
    [
      `cd ${projectName}`,
      `${pm} dev`,
      selections.storybook ? `${pm} run storybook` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    "Next steps",
  );

  p.outro(`Created ${projectName}`);
}

main().catch((error) => {
  p.log.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
