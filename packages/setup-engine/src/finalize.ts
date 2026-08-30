import { join } from "node:path";
import { readTextFile, writeTextFile } from "./utils.js";

type PackageJson = {
  name?: string;
  private?: boolean;
  workspaces?: string[];
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
};

const BOILERPLATE_SCRIPTS = new Set(["setup", "build:packages", "prepare", "feature-team"]);

/**
 * Cleans package.json for a scaffolded app (not the monorepo template repo).
 */
export async function finalizeScaffoldPackageJson(
  targetDir: string,
  options: { name: string },
): Promise<void> {
  const pkgPath = join(targetDir, "package.json");
  const content = await readTextFile(pkgPath);
  if (!content) return;

  const pkg = JSON.parse(content) as PackageJson;
  pkg.name = options.name;
  delete pkg.workspaces;

  if (pkg.scripts) {
    for (const key of BOILERPLATE_SCRIPTS) {
      delete pkg.scripts[key];
    }
  }

  await writeTextFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}

/**
 * Ensures Tailwind PostCSS resolves cleanly without a lockfile.
 */
export async function pinResolvableVersions(targetDir: string): Promise<void> {
  const pkgPath = join(targetDir, "package.json");
  const content = await readTextFile(pkgPath);
  if (!content) return;

  const pkg = JSON.parse(content) as PackageJson;

  if (pkg.devDependencies?.["@tailwindcss/postcss"] === "^4") {
    pkg.devDependencies["@tailwindcss/postcss"] = "^4.3.3";
  }

  if (pkg.devDependencies?.tailwindcss === "^4") {
    pkg.devDependencies.tailwindcss = "^4.3.3";
  }

  await writeTextFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
