import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative } from "node:path";
import { existsSync } from "node:fs";
export async function pathExists(path) {
    try {
        await readFile(path);
        return true;
    }
    catch {
        return existsSync(path);
    }
}
export async function removePath(targetPath) {
    if (!(await pathExists(targetPath)))
        return;
    await rm(targetPath, { recursive: true, force: true });
}
export async function copyAddonDir(sourceDir, targetDir) {
    if (!(await pathExists(sourceDir))) {
        throw new Error(`Addon source not found: ${sourceDir}`);
    }
    await cp(sourceDir, targetDir, { recursive: true });
}
export async function copyAddonPaths(addonRoot, targetRoot, paths) {
    for (const relPath of paths) {
        const source = join(addonRoot, relPath);
        const dest = join(targetRoot, relPath);
        await mkdir(dirname(dest), { recursive: true });
        await cp(source, dest, { recursive: true });
    }
}
export async function readTextFile(path) {
    try {
        return await readFile(path, "utf-8");
    }
    catch {
        return null;
    }
}
export async function writeTextFile(path, content) {
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content, "utf-8");
}
export function rel(from, to) {
    return relative(from, to);
}
