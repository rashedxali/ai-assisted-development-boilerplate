/**
 * Cleans package.json for a scaffolded app (not the monorepo template repo).
 */
export declare function finalizeScaffoldPackageJson(targetDir: string, options: {
    name: string;
}): Promise<void>;
/**
 * Ensures Tailwind PostCSS resolves cleanly without a lockfile.
 */
export declare function pinResolvableVersions(targetDir: string): Promise<void>;
