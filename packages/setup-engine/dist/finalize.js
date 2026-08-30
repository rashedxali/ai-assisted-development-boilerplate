import { join } from "node:path";
import { readTextFile, writeTextFile } from "./utils.js";
const BOILERPLATE_SCRIPTS = new Set(["setup", "build:packages", "prepare", "feature-team"]);
/**
 * Cleans package.json for a scaffolded app (not the monorepo template repo).
 */
export async function finalizeScaffoldPackageJson(targetDir, options) {
    const pkgPath = join(targetDir, "package.json");
    const content = await readTextFile(pkgPath);
    if (!content)
        return;
    const pkg = JSON.parse(content);
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
export async function pinResolvableVersions(targetDir) {
    const pkgPath = join(targetDir, "package.json");
    const content = await readTextFile(pkgPath);
    if (!content)
        return;
    const pkg = JSON.parse(content);
    if (pkg.devDependencies?.["@tailwindcss/postcss"] === "^4") {
        pkg.devDependencies["@tailwindcss/postcss"] = "^4.3.3";
    }
    if (pkg.devDependencies?.tailwindcss === "^4") {
        pkg.devDependencies.tailwindcss = "^4.3.3";
    }
    await writeTextFile(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
}
