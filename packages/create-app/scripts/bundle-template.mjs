#!/usr/bin/env node
/**
 * Bundles the monorepo template into packages/create-app/template/
 * for publishing. Run from packages/create-app after build.
 */
import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, "..");
const repoRoot = resolve(packageRoot, "../..");
const templateDir = join(packageRoot, "template");
const addonsDest = join(templateDir, "addons");

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

async function copyFiltered(source, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    if (EXCLUDE_DIRS.has(entry.name) || EXCLUDE_FILES.has(entry.name)) {
      continue;
    }

    const srcPath = join(source, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyFiltered(srcPath, destPath);
    } else {
      await cp(srcPath, destPath);
    }
  }
}

async function main() {
  await rm(templateDir, { recursive: true, force: true });
  await copyFiltered(repoRoot, templateDir);
  await cp(resolve(repoRoot, "addons"), addonsDest, { recursive: true });
  console.log("Template bundled to", templateDir);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
